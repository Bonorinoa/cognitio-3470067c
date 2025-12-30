import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import InstructorSidebar from "@/components/InstructorSidebar";
import AvatarUpload from "@/components/AvatarUpload";
import CredentialsTags from "@/components/CredentialsTags";
import PasswordChangeForm from "@/components/PasswordChangeForm";
import AccountDeletionSection from "@/components/AccountDeletionSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, Loader2 } from "lucide-react";

interface ProfileData {
  full_name: string;
  avatar_url: string | null;
  headline: string;
  bio: string;
  affiliation: string;
  website_url: string;
  linkedin_url: string;
  twitter_url: string;
  credentials: string[];
}

const InstructorSettings = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    full_name: "",
    avatar_url: null,
    headline: "",
    bio: "",
    affiliation: "",
    website_url: "",
    linkedin_url: "",
    twitter_url: "",
    credentials: [],
  });

  // Fetch current profile data
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["instructor-profile-settings", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, headline, bio, affiliation, website_url, linkedin_url, twitter_url, credentials")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Update local state when profile data loads
  useEffect(() => {
    if (profileData) {
      setProfile({
        full_name: profileData.full_name || "",
        avatar_url: profileData.avatar_url || null,
        headline: profileData.headline || "",
        bio: profileData.bio || "",
        affiliation: profileData.affiliation || "",
        website_url: profileData.website_url || "",
        linkedin_url: profileData.linkedin_url || "",
        twitter_url: profileData.twitter_url || "",
        credentials: profileData.credentials || [],
      });
    }
  }, [profileData]);

  const handleInputChange = (field: keyof ProfileData, value: string | string[]) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Update profile in database
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          headline: profile.headline,
          bio: profile.bio,
          affiliation: profile.affiliation,
          website_url: profile.website_url || null,
          linkedin_url: profile.linkedin_url || null,
          twitter_url: profile.twitter_url || null,
          credentials: profile.credentials,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Also update auth metadata for full_name
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: profile.full_name },
      });

      if (authError) throw authError;

      toast({
        title: "Settings saved",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <InstructorSidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <InstructorSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">
              Manage your profile and account preferences
            </p>
          </div>
          {user && (
            <Link to={`/instructor/profile/${user.id}`}>
              <Button variant="outline" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                View Public Profile
              </Button>
            </Link>
          )}
        </div>

        <div className="max-w-2xl space-y-6">
          {/* Avatar Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>
                Your profile photo will be displayed on your public profile and courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user && (
                <AvatarUpload
                  userId={user.id}
                  currentAvatarUrl={profile.avatar_url}
                  fullName={profile.full_name}
                  onAvatarChange={(url) => handleInputChange("avatar_url", url)}
                />
              )}
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Your name and professional headline
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profile.full_name}
                  onChange={(e) => handleInputChange("full_name", e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="headline">Professional Headline</Label>
                <Input
                  id="headline"
                  value={profile.headline}
                  onChange={(e) => handleInputChange("headline", e.target.value)}
                  placeholder="e.g., Ph.D. in Economics | Risk Management Expert"
                />
                <p className="text-xs text-muted-foreground">
                  A short description that appears below your name
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="affiliation">Affiliation</Label>
                <Input
                  id="affiliation"
                  value={profile.affiliation}
                  onChange={(e) => handleInputChange("affiliation", e.target.value)}
                  placeholder="e.g., Universidad Nacional del Sur"
                />
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle>Biography</CardTitle>
              <CardDescription>
                Tell students about your background and expertise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Share your professional background, research interests, and teaching philosophy..."
                rows={8}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                This will be displayed on your public profile page
              </p>
            </CardContent>
          </Card>

          {/* Credentials */}
          <Card>
            <CardHeader>
              <CardTitle>Credentials & Degrees</CardTitle>
              <CardDescription>
                Add your academic degrees and professional certifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CredentialsTags
                credentials={profile.credentials}
                onChange={(creds) => handleInputChange("credentials", creds)}
              />
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>
                Connect your professional profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={profile.website_url}
                  onChange={(e) => handleInputChange("website_url", e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={profile.linkedin_url}
                  onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter / X</Label>
                <Input
                  id="twitter"
                  type="url"
                  value={profile.twitter_url}
                  onChange={(e) => handleInputChange("twitter_url", e.target.value)}
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Your account status and privileges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Instructor Account</p>
                  <p className="text-sm text-muted-foreground">
                    You have instructor privileges on this platform
                  </p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  Active
                </span>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Password Change */}
          <PasswordChangeForm />

          <Separator />

          {/* Account Deletion */}
          <AccountDeletionSection />

          <Separator />

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isLoading} size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstructorSettings;
