import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  BarChart3,
  Settings,
  GraduationCap,
  Sparkles,
  Users,
  DollarSign,
  UserCircle2,
  Award,
  Shield,
  Building2,
  Cpu,
  Database,
  FileEdit,
  Linkedin,
  Twitter,
  Mail,
  Quote,
  Archive,
  type LucideIcon,
} from "lucide-react";

export interface PanelNavItem {
  href: string;
  icon: LucideIcon;
  label: string;
  /** Mark as disabled "Coming soon" — renders as non-clickable with a badge. */
  comingSoon?: boolean;
  /** Optional badge text override. */
  badge?: string;
  /** When true, exact match on pathname; otherwise prefix match. */
  exact?: boolean;
}

export interface PanelNavSection {
  /** Section label shown above the items (uppercase eyebrow). Omit for ungrouped items. */
  label?: string;
  items: PanelNavItem[];
}

export interface PanelNavFooterItem {
  href: string;
  icon: LucideIcon;
  label: string;
  variant?: "accent" | "muted";
}

export interface PanelNavConfig {
  /** Short role label rendered under the Cognitio logo. */
  roleLabel: string;
  /** Sticky-pill layoutId scoped to this panel so animations don't bleed. */
  layoutId: string;
  sections: PanelNavSection[];
  footer?: PanelNavFooterItem[];
}

// -----------------------------------------------------------------------------
// Instructor
// -----------------------------------------------------------------------------
export const instructorNav: PanelNavConfig = {
  roleLabel: "Panel de Instructor",
  layoutId: "instructor-panel-indicator",
  sections: [
    {
      label: "Mi trabajo",
      items: [
        { href: "/instructor", icon: LayoutDashboard, label: "Resumen", exact: true },
        { href: "/instructor/courses", icon: BookOpen, label: "Cursos" },
        { href: "/instructor/create", icon: PlusCircle, label: "Crear curso" },
      ],
    },
    {
      label: "Crecimiento",
      items: [
        { href: "/instructor/analytics", icon: BarChart3, label: "Analíticas" },
        { href: "/instructor/ai-insights", icon: Sparkles, label: "IA en tus cursos" },
        { href: "/instructor/revenue", icon: DollarSign, label: "Ingresos", comingSoon: true },
        { href: "/instructor/students", icon: Users, label: "Estudiantes", comingSoon: true },
      ],
    },
    {
      label: "Mi presencia",
      items: [
        { href: "/instructor/profile", icon: UserCircle2, label: "Perfil público", comingSoon: true },
        { href: "/instructor/guide", icon: GraduationCap, label: "Guía" },
        { href: "/instructor/settings", icon: Settings, label: "Ajustes" },
      ],
    },
  ],
  footer: [
    { href: "/ai-studio", icon: Sparkles, label: "AI Studio", variant: "accent" },
  ],
};

// -----------------------------------------------------------------------------
// Student
// -----------------------------------------------------------------------------
export const studentNav: PanelNavConfig = {
  roleLabel: "Mi Aprendizaje",
  layoutId: "student-panel-indicator",
  sections: [
    {
      items: [
        { href: "/dashboard", icon: LayoutDashboard, label: "Resumen", exact: true },
        { href: "/courses", icon: BookOpen, label: "Catálogo" },
        { href: "/dashboard/certificates", icon: Award, label: "Certificados", comingSoon: true },
        { href: "/settings", icon: Settings, label: "Ajustes" },
      ],
    },
  ],
};

// -----------------------------------------------------------------------------
// Admin
// -----------------------------------------------------------------------------
export const adminNav: PanelNavConfig = {
  roleLabel: "Panel de Admin",
  layoutId: "admin-panel-indicator",
  sections: [
    {
      label: "Personas",
      items: [
        { href: "/admin", icon: Users, label: "Usuarios y roles", exact: true },
        { href: "/admin/invitations", icon: PlusCircle, label: "Invitaciones", comingSoon: true },
      ],
    },
    {
      label: "Contenido",
      items: [
        { href: "/admin/courses", icon: BookOpen, label: "Cursos", comingSoon: true },
        { href: "/admin/institutions", icon: Building2, label: "Instituciones", comingSoon: true },
      ],
    },
    {
      label: "Plataforma",
      items: [
        { href: "/admin/ai-tutor", icon: Cpu, label: "AI Tutor" },
        { href: "/admin/security", icon: Shield, label: "Seguridad", comingSoon: true },
      ],
    },
  ],
};

// -----------------------------------------------------------------------------
// AI Studio
// -----------------------------------------------------------------------------
export const aiStudioNav: PanelNavConfig = {
  roleLabel: "AI Studio",
  layoutId: "ai-studio-panel-indicator",
  sections: [
    {
      label: "Studio",
      items: [
        { href: "/ai-studio", icon: LayoutDashboard, label: "Resumen", exact: true },
        { href: "/ai-studio/knowledge", icon: Database, label: "Conocimiento" },
        { href: "/ai-studio/drafts", icon: Archive, label: "Borradores" },
        { href: "/ai-studio/settings", icon: Settings, label: "Ajustes" },
      ],
    },
    {
      label: "Marketing",
      items: [
        { href: "/ai-studio/marketing/blog", icon: FileEdit, label: "Blog" },
        { href: "/ai-studio/marketing/linkedin", icon: Linkedin, label: "LinkedIn", comingSoon: true },
        { href: "/ai-studio/marketing/twitter", icon: Twitter, label: "X / Twitter", comingSoon: true },
        { href: "/ai-studio/marketing/newsletter", icon: Mail, label: "Newsletter", comingSoon: true },
      ],
    },
    {
      label: "Académico",
      items: [
        { href: "/ai-studio/academic/literature-review", icon: BookOpen, label: "Revisión de literatura", comingSoon: true },
        { href: "/ai-studio/academic/paper-formatter", icon: FileEdit, label: "Formateador de papers", comingSoon: true },
        { href: "/ai-studio/academic/paper-editor", icon: Quote, label: "Editor de papers", comingSoon: true },
      ],
    },
  ],
};

