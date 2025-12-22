import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import CourseCard from "@/components/CourseCard";
import heroImage from "@/assets/hero-bg.jpg";
import { ArrowRight, Users, BookOpen, Award, Star } from "lucide-react";

const featuredCourses = [
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
];

const stats = [
  { icon: Users, value: "50K+", label: "Active Learners" },
  { icon: BookOpen, value: "200+", label: "Courses" },
  { icon: Award, value: "95%", label: "Completion Rate" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Abstract learning background"
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        {/* Content */}
        <div className="container relative z-10 mx-auto px-4 py-20 text-center">
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/30">
            🚀 New courses added weekly
          </Badge>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Master New Skills
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Transform Your Career
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Join thousands of learners advancing their careers with expert-led courses. 
            From coding to design, learn at your own pace.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/courses">
              <Button size="lg" className="min-w-[180px]">
                Explore Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <stat.icon className="h-8 w-8 text-primary mb-2" />
                <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Featured Courses</h2>
              <p className="text-muted-foreground">Start learning with our most popular courses</p>
            </div>
            <Link to="/courses">
              <Button variant="ghost" className="mt-4 sm:mt-0">
                View All Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 p-8 md:p-12 text-center border border-border">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Start Teaching?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Share your knowledge with thousands of learners. Create and publish courses with our easy-to-use tools.
            </p>
            <Link to="/teacher">
              <Button size="lg">
                Become an Instructor
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 LearnHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
