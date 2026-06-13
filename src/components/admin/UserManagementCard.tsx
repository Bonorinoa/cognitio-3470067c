import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Search, UserMinus, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface UserWithRoles {
  id: string;
  email: string | null;
  full_name: string | null;
  roles: AppRole[];
}

export function UserManagementCard() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

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

      const result: UserWithRoles[] = (profiles || []).map((profile) => ({
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        roles: (userRoles || []).filter((r) => r.user_id === profile.id).map((r) => r.role),
      }));
      return result;
    },
  });

  const assignInstructor = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: "instructor" as AppRole });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: t("admin.users.assignSuccess", "Rol de instructor asignado") });
    },
    onError: (error: Error) => {
      toast({ title: t("admin.users.assignFail", "Error al asignar rol"), description: error.message, variant: "destructive" });
    },
  });

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
      toast({ title: t("admin.users.removeSuccess", "Rol de instructor removido") });
    },
    onError: (error: Error) => {
      toast({ title: t("admin.users.removeFail", "Error al remover rol"), description: error.message, variant: "destructive" });
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {t("admin.users.title", "Gestión de Usuarios")}
        </CardTitle>
        <CardDescription>
          {t("admin.users.subtitle", "Visualiza todos los usuarios y gestiona sus roles. Los instructores pueden crear y publicar cursos.")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("admin.users.searchPlaceholder", "Buscar por nombre o email...")}
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
                  <TableHead>{t("admin.users.col.user", "Usuario")}</TableHead>
                  <TableHead>{t("admin.users.col.email", "Email")}</TableHead>
                  <TableHead>{t("admin.users.col.roles", "Roles")}</TableHead>
                  <TableHead className="text-right">{t("admin.users.col.actions", "Acciones")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      {t("admin.users.noResults", "No se encontraron usuarios")}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.full_name || t("admin.users.noName", "Sin nombre")}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email || t("admin.users.noEmail", "Sin email")}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {isAdmin(user) && <Badge variant="default">{t("admin.users.roleAdmin", "Admin")}</Badge>}
                          {isInstructor(user) && <Badge variant="secondary">{t("admin.users.roleInstructor", "Instructor")}</Badge>}
                          {user.roles.length === 0 && <Badge variant="outline">{t("admin.users.roleStudent", "Estudiante")}</Badge>}
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
                                {t("admin.users.removeInstructor", "Remover instructor")}
                              </Button>
                            ) : (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => assignInstructor.mutate(user.id)}
                                disabled={assignInstructor.isPending}
                              >
                                <UserPlus className="h-4 w-4 mr-1" />
                                {t("admin.users.makeInstructor", "Hacer instructor")}
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
  );
}
