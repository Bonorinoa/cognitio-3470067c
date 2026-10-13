// Resolve a user's Stripe customer WITHOUT ever matching by email.
// Order: stored stripe_customers row -> Stripe search on metadata.user_id -> create.
// deno-lint-ignore-file no-explicit-any
export async function findStripeCustomerId(
  stripe: any,
  supabaseAdmin: any,
  userId: string,
): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("stripe_customers").select("stripe_customer_id").eq("user_id", userId).maybeSingle();
  if (data?.stripe_customer_id) return data.stripe_customer_id as string;

  if (!/^[0-9a-f-]{36}$/i.test(userId)) return null;
  const found = await stripe.customers.search({ query: `metadata['user_id']:'${userId}'`, limit: 1 });
  const id = found.data?.[0]?.id ?? null;
  if (id) {
    await supabaseAdmin.from("stripe_customers")
      .upsert({ user_id: userId, stripe_customer_id: id }, { onConflict: "user_id" });
  }
  return id;
}

export async function getOrCreateStripeCustomerId(
  stripe: any,
  supabaseAdmin: any,
  userId: string,
  email: string | undefined,
): Promise<string> {
  const existing = await findStripeCustomerId(stripe, supabaseAdmin, userId);
  if (existing) return existing;
  const customer = await stripe.customers.create({
    email,
    metadata: { user_id: userId },
  });
  const { error } = await supabaseAdmin.from("stripe_customers")
    .insert({ user_id: userId, stripe_customer_id: customer.id });
  if (error) throw new Error("Failed to store Stripe customer");
  return customer.id;
}
