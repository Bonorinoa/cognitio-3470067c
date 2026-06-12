import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InstructorCatalogCard from "@/components/InstructorCatalogCard";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useFounderIds } from "@/hooks/queries/useFounderIds";
import { useAuth } from "@/contexts/AuthContext";

interface InstructorProfile {
  id: string;
  full_name: string | null;
  headline: string | null;
  avatar_url: string | null;
  credentials: string[] | null;
}

const InstructorsDirectoryPage = () => {
  const { t } = useTranslation();
  const { user, isLoading: authLoading } = useAuth();
  const { data: founderIds = [] } = useFounderIds();

  const { data: instructors, isLoading } = useQuery({
    queryKey: ["instructors-catalog", founderIds],
    enabled: !!user,
    queryFn: async () => {
      const { data: profiles, error } = await supabase.rpc("get_instructor_catalog");
      if (error) throw error;

      const sorted = (profiles || []).sort((a, b) => {
        const aIsFounder = founderIds.includes(a.id);
        const bIsFounder = founderIds.includes(b.id);
        if (aIsFounder && !bIsFounder) return -1;
        if (!aIsFounder && bIsFounder) return 1;
        if (aIsFounder && bIsFounder) {
          return founderIds.indexOf(a.id) - founderIds.indexOf(b.id);
        }
        return (a.full_name || "").localeCompare(b.full_name || "");
      });

      return sorted as InstructorProfile[];
    },
  });

  if (!authLoading && !user) {
    return <Navigate to="/auth" replace state={{ from: "/instructors/directory" }} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t("instructors.title")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("instructors.subtitle")}
          </p>
        </motion.div>

        {isLoading || authLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-6 rounded-xl border border-border bg-card">
                <div className="flex flex-col items-center">
                  <Skeleton className="h-24 w-24 rounded-full mb-4" />
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-48 mb-3" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : instructors && instructors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {instructors.map((instructor, index) => (
              <InstructorCatalogCard
                key={instructor.id}
                id={instructor.id}
                fullName={instructor.full_name}
                headline={instructor.headline}
                avatarUrl={instructor.avatar_url}
                credentials={instructor.credentials}
                isFounder={founderIds.includes(instructor.id)}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {t("instructors.noInstructors")}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default InstructorsDirectoryPage;
