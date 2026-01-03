import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/errorUtils";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";

const AccountDeletionSection = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (confirmText !== "ELIMINAR") {
      toast({
        title: "Confirmación incorrecta",
        description: "Por favor escribe ELIMINAR para confirmar.",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    try {
      // Call edge function to handle deletion and anonymization
      const { error } = await supabase.functions.invoke("delete-account", {
        body: { userId: user.id },
      });

      if (error) throw error;

      // Sign out the user
      await signOut();

      toast({
        title: "Cuenta eliminada",
        description: "Tu cuenta ha sido eliminada exitosamente.",
      });

      navigate("/");
    } catch (error: unknown) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDialogOpen(false);
      setConfirmText("");
    }
  };

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Zona de Peligro
        </CardTitle>
        <CardDescription>
          Acciones irreversibles relacionadas con tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <h4 className="font-medium text-foreground">Eliminar Cuenta</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Una vez eliminada, tu cuenta no podrá ser recuperada. Todos tus datos
            personales serán anonimizados, pero tu historial de compras se
            mantendrá para fines contables.
          </p>
          
          <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="mt-4">
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar mi cuenta
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                <AlertDialogDescription className="space-y-4">
                  <p>
                    Esta acción no puede ser revertida. Se eliminarán permanentemente:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Tu perfil y datos personales</li>
                    <li>Tu progreso en cursos</li>
                    <li>Tus roles y permisos</li>
                  </ul>
                  <p className="text-sm">
                    Tu historial de compras será anonimizado pero mantenido por
                    razones legales y contables.
                  </p>
                  <div className="pt-4">
                    <Label htmlFor="confirm-delete">
                      Escribe <span className="font-bold">ELIMINAR</span> para confirmar:
                    </Label>
                    <Input
                      id="confirm-delete"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder="ELIMINAR"
                      className="mt-2"
                    />
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setConfirmText("")}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || confirmText !== "ELIMINAR"}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Eliminando...
                    </>
                  ) : (
                    "Eliminar Cuenta"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountDeletionSection;
