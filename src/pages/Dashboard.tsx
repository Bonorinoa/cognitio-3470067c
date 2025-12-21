import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CourseCard from "@/components/CourseCard";
import ProgressCard from "@/components/ProgressCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, Trophy, Clock } from "lucide-react";

const enrolledCourses = [
  {
    id: "1",
    title: "Complete Web Development Bootcamp 2024",
    description: "Learn HTML, CSS, JavaScript, React, Node.js, and more.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600",
    price: 89.99,
    chaptersCount: 42,
    progress: 65,
    category: "Development",
  },
  {
    id: "2",
    title: "Machine Learning & AI Fundamentals",
    description: "Master Python, TensorFlow, and deep learning concepts.",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600",
    price: 129.99,
    chaptersCount: 38,
    progress: 23,
    category: "AI & ML",
  },
  {
    id: "3",
    title: "UI/UX Design Masterclass",
    description: "Create stunning user interfaces with Figma.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600",
    price: 79.99,
    chaptersCount: 28,
    progress: 100,
    category: "Design",
  },
];

const completedCourses = enrolledCourses.filter((c) => c.progress === 100);
const inProgressCourses = enrolledCourses.filter((c) => c.progress < 100);

const StudentDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = enrolledCourses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, Student!</h1>
          <p className="text-muted-foreground">Continue your learning journey</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <ProgressCard
            title="Courses Enrolled"
            value={enrolledCourses.length}
            icon="courses"
            subtitle="Active courses"
          />
          <ProgressCard
            title="Courses Completed"
            value={completedCourses.length}
            icon="award"
            subtitle="Great progress!"
          />
          <ProgressCard
            title="Hours Learned"
            value="47h"
            icon="time"
            subtitle="This month"
          />
          <ProgressCard
            title="Overall Progress"
            value="62%"
            icon="trending"
            progress={62}
            subtitle="Keep going!"
          />
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              All Courses ({enrolledCourses.length})
            </TabsTrigger>
            <TabsTrigger value="in-progress" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              In Progress ({inProgressCourses.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Completed ({completedCourses.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="in-progress">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressCourses
                .filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((course) => (
                  <CourseCard key={course.id} {...course} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedCourses
                .filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((course) => (
                  <CourseCard key={course.id} {...course} />
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Empty state */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-4">Try a different search term or browse all courses.</p>
            <Link to="/courses" className="text-primary hover:underline">
              Browse Courses
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
