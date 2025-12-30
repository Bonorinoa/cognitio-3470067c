import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface InstructorCatalogCardProps {
  id: string;
  fullName: string | null;
  headline: string | null;
  avatarUrl: string | null;
  credentials: string[] | null;
  isFounder?: boolean;
  index?: number;
}

const InstructorCatalogCard = ({
  id,
  fullName,
  headline,
  avatarUrl,
  credentials,
  isFounder = false,
  index = 0,
}: InstructorCatalogCardProps) => {
  const { t } = useTranslation();

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
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="group relative overflow-hidden rounded-xl border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {isFounder && (
          <Badge 
            className="absolute top-3 right-3 z-10 bg-primary text-primary-foreground"
          >
            {t('instructors.founderBadge')}
          </Badge>
        )}
        
        <CardContent className="flex flex-col items-center p-6 text-center">
          <Avatar className="h-24 w-24 mb-4 ring-2 ring-border group-hover:ring-primary transition-all duration-300">
            <AvatarImage src={avatarUrl || undefined} alt={fullName || "Instructor"} />
            <AvatarFallback className="bg-muted text-muted-foreground text-xl">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>

          <h3 className="text-lg font-semibold text-foreground mb-1">
            {fullName || "Instructor"}
          </h3>

          {headline && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {headline}
            </p>
          )}

          {credentials && credentials.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 mb-4">
              {credentials.slice(0, 3).map((credential, idx) => (
                <Badge 
                  key={idx} 
                  variant="secondary" 
                  className="text-xs"
                >
                  {credential}
                </Badge>
              ))}
            </div>
          )}

          <Button asChild variant="outline" size="sm" className="mt-auto">
            <Link to={`/instructor/profile/${id}`}>
              {t('instructors.viewProfile')}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InstructorCatalogCard;
