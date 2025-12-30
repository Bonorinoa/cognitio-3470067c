import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Clock, DollarSign, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  durationMinutes: number | null;
  instructor: {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
    headline: string | null;
  } | null;
  index?: number;
}

const ServiceCard = ({
  title,
  description,
  price,
  durationMinutes,
  instructor,
  index = 0,
}: ServiceCardProps) => {
  const { t } = useTranslation();

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Card className="h-full flex flex-col rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {description && (
            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
              {description}
            </p>
          )}

          {/* Price and Duration */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {price !== null && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                ${price}
              </Badge>
            )}
            {durationMinutes && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(durationMinutes)}
              </Badge>
            )}
          </div>

          {/* Instructor + CTA */}
          {instructor && (
            <div className="mt-auto pt-4 border-t border-border space-y-3">
              <Link
                to={`/instructor/profile/${instructor.id}`}
                className="flex items-center gap-3 hover:bg-muted/50 -mx-2 px-2 py-2 rounded-lg transition-colors"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={instructor.avatarUrl || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {getInitials(instructor.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm text-foreground truncate">
                    {instructor.fullName || t("services.unknownInstructor")}
                  </p>
                  {instructor.headline && (
                    <p className="text-xs text-muted-foreground truncate">
                      {instructor.headline}
                    </p>
                  )}
                </div>
              </Link>
              
              <Button
                asChild
                variant="outline"
                size="sm"
                className="w-full gap-2"
              >
                <Link to={`/instructor/profile/${instructor.id}#contact`}>
                  <MessageCircle className="h-4 w-4" />
                  {t("services.contactCTA")}
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ServiceCard;
