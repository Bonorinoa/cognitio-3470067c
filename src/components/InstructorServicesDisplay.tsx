import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, Clock, DollarSign } from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  duration_minutes: number | null;
}

interface InstructorServicesDisplayProps {
  instructorId: string;
}

const InstructorServicesDisplay = ({ instructorId }: InstructorServicesDisplayProps) => {
  const { t } = useTranslation();

  const { data: services, isLoading } = useQuery({
    queryKey: ["instructor-public-services", instructorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("instructor_services")
        .select("id, title, description, price, duration_minutes")
        .eq("instructor_id", instructorId)
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Service[];
    },
    enabled: !!instructorId,
  });

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="mt-8"
    >
      <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
        <Briefcase className="h-5 w-5 text-primary" />
        {t("instructorProfile.servicesOffered")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="h-full border-border/50 bg-card/80 backdrop-blur-sm hover:border-primary/30 transition-colors">
              <CardContent className="p-5">
                <h3 className="font-medium text-foreground mb-2">{service.title}</h3>
                
                {service.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                    {service.description}
                  </p>
                )}

                <div className="flex items-center gap-3 flex-wrap">
                  {service.price != null && (
                    <Badge variant="secondary" className="flex items-center gap-1 bg-primary/10 text-primary border-primary/20">
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
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default InstructorServicesDisplay;
