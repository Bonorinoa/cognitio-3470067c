import { useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { CourseCardSkeleton } from "@/components/CourseCardSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { COURSE_FILTER_SLUGS, slugToDbValue } from "@/lib/courseCategories";
import { SEO } from "@/components/SEO";

const CoursesPage = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string>("all");
  const [sortBy, setSortBy] = useState("popular");


  // Fetch published courses from database
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select(`
          id,
          title,
          description,
          image_url,
          price,
          category,
          visibility,
          is_featured,
          average_rating,
          rating_count,
          chapters (id, duration_seconds)
        `)
        .eq("is_published", true)
        .eq("visibility", "public"); // Only show public courses in catalog

      if (error) throw error;

      return data.map((course) => {
        const totalDuration = course.chapters?.reduce((sum, ch) => sum + (ch.duration_seconds || 0), 0) || 0;
        return {
          id: course.id,
          title: course.title,
          description: course.description || "",
          image: course.image_url || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600",
          price: Number(course.price),
          chaptersCount: course.chapters?.length || 0,
          category: course.category || "Development",
          totalDurationSeconds: totalDuration,
          isFeatured: course.is_featured || false,
          averageRating: course.average_rating,
          ratingCount: course.rating_count,
        };
      });
    },
  });

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const dbCategory = slugToDbValue(selectedSlug);
    const matchesCategory =
      selectedSlug === "all" ||
      (selectedSlug === "featured" ? course.isFeatured : course.category === dbCategory);
    return matchesSearch && matchesCategory;
  });

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        // Sort by rating (highest first), then by rating count for tiebreaker
        const ratingA = a.averageRating ?? 0;
        const ratingB = b.averageRating ?? 0;
        if (ratingB !== ratingA) return ratingB - ratingA;
        return (b.ratingCount ?? 0) - (a.ratingCount ?? 0);
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Explorar cursos"
        description="Cursos curados por instructores invitados: ciencia, economía, humanidades y más. Aprendé con expertos en español."
        path="/courses"
      />
      <Navbar />


      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Explorar Cursos</h1>
          <p className="text-muted-foreground">
            Descubrí nuestra biblioteca de cursos y comenzá a aprender hoy
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cursos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          <div className="flex gap-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-card border-border">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Más Popular</SelectItem>
                <SelectItem value="rating">Mejor Valorados</SelectItem>
                <SelectItem value="newest">Más Reciente</SelectItem>
                <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {COURSE_FILTER_SLUGS.map((filter) => (
            <Badge
              key={filter.slug}
              variant={selectedSlug === filter.slug ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                selectedSlug === filter.slug
                  ? "bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
              }`}
              onClick={() => setSelectedSlug(filter.slug)}
            >
              {t(filter.labelKey)}
            </Badge>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-6">
          {isLoading ? "Cargando..." : `Mostrando ${sortedCourses.length} de ${courses.length} cursos`}
        </p>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Courses Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && sortedCourses.length === 0 && courses.length === 0 && (
          <EmptyState
            icon={BookOpen}
            title="No hay cursos disponibles"
            description="Aún no hay cursos publicados. ¡Vuelve pronto para descubrir nuevas oportunidades de aprendizaje!"
          />
        )}
        
        {/* No results state */}
        {!isLoading && sortedCourses.length === 0 && courses.length > 0 && (
          <EmptyState
            icon={Filter}
            title="No se encontraron cursos"
            description="Intenta ajustar tu búsqueda o los filtros para encontrar el curso que buscas."
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CoursesPage;
