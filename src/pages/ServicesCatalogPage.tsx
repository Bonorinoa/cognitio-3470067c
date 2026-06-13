import { useState, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { SEO } from "@/components/SEO";

interface ServiceWithInstructor {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  duration_minutes: number | null;
  instructor_id: string;
  created_at: string;
  instructor: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    headline: string | null;
  } | null;
}

type SortOption = "newest" | "price_low" | "price_high" | "duration";

const ServicesCatalogPage = () => {
  const { t } = useTranslation();
  const { user, isLoading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const { data: services, isLoading } = useQuery({
    queryKey: ["all-services"],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("instructor_services")
        .select(`
          id,
          title,
          description,
          price,
          duration_minutes,
          instructor_id,
          created_at
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const instructorIds = [...new Set(data.map((s) => s.instructor_id))];
      const profilePromises = instructorIds.map(async (id) => {
        const { data: profile } = await supabase.rpc("get_public_profile", { profile_id: id });
        return profile?.[0] || null;
      });
      const profiles = await Promise.all(profilePromises);
      const profileMap = new Map(
        profiles.filter(Boolean).map((p) => [p!.id, p])
      );

      return data.map((service) => ({
        ...service,
        instructor: profileMap.get(service.instructor_id) || null,
      })) as ServiceWithInstructor[];
    },
  });

  const filteredAndSortedServices = useMemo(() => {
    if (!services) return [];
    let result = [...services];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.description?.toLowerCase().includes(query) ||
          s.instructor?.full_name?.toLowerCase().includes(query)
      );
    }
    switch (sortBy) {
      case "price_low":
        result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "price_high":
        result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "duration":
        result.sort((a, b) => (a.duration_minutes ?? 0) - (b.duration_minutes ?? 0));
        break;
      default:
        break;
    }
    return result;
  }, [services, searchQuery, sortBy]);

  if (!authLoading && !user) {
    return <Navigate to="/auth" replace state={{ from: "/services/catalog" }} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Catálogo de servicios"
        description="Consultoría, mentoría y servicios profesionales ofrecidos por instructores invitados de Cognitio."
        path="/services/catalog"
      />
      <Navbar />


      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t("services.title")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("services.subtitle")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t("services.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t("services.sortNewest")}</SelectItem>
                <SelectItem value="price_low">{t("services.sortPriceLow")}</SelectItem>
                <SelectItem value="price_high">{t("services.sortPriceHigh")}</SelectItem>
                <SelectItem value="duration">{t("services.sortDuration")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading || authLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredAndSortedServices.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAndSortedServices.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  id={service.id}
                  title={service.title}
                  description={service.description}
                  price={service.price}
                  durationMinutes={service.duration_minutes}
                  instructor={
                    service.instructor
                      ? {
                          id: service.instructor.id,
                          fullName: service.instructor.full_name,
                          avatarUrl: service.instructor.avatar_url,
                          headline: service.instructor.headline,
                        }
                      : null
                  }
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">{t("services.noServices")}</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServicesCatalogPage;
