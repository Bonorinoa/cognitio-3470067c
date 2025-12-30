import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import CourseCard from "@/components/CourseCard";
import InstructorContactForm from "@/components/InstructorContactForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe, Linkedin, Twitter, Building2, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface InstructorProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  headline: string | null;
  bio: string | null;
  affiliation: string | null;
  website_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  credentials: string[] | null;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  price: number;
  category: string | null;
  chapters: { id: string }[];
}

const InstructorProfile = () => {
  const { id } = useParams();

  // Fetch instructor profile
  const { data: instructor, isLoading: profileLoading } = useQuery({
    queryKey: ["instructor-profile", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, avatar_url, headline, bio, affiliation, website_url, linkedin_url, twitter_url, credentials")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Instructor not found");

      return data as InstructorProfile;
    },
    enabled: !!id,
  });

  // Fetch instructor's published courses
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["instructor-courses", id],
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
          chapters (id)
        `)
        .eq("instructor_id", id)
        .eq("is_published", true)
        .eq("visibility", "public");

      if (error) throw error;
      return (data || []) as Course[];
    },
    enabled: !!id,
  });

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "I";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col items-center gap-6">
                <Skeleton className="h-32 w-32 rounded-full" />
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-6 w-96" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Instructor not found</h1>
            <p className="text-muted-foreground mt-2">This profile doesn't exist or has been removed.</p>
            <Link to="/courses">
              <Button className="mt-4">Browse Courses</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const hasSocialLinks = instructor.website_url || instructor.linkedin_url || instructor.twitter_url;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4"
        >
          <Card className="max-w-4xl mx-auto overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                {/* Avatar */}
                <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-primary/20 shadow-lg">
                  <AvatarImage src={instructor.avatar_url || undefined} alt={instructor.full_name || "Instructor"} />
                  <AvatarFallback className="text-3xl bg-muted">
                    {getInitials(instructor.full_name)}
                  </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {instructor.full_name || "Instructor"}
                  </h1>
                  
                  {instructor.headline && (
                    <p className="text-lg text-muted-foreground mb-3">
                      {instructor.headline}
                    </p>
                  )}

                  {instructor.affiliation && (
                    <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-4">
                      <Building2 className="h-4 w-4" />
                      <span>{instructor.affiliation}</span>
                    </div>
                  )}

                  {/* Social Links */}
                  {hasSocialLinks && (
                    <div className="flex items-center justify-center md:justify-start gap-3">
                      {instructor.website_url && (
                        <a
                          href={instructor.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                          aria-label="Website"
                        >
                          <Globe className="h-5 w-5 text-foreground" />
                        </a>
                      )}
                      {instructor.linkedin_url && (
                        <a
                          href={instructor.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="h-5 w-5 text-foreground" />
                        </a>
                      )}
                      {instructor.twitter_url && (
                        <a
                          href={instructor.twitter_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                          aria-label="Twitter"
                        >
                          <Twitter className="h-5 w-5 text-foreground" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Bio Section */}
        {instructor.bio && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="container mx-auto px-4 mt-8"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                About
              </h2>
              <div className="prose prose-muted max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {instructor.bio}
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {/* Credentials Section */}
        {instructor.credentials && instructor.credentials.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="container mx-auto px-4 mt-8"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-semibold text-foreground mb-4">Credentials</h2>
              <div className="flex flex-wrap gap-2">
                {instructor.credentials.map((credential, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="py-1.5 px-4 text-sm bg-primary/10 text-primary border-primary/20"
                  >
                    {credential}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Courses Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="container mx-auto px-4 mt-12"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Courses by {instructor.full_name?.split(" ")[0] || "this Instructor"}
            </h2>

            {coursesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-80 rounded-lg" />
                ))}
              </div>
            ) : courses && courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <CourseCard
                      id={course.id}
                      title={course.title}
                      description={course.description || ""}
                      image={course.image_url || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800"}
                      price={course.price}
                      category={course.category || "General"}
                      chaptersCount={course.chapters?.length || 0}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center border-border/50">
                <p className="text-muted-foreground">
                  No courses published yet. Check back soon!
                </p>
              </Card>
            )}
          </div>
        </motion.section>

        {/* Contact Section */}
        <section className="container mx-auto px-4 mt-12">
          <div className="max-w-4xl mx-auto">
            <InstructorContactForm
              instructorId={instructor.id}
              instructorName={instructor.full_name}
              instructorEmail={instructor.email}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default InstructorProfile;
