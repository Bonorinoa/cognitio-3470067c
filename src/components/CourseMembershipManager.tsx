import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Trash2, Loader2, Users } from "lucide-react";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

interface CourseMembershipManagerProps {
  courseId: string;
}

interface EnrolledStudent {
  id: string;
  user_id: string;
  enrolled_at: string;
  profile: {
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
  } | null;
}

const CourseMembershipManager = ({ courseId }: CourseMembershipManagerProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Fetch enrolled students with their profiles
  const { data: enrolledStudents, isLoading } = useQuery({
    queryKey: ["course-memberships", courseId],
    queryFn: async () => {
      // First get memberships
      const { data: memberships, error: membershipsError } = await supabase
        .from("course_memberships")
        .select("id, user_id, enrolled_at")
        .eq("course_id", courseId)
        .order("enrolled_at", { ascending: false });

      if (membershipsError) throw membershipsError;
      if (!memberships || memberships.length === 0) return [];

      // Then get profiles for those users
      const userIds = memberships.map((m) => m.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, email, avatar_url")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      // Combine the data
      return memberships.map((m) => ({
        ...m,
        profile: profiles?.find((p) => p.id === m.user_id) || null,
      })) as EnrolledStudent[];
    },
  });

  // Add student mutation
  const addStudentMutation = useMutation({
    mutationFn: async (studentEmail: string) => {
      // First, find the user by email in profiles
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("email", studentEmail.trim().toLowerCase())
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) {
        throw new Error("not_found");
      }

      // Check if already enrolled
      const { data: existing } = await supabase
        .from("course_memberships")
        .select("id")
        .eq("course_id", courseId)
        .eq("user_id", profile.id)
        .maybeSingle();

      if (existing) {
        throw new Error("already_enrolled");
      }

      // Prevent self-enrollment
      if (profile.id === user?.id) {
        throw new Error("self_enrollment");
      }

      // Add to course_memberships
      const { error: insertError } = await supabase
        .from("course_memberships")
        .insert({
          course_id: courseId,
          user_id: profile.id,
          enrolled_by: user?.id,
        });

      if (insertError) throw insertError;

      return profile;
    },
    onSuccess: (profile) => {
      toast.success(t("membership.studentAdded", { name: profile.full_name || email }));
      setEmail("");
      queryClient.invalidateQueries({ queryKey: ["course-memberships", courseId] });
    },
    onError: (error: Error) => {
      if (error.message === "not_found") {
        toast.error(t("membership.studentNotFound"));
      } else if (error.message === "already_enrolled") {
        toast.info(t("membership.studentAlreadyEnrolled"));
      } else if (error.message === "self_enrollment") {
        toast.error(t("membership.cannotEnrollSelf"));
      } else {
        toast.error(t("membership.errorAdding"));
      }
    },
  });

  // Remove student mutation
  const removeStudentMutation = useMutation({
    mutationFn: async (membershipId: string) => {
      const { error } = await supabase
        .from("course_memberships")
        .delete()
        .eq("id", membershipId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t("membership.studentRemoved"));
      queryClient.invalidateQueries({ queryKey: ["course-memberships", courseId] });
    },
    onError: () => {
      toast.error(t("membership.errorRemoving"));
    },
  });

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsAdding(true);
    await addStudentMutation.mutateAsync(email);
    setIsAdding(false);
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-foreground flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t("membership.title")}
          </CardTitle>
          <HelpTooltip content={t("help.membership.helpDesc")} />
        </div>
        <CardDescription>
          {t("membership.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add student form */}
        <form onSubmit={handleAddStudent} className="flex gap-2">
          <Input
            type="email"
            placeholder={t("membership.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-background border-border flex-1"
          />
          <Button type="submit" size="sm" disabled={isAdding || !email.trim()}>
            {isAdding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
          </Button>
        </form>

        {/* Enrolled students list */}
        {isLoading ? (
          <div className="text-center py-4 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
          </div>
        ) : !enrolledStudents || enrolledStudents.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm">
            {t("membership.noStudents")}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>{t("membership.enrolledCount", { count: enrolledStudents.length })}</span>
            </div>
            {enrolledStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center gap-3 p-2 rounded-lg border border-border bg-muted/30"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={student.profile?.avatar_url || undefined} />
                  <AvatarFallback className="text-xs">
                    {getInitials(student.profile?.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {student.profile?.full_name || t("membership.unknownUser")}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {student.profile?.email}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  onClick={() => removeStudentMutation.mutate(student.id)}
                  disabled={removeStudentMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseMembershipManager;
