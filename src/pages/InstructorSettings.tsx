import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import AvatarUpload from "@/components/AvatarUpload";
import CredentialsTags from "@/components/CredentialsTags";
import PasswordChangeForm from "@/components/PasswordChangeForm";
import AccountDeletionSection from "@/components/AccountDeletionSection";
import InstructorServicesManager from "@/components/InstructorServicesManager";
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
  const { t } = useTranslation();
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
        title: t("instructorSettings.saveChanges"),
        description: t("instructorSettings.successMessage") || "Your profile has been updated successfully.",
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
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("instructorSettings.title")}</h1>
            <p className="text-muted-foreground">
              {t("instructorSettings.subtitle")}
            </p>
          </div>
          {user && (
            <Link to={`/instructor/profile/${user.id}`}>
              <Button variant="outline" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                {t("instructorSettings.viewProfile")}
              </Button>
            </Link>
          )}
        </div>

        <div className="max-w-2xl space-y-6">
          {/* Avatar Section */}
          <Card>
            <CardHeader>
              <CardTitle>{t("instructorSettings.profilePhoto")}</CardTitle>
              <CardDescription>
                {t("instructorSettings.profilePhotoDesc")}
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
              <CardTitle>{t("instructorSettings.basicInfo")}</CardTitle>
              <CardDescription>
                {t("instructorSettings.basicInfoDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("instructorSettings.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  {t("instructorSettings.emailCantChange")}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">{t("instructorSettings.fullName")}</Label>
                <Input
                  id="fullName"
                  value={profile.full_name}
                  onChange={(e) => handleInputChange("full_name", e.target.value)}
                  placeholder={t("auth.fullNamePlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="headline">{t("instructorSettings.headline")}</Label>
                <Input
                  id="headline"
                  value={profile.headline}
                  onChange={(e) => handleInputChange("headline", e.target.value)}
                  placeholder={t("instructorSettings.headlinePlaceholder")}
                />
                <p className="text-xs text-muted-foreground">
                  {t("instructorSettings.headlineDesc")}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="affiliation">{t("instructorSettings.affiliation")}</Label>
                <Input
                  id="affiliation"
                  value={profile.affiliation}
                  onChange={(e) => handleInputChange("affiliation", e.target.value)}
                  placeholder={t("instructorSettings.affiliationPlaceholder")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle>{t("instructorSettings.biography")}</CardTitle>
              <CardDescription>
                {t("instructorSettings.biographyDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder={t("instructorSettings.bioPlaceholder")}
                rows={8}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {t("instructorSettings.bioNote")}
              </p>
            </CardContent>
          </Card>

          {/* Credentials */}
          <Card>
            <CardHeader>
              <CardTitle>{t("instructorSettings.credentials")}</CardTitle>
              <CardDescription>
                {t("instructorSettings.credentialsDesc")}
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
              <CardTitle>{t("instructorSettings.socialLinks")}</CardTitle>
              <CardDescription>
                {t("instructorSettings.socialLinksDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="website">{t("instructorSettings.website")}</Label>
                <Input
                  id="website"
                  type="url"
                  value={profile.website_url}
                  onChange={(e) => handleInputChange("website_url", e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">{t("instructorSettings.linkedin")}</Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={profile.linkedin_url}
                  onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">{t("instructorSettings.twitter")}</Label>
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

          {/* Consulting Services */}
          <InstructorServicesManager />

          <Separator />

          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle>{t("instructorSettings.account")}</CardTitle>
              <CardDescription>
                {t("instructorSettings.accountDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("instructorSettings.instructorAccount")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("instructorSettings.instructorPrivileges")}
                  </p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {t("instructorSettings.active")}
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
                  {t("instructorSettings.saving")}
                </>
              ) : (
                t("instructorSettings.saveChanges")
              )}
            </Button>
          </div>
        </div>
    </>
  );
};

export default InstructorSettings;
