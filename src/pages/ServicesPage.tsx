import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { Clock, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

interface ServiceWithInstructor {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  duration_minutes: number | null;
  instructor_id: string;
  instructor: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    headline: string | null;
  } | null;
}

const ServicesPage = () => {
  const { t } = useTranslation();

  const { data: services, isLoading } = useQuery({
    queryKey: ["all-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("instructor_services")
        .select(`
          id,
          title,
          description,
          price,
          duration_minutes,
          instructor_id
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch instructor profiles separately
      const instructorIds = [...new Set(data.map((s) => s.instructor_id))];
      const { data: profiles } = await supabase
        .from("public_profiles")
        .select("id, full_name, avatar_url, headline")
        .in("id", instructorIds);

      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

      return data.map((service) => ({
        ...service,
        instructor: profileMap.get(service.instructor_id) || null,
      })) as ServiceWithInstructor[];
    },
  });

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}min`;
    if (hours > 0) return `${hours}h`;
    return `${mins}min`;
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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t("services.title")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("services.subtitle")}
            </p>
          </div>

          {/* Services Grid */}
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex items-center gap-3 pt-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : services && services.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      {service.description && (
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                          {service.description}
                        </p>
                      )}

                      {/* Price and Duration */}
                      <div className="flex items-center gap-4 mb-4">
                        {service.price !== null && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            ${service.price}
                          </Badge>
                        )}
                        {service.duration_minutes && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDuration(service.duration_minutes)}
                          </Badge>
                        )}
                      </div>

                      {/* Instructor */}
                      {service.instructor && (
                        <Link
                          to={`/instructor/profile/${service.instructor.id}`}
                          className="mt-auto pt-4 border-t border-border flex items-center gap-3 hover:bg-muted/50 -mx-4 px-4 py-2 rounded-b-lg transition-colors"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={service.instructor.avatar_url || undefined} />
                            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                              {getInitials(service.instructor.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium text-sm text-foreground truncate">
                              {service.instructor.full_name || t("services.unknownInstructor")}
                            </p>
                            {service.instructor.headline && (
                              <p className="text-xs text-muted-foreground truncate">
                                {service.instructor.headline}
                              </p>
                            )}
                          </div>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
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

export default ServicesPage;
