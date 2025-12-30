import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InstructorCatalogCard from "@/components/InstructorCatalogCard";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

// Hardcoded founder IDs - these will always be the founders
const FOUNDER_IDS = [
  "1c52c631-c5dc-4f45-9a61-b7b6ca6dc96c", // Gustavo
  "dfd5e06a-2598-4d7b-9e93-bb24652ebb25", // Augusto
];

interface InstructorProfile {
  id: string;
  full_name: string | null;
  headline: string | null;
  avatar_url: string | null;
  credentials: string[] | null;
}

const InstructorsPage = () => {
  const { t } = useTranslation();

  const { data: instructors, isLoading } = useQuery({
    queryKey: ["instructors-catalog"],
    queryFn: async () => {
      // Get all users with instructor role
      const { data: instructorRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "instructor");

      if (rolesError) throw rolesError;

      if (!instructorRoles || instructorRoles.length === 0) {
        return [];
      }

      const instructorIds = instructorRoles.map((r) => r.user_id);

      // Fetch profiles for instructors
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, headline, avatar_url, credentials")
        .in("id", instructorIds);

      if (profilesError) throw profilesError;

      // Sort: founders first, then alphabetically
      const sorted = (profiles || []).sort((a, b) => {
        const aIsFounder = FOUNDER_IDS.includes(a.id);
        const bIsFounder = FOUNDER_IDS.includes(b.id);

        if (aIsFounder && !bIsFounder) return -1;
        if (!aIsFounder && bIsFounder) return 1;

        // Within founders, keep Gustavo first, then Augusto
        if (aIsFounder && bIsFounder) {
          return FOUNDER_IDS.indexOf(a.id) - FOUNDER_IDS.indexOf(b.id);
        }

        // Alphabetically for non-founders
        return (a.full_name || "").localeCompare(b.full_name || "");
      });

      return sorted as InstructorProfile[];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
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

        {/* Instructors Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-6 rounded-xl border border-border bg-card">
                <div className="flex flex-col items-center">
                  <Skeleton className="h-24 w-24 rounded-full mb-4" />
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-48 mb-3" />
                  <div className="flex gap-2 mb-4">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
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
                isFounder={FOUNDER_IDS.includes(instructor.id)}
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default InstructorsPage;
