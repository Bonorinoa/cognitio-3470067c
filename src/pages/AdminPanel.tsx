import { useTranslation } from "react-i18next";
import { Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import { AITutorSettingsCard } from "@/components/admin/AITutorSettingsCard";
import { UserManagementCard } from "@/components/admin/UserManagementCard";
import { WaitlistManagementCard } from "@/components/admin/WaitlistManagementCard";

const AdminPanel = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            {t("admin.title", "Panel de Administración")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("admin.subtitle", "Gestiona usuarios, roles y configuración de la plataforma")}
          </p>
        </div>

        <AITutorSettingsCard />
        <UserManagementCard />
        <WaitlistManagementCard />
      </main>
    </div>
  );
};

export default AdminPanel;
