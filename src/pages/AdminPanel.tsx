import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader2, Shield, UserPlus, UserMinus, Search, Users, Bot, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface UserWithRoles {
  id: string;
  email: string | null;
  full_name: string | null;
  roles: AppRole[];
}

const DEFAULT_SYSTEM_PROMPT = `You are CognitioAI, a Socratic learning assistant for the Cognitio platform. Your role is to help students understand course material by guiding them to discover answers themselves rather than giving direct answers.

Guidelines:
- Ask clarifying questions to understand what the student is struggling with
- Break down complex concepts into simpler parts
- Use analogies and examples relevant to the course content
- Reference the video transcript when helpful
- Encourage critical thinking
- Be supportive and patient
- Keep responses concise and focused`;

const AI_MODELS = [
  { value: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash (Recommended)" },
  { value: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro" },
  { value: "google/gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite" },
  { value: "openai/gpt-5-mini", label: "GPT-5 Mini" },
  { value: "openai/gpt-5-nano", label: "GPT-5 Nano" },
];

const AdminPanel = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  // AI Tutor Settings State
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiSystemPrompt, setAiSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [aiModel, setAiModel] = useState("google/gemini-2.5-flash");
  const [aiTemperature, setAiTemperature] = useState(0.7);
  const [aiMaxTokens, setAiMaxTokens] = useState(1024);

  // Fetch all profiles with their roles
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      const usersWithRoles: UserWithRoles[] = (profiles || []).map((profile) => ({
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        roles: (userRoles || [])
          .filter((r) => r.user_id === profile.id)
          .map((r) => r.role),
      }));

      return usersWithRoles;
    },
  });

  // Fetch AI Tutor Settings
  const { isLoading: isLoadingSettings } = useQuery({
    queryKey: ["ai-tutor-settings-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("platform_settings")
        .select("key, value")
        .in("key", [
          "ai_tutor_enabled",
          "ai_tutor_system_prompt",
          "ai_tutor_model",
          "ai_tutor_temperature",
          "ai_tutor_max_tokens",
        ]);

      if (error) throw error;

      const settingsMap = data.reduce((acc, { key, value }) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, unknown>);

      setAiEnabled(settingsMap.ai_tutor_enabled as boolean ?? true);
      setAiSystemPrompt(settingsMap.ai_tutor_system_prompt as string ?? DEFAULT_SYSTEM_PROMPT);
      setAiModel(settingsMap.ai_tutor_model as string ?? "google/gemini-2.5-flash");
      setAiTemperature(settingsMap.ai_tutor_temperature as number ?? 0.7);
      setAiMaxTokens(settingsMap.ai_tutor_max_tokens as number ?? 1024);

      return settingsMap;
    },
  });

  // Save AI Tutor Settings
  const saveAISettings = useMutation({
    mutationFn: async () => {
      const settings = [
        { key: "ai_tutor_enabled", value: aiEnabled },
        { key: "ai_tutor_system_prompt", value: aiSystemPrompt },
        { key: "ai_tutor_model", value: aiModel },
        { key: "ai_tutor_temperature", value: aiTemperature },
        { key: "ai_tutor_max_tokens", value: aiMaxTokens },
      ];

      for (const setting of settings) {
        const { error } = await supabase
          .from("platform_settings")
          .upsert({ key: setting.key, value: setting.value as unknown as Database["public"]["Tables"]["platform_settings"]["Insert"]["value"] }, { onConflict: "key" });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-tutor-settings"] });
      toast({ title: "AI Tutor settings saved successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to save settings", description: error.message, variant: "destructive" });
    },
  });

  // Assign instructor role
  const assignInstructor = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: "instructor" as AppRole });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "Instructor role assigned successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to assign role", description: error.message, variant: "destructive" });
    },
  });

  // Remove instructor role
  const removeInstructor = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .in("role", ["teacher", "instructor"]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "Instructor role removed successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to remove role", description: error.message, variant: "destructive" });
    },
  });

  const filteredUsers = users?.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isInstructor = (user: UserWithRoles) => 
    user.roles.includes("teacher") || user.roles.includes("instructor");
  const isAdmin = (user: UserWithRoles) => user.roles.includes("admin");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage users, roles, and platform settings
          </p>
        </div>

        {/* AI Tutor Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Tutor Settings
            </CardTitle>
            <CardDescription>
              Configure the AI tutor that helps students in course discussions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoadingSettings ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {/* Enable/Disable Toggle */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/50">
                  <div>
                    <Label htmlFor="ai-enabled" className="text-base font-medium">
                      AI Tutor Enabled
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      When disabled, students cannot use @CognitioAI in discussions
                    </p>
                  </div>
                  <Switch
                    id="ai-enabled"
                    checked={aiEnabled}
                    onCheckedChange={setAiEnabled}
                  />
                </div>

                {!aiEnabled && (
                  <div className="p-4 rounded-lg border border-destructive bg-destructive/10 text-destructive">
                    ⚠️ AI Tutor is currently disabled for all users
                  </div>
                )}

                {/* System Prompt */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="system-prompt">System Prompt</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAiSystemPrompt(DEFAULT_SYSTEM_PROMPT)}
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Reset to Default
                    </Button>
                  </div>
                  <Textarea
                    id="system-prompt"
                    value={aiSystemPrompt}
                    onChange={(e) => setAiSystemPrompt(e.target.value)}
                    rows={8}
                    placeholder="Enter the system prompt for the AI tutor..."
                  />
                  <p className="text-xs text-muted-foreground">
                    This prompt defines how the AI tutor behaves and responds to students
                  </p>
                </div>

                {/* Model Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ai-model">AI Model</Label>
                    <Select value={aiModel} onValueChange={setAiModel}>
                      <SelectTrigger id="ai-model">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {AI_MODELS.map((model) => (
                          <SelectItem key={model.value} value={model.value}>
                            {model.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="temperature">
                      Temperature: {aiTemperature.toFixed(1)}
                    </Label>
                    <Input
                      id="temperature"
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={aiTemperature}
                      onChange={(e) => setAiTemperature(parseFloat(e.target.value))}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground">
                      Lower = more focused, Higher = more creative
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-tokens">Max Tokens</Label>
                    <Input
                      id="max-tokens"
                      type="number"
                      min="256"
                      max="4096"
                      step="256"
                      value={aiMaxTokens}
                      onChange={(e) => setAiMaxTokens(parseInt(e.target.value) || 1024)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum response length (256-4096)
                    </p>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={() => saveAISettings.mutate()}
                    disabled={saveAISettings.isPending}
                  >
                    {saveAISettings.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save AI Settings"
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>
              View all users and manage their roles. Instructors can create and publish courses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers?.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.full_name || "No name"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {user.email || "No email"}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {isAdmin(user) && (
                                <Badge variant="default">Admin</Badge>
                              )}
                              {isInstructor(user) && (
                                <Badge variant="secondary">Instructor</Badge>
                              )}
                              {user.roles.length === 0 && (
                                <Badge variant="outline">Student</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {!isAdmin(user) && (
                              <>
                                {isInstructor(user) ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeInstructor.mutate(user.id)}
                                    disabled={removeInstructor.isPending}
                                  >
                                    <UserMinus className="h-4 w-4 mr-1" />
                                    Remove Instructor
                                  </Button>
                                ) : (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => assignInstructor.mutate(user.id)}
                                    disabled={assignInstructor.isPending}
                                  >
                                    <UserPlus className="h-4 w-4 mr-1" />
                                    Make Instructor
                                  </Button>
                                )}
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminPanel;
