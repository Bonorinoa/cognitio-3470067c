import { useState } from "react";
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

const categories = ["Todos", "Destacados", "Desarrollo", "IA & ML", "Diseño", "Ciencia de Datos", "Móvil", "Negocios"];

// Map Spanish UI labels to English database values
const categoryMapping: Record<string, string> = {
  "Desarrollo": "Development",
  "IA & ML": "AI & ML",
  "Diseño": "Design",
  "Ciencia de Datos": "Data Science",
  "Móvil": "Mobile",
  "Negocios": "Business"
};

const CoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
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
        };
      });
    },
  });

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const dbCategory = categoryMapping[selectedCategory];
    const matchesCategory =
      selectedCategory === "Todos" || 
      (selectedCategory === "Destacados" ? course.isFeatured : course.category === dbCategory);
    return matchesSearch && matchesCategory;
  });

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
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
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Explorar Cursos</h1>
          <p className="text-muted-foreground">
            Descubre nuestra biblioteca de cursos y comienza a aprender hoy
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
                <SelectItem value="newest">Más Reciente</SelectItem>
                <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
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
