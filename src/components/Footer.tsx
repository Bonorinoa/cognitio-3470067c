import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GraduationCap } from "lucide-react";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo and tagline */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <span className="font-semibold text-foreground">Cognitio</span>
              <p className="text-xs text-muted-foreground">
                Nos dedicamos a aprender enseñando
              </p>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="flex items-center gap-6 text-sm">
            <Link 
              to="/courses" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("nav.courses")}
            </Link>
            <Link 
              to="/instructors" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("nav.instructors")}
            </Link>
            <Link 
              to="/services" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("nav.services")}
            </Link>
          </nav>

          {/* Legal links */}
          <nav className="flex items-center gap-4 text-sm">
            <Link 
              to="/terms" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("footer.terms")}
            </Link>
            <Link 
              to="/privacy" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("footer.privacy")}
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Cognitio. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
