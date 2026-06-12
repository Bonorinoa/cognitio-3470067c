import type { TFunction } from "i18next";

/**
 * Single source of truth for course categories.
 *
 * `dbValue` matches what is stored in `courses.category` in the database
 * (English, stable). `labelKey` resolves to a localized label.
 *
 * Filter slugs include synthetic options ("all", "featured") that don't
 * correspond to a stored category.
 */
export type CourseCategory = {
  slug: string;
  dbValue: string;
  labelKey: string;
};

export const COURSE_CATEGORIES: CourseCategory[] = [
  { slug: "development", dbValue: "Development", labelKey: "courseCategories.development" },
  { slug: "ai-ml", dbValue: "AI & ML", labelKey: "courseCategories.aiMl" },
  { slug: "design", dbValue: "Design", labelKey: "courseCategories.design" },
  { slug: "data-science", dbValue: "Data Science", labelKey: "courseCategories.dataScience" },
  { slug: "mobile", dbValue: "Mobile", labelKey: "courseCategories.mobile" },
  { slug: "business", dbValue: "Business", labelKey: "courseCategories.business" },
];

export type FilterSlug = "all" | "featured" | CourseCategory["slug"];

export const COURSE_FILTER_SLUGS: { slug: FilterSlug; labelKey: string }[] = [
  { slug: "all", labelKey: "courseCategories.all" },
  { slug: "featured", labelKey: "courseCategories.featured" },
  ...COURSE_CATEGORIES.map((c) => ({ slug: c.slug as FilterSlug, labelKey: c.labelKey })),
];

export const getCategoryLabel = (t: TFunction, slug: string): string => {
  const cat = COURSE_CATEGORIES.find((c) => c.slug === slug);
  return cat ? t(cat.labelKey) : slug;
};

export const slugToDbValue = (slug: string): string | undefined =>
  COURSE_CATEGORIES.find((c) => c.slug === slug)?.dbValue;

export const dbValueToSlug = (dbValue: string | null | undefined): string | undefined =>
  COURSE_CATEGORIES.find((c) => c.dbValue === dbValue)?.slug;
