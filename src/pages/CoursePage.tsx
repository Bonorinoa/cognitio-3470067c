import { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import ChapterList from "@/components/ChapterList";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Clock, Users, Star, Check, ShoppingCart } from "lucide-react";

const courseData = {
  id: "1",
  title: "Complete Web Development Bootcamp 2024",
  description:
    "Master web development from scratch! Learn HTML, CSS, JavaScript, React, Node.js, and more. Build real-world projects and launch your career as a full-stack developer.",
  image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200",
  price: 89.99,
  instructor: "John Smith",
  rating: 4.8,
  students: 12543,
  chapters: [
    { id: "c1", title: "Introduction to Web Development", duration: "12:34", isPreview: true },
    { id: "c2", title: "HTML Fundamentals", duration: "45:20", isPreview: true },
    { id: "c3", title: "CSS Styling Basics", duration: "38:15", isPreview: false, isCompleted: true },
    { id: "c4", title: "Responsive Design with Flexbox", duration: "42:00", isPreview: false },
    { id: "c5", title: "JavaScript Essentials", duration: "55:30", isPreview: false },
    { id: "c6", title: "DOM Manipulation", duration: "35:45", isPreview: false },
    { id: "c7", title: "React Fundamentals", duration: "1:15:00", isPreview: false },
    { id: "c8", title: "Building Your First React App", duration: "58:20", isPreview: false },
  ],
  features: [
    "42 chapters of comprehensive content",
    "Lifetime access",
    "Certificate of completion",
    "Downloadable resources",
    "Mobile and TV access",
  ],
};

const CoursePage = () => {
  const { id } = useParams();
  const [currentChapterId, setCurrentChapterId] = useState(courseData.chapters[0].id);
  const [hasAccess, setHasAccess] = useState(false);

  const currentChapter = courseData.chapters.find((c) => c.id === currentChapterId);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        {/* Video Section */}
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Player */}
              <div className="lg:col-span-2">
                <VideoPlayer
                  poster={courseData.image}
                  title={currentChapter?.title}
                />
                <div className="mt-4">
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    {courseData.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-accent-foreground fill-accent-foreground" />
                      {courseData.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {courseData.students.toLocaleString()} students
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {courseData.chapters.length} chapters
                    </span>
                    <span>by {courseData.instructor}</span>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-20 border-border bg-card">
                  <CardContent className="p-6">
                    {!hasAccess ? (
                      <>
                        <div className="text-center mb-6">
                          <span className="text-4xl font-bold text-foreground">
                            ${courseData.price}
                          </span>
                        </div>
                        <Button
                          size="lg"
                          className="w-full mb-4"
                          onClick={() => setHasAccess(true)}
                        >
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          Purchase Course
                        </Button>
                        <p className="text-sm text-muted-foreground text-center mb-6">
                          30-day money-back guarantee
                        </p>
                        <Separator className="mb-6" />
                      </>
                    ) : (
                      <Badge className="w-full justify-center py-2 mb-6 bg-accent/20 text-accent-foreground border-accent/30">
                        <Check className="mr-2 h-4 w-4" />
                        You have access to this course
                      </Badge>
                    )}

                    <h3 className="font-semibold text-foreground mb-4">
                      This course includes:
                    </h3>
                    <ul className="space-y-3">
                      {courseData.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <Check className="h-4 w-4 text-accent-foreground" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Description */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  About this course
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {courseData.description}
                </p>
              </div>
            </div>

            {/* Chapters List */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Course Content
              </h2>
              <ChapterList
                chapters={courseData.chapters}
                currentChapterId={currentChapterId}
                onSelectChapter={setCurrentChapterId}
                hasAccess={hasAccess}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoursePage;
