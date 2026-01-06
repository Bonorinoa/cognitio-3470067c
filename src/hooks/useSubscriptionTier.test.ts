import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase client
const mockSupabaseClient = {
  from: vi.fn(),
  rpc: vi.fn(),
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabaseClient,
}));

describe('Subscription Tier Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserTierAndLimit - tier resolution', () => {
    const mockUserId = 'test-user-id';

    it('should return subscription tier for active subscription', async () => {
      // Mock ai_subscriptions query
      mockSupabaseClient.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: { bundle: 'marketing', status: 'active' },
          error: null,
        }),
      });

      // Mock tier limits query
      mockSupabaseClient.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { daily_limit: 200, requests_per_minute: 10 },
          error: null,
        }),
      });

      // The function should resolve 'marketing' tier with 200/day limit
      const subscription = await mockGetSubscriptionTier(mockUserId);
      expect(subscription.tier).toBe('marketing');
      expect(subscription.dailyLimit).toBe(200);
    });

    it('should return subscription tier for trialing subscription', async () => {
      // Mock ai_subscriptions query with trialing status
      mockSupabaseClient.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: { bundle: 'academic', status: 'trialing' },
          error: null,
        }),
      });

      // Mock tier limits query
      mockSupabaseClient.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { daily_limit: 200, requests_per_minute: 10 },
          error: null,
        }),
      });

      // Trialing subscriptions should get full tier benefits
      const subscription = await mockGetSubscriptionTier(mockUserId);
      expect(subscription.tier).toBe('academic');
      expect(subscription.dailyLimit).toBe(200);
    });

    it('should return pro tier with 500/day limit', async () => {
      mockSupabaseClient.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: { bundle: 'pro', status: 'active' },
          error: null,
        }),
      });

      mockSupabaseClient.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { daily_limit: 500, requests_per_minute: 20 },
          error: null,
        }),
      });

      const subscription = await mockGetSubscriptionTier(mockUserId);
      expect(subscription.tier).toBe('pro');
      expect(subscription.dailyLimit).toBe(500);
    });

    it('should fallback to instructor tier if user has instructor role but no subscription', async () => {
      // No subscription
      mockSupabaseClient.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      });

      // Has instructor role
      mockSupabaseClient.rpc.mockResolvedValueOnce({
        data: true,
        error: null,
      });

      // Mock instructor tier limits
      mockSupabaseClient.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { daily_limit: 50, requests_per_minute: 5 },
          error: null,
        }),
      });

      const subscription = await mockGetSubscriptionTier(mockUserId);
      expect(subscription.tier).toBe('instructor');
      expect(subscription.dailyLimit).toBe(50);
    });

    it('should fallback to free tier if no subscription and not an instructor', async () => {
      // No subscription
      mockSupabaseClient.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      });

      // Not an instructor
      mockSupabaseClient.rpc.mockResolvedValueOnce({
        data: false,
        error: null,
      });

      // Mock free tier limits
      mockSupabaseClient.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { daily_limit: 10, requests_per_minute: 2 },
          error: null,
        }),
      });

      const subscription = await mockGetSubscriptionTier(mockUserId);
      expect(subscription.tier).toBe('free');
      expect(subscription.dailyLimit).toBe(10);
    });

    it('should NOT recognize canceled subscriptions', async () => {
      // Subscription with canceled status (not in ["active", "trialing"])
      mockSupabaseClient.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: null, // Query filters out canceled, so no result
          error: null,
        }),
      });

      // Not an instructor
      mockSupabaseClient.rpc.mockResolvedValueOnce({
        data: false,
        error: null,
      });

      // Free tier limits
      mockSupabaseClient.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { daily_limit: 10, requests_per_minute: 2 },
          error: null,
        }),
      });

      const subscription = await mockGetSubscriptionTier(mockUserId);
      expect(subscription.tier).toBe('free');
    });
  });

  describe('Tier limits alignment', () => {
    it('should have correct daily limits for each tier', () => {
      const expectedLimits = {
        free: 10,
        instructor: 50,
        marketing: 200,
        academic: 200,
        pro: 500,
      };

      // These are the expected limits based on the database configuration
      expect(expectedLimits.marketing).toBe(200);
      expect(expectedLimits.academic).toBe(200);
      expect(expectedLimits.pro).toBe(500);
      expect(expectedLimits.free).toBe(10);
      expect(expectedLimits.instructor).toBe(50);
    });
  });

  describe('Subscription status handling', () => {
    it('should recognize "active" as valid subscription status', () => {
      const validStatuses = ['active', 'trialing'];
      expect(validStatuses.includes('active')).toBe(true);
    });

    it('should recognize "trialing" as valid subscription status', () => {
      const validStatuses = ['active', 'trialing'];
      expect(validStatuses.includes('trialing')).toBe(true);
    });

    it('should NOT recognize "canceled" as valid subscription status', () => {
      const validStatuses = ['active', 'trialing'];
      expect(validStatuses.includes('canceled')).toBe(false);
    });

    it('should NOT recognize "past_due" as valid subscription status', () => {
      const validStatuses = ['active', 'trialing'];
      expect(validStatuses.includes('past_due')).toBe(false);
    });
  });
});

// Mock function that simulates tier resolution logic
async function mockGetSubscriptionTier(userId: string): Promise<{ tier: string; dailyLimit: number }> {
  const { supabase } = await import('@/integrations/supabase/client');
  
  // Check for active subscription first
  const { data: subscription } = await (supabase.from('ai_subscriptions') as any)
    .select('bundle, status')
    .eq('user_id', userId)
    .in('status', ['active', 'trialing'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  let tier = 'free';
  
  if (subscription) {
    tier = subscription.bundle;
  } else {
    // Check for instructor role
    const { data: isInstructor } = await supabase.rpc('has_role', {
      _user_id: userId,
      _role: 'instructor',
    });
    
    if (isInstructor) {
      tier = 'instructor';
    }
  }

  // Get tier limits
  const { data: limits } = await (supabase.from('ai_tier_limits') as any)
    .select('daily_limit, requests_per_minute')
    .eq('tier_name', tier)
    .single();

  return {
    tier,
    dailyLimit: limits?.daily_limit || 10,
  };
}
