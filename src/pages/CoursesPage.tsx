import { useState } from "react";
import Navbar from "@/components/Navbar";
import CourseCard from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

const allCourses = [
  {
    id: "1",
    title: "Complete Web Development Bootcamp 2024",
    description: "Learn HTML, CSS, JavaScript, React, Node.js, and more. Build real-world projects.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600",
    price: 89.99,
    chaptersCount: 42,
    category: "Development",
  },
  {
    id: "2",
    title: "Machine Learning & AI Fundamentals",
    description: "Master Python, TensorFlow, and deep learning. From basics to advanced concepts.",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600",
    price: 129.99,
    chaptersCount: 38,
    category: "AI & ML",
  },
  {
    id: "3",
    title: "UI/UX Design Masterclass",
    description: "Create stunning user interfaces and experiences with Figma and design thinking.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600",
    price: 79.99,
    chaptersCount: 28,
    category: "Design",
  },
  {
    id: "4",
    title: "Advanced React & TypeScript",
    description: "Take your React skills to the next level with TypeScript, testing, and patterns.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600",
    price: 99.99,
    chaptersCount: 35,
    category: "Development",
  },
  {
    id: "5",
    title: "Data Science with Python",
    description: "Learn data analysis, visualization, and machine learning with Python.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600",
    price: 109.99,
    chaptersCount: 45,
    category: "Data Science",
  },
  {
    id: "6",
    title: "Mobile App Development with Flutter",
    description: "Build beautiful cross-platform apps for iOS and Android with Flutter.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600",
    price: 94.99,
    chaptersCount: 32,
    category: "Mobile",
  },
];

const categories = ["All", "Development", "AI & ML", "Design", "Data Science", "Mobile"];

const CoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Browse Courses</h1>
          <p className="text-muted-foreground">
            Explore our library of courses and start learning today
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          <div className="flex gap-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-card border-border">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
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
          Showing {filteredCourses.length} of {allCourses.length} courses
        </p>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>

        {/* Empty state */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <Filter className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CoursesPage;
