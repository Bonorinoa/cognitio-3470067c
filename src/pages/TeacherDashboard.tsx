import { Link } from "react-router-dom";
import TeacherSidebar from "@/components/TeacherSidebar";
import ProgressCard from "@/components/ProgressCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, MoreHorizontal, Eye, Edit, TrendingUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const teacherCourses = [
  {
    id: "1",
    title: "Complete Web Development Bootcamp 2024",
    status: "published",
    students: 1234,
    revenue: 12500,
    chapters: 42,
    lastUpdated: "2024-01-15",
  },
  {
    id: "2",
    title: "Advanced React Patterns",
    status: "published",
    students: 856,
    revenue: 8900,
    chapters: 28,
    lastUpdated: "2024-01-10",
  },
  {
    id: "3",
    title: "Node.js Microservices",
    status: "draft",
    students: 0,
    revenue: 0,
    chapters: 15,
    lastUpdated: "2024-01-18",
  },
];

const recentEnrollments = [
  { name: "Alice Johnson", course: "Complete Web Development", date: "2 hours ago" },
  { name: "Bob Smith", course: "Advanced React Patterns", date: "5 hours ago" },
  { name: "Carol White", course: "Complete Web Development", date: "1 day ago" },
];

const TeacherDashboard = () => {
  const totalStudents = teacherCourses.reduce((acc, c) => acc + c.students, 0);
  const totalRevenue = teacherCourses.reduce((acc, c) => acc + c.revenue, 0);
  const publishedCourses = teacherCourses.filter((c) => c.status === "published").length;

  return (
    <div className="flex min-h-screen bg-background">
      <TeacherSidebar />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Teacher Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your courses and track performance
            </p>
          </div>
          <Link to="/teacher/create">
            <Button>
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Course
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <ProgressCard
            title="Total Students"
            value={totalStudents.toLocaleString()}
            icon="courses"
            subtitle="+12% from last month"
          />
          <ProgressCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            icon="trending"
            subtitle="+8% from last month"
          />
          <ProgressCard
            title="Published Courses"
            value={publishedCourses}
            icon="award"
          />
          <ProgressCard
            title="Average Rating"
            value="4.8"
            icon="trending"
            subtitle="Based on 2,340 reviews"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Courses Table */}
          <Card className="lg:col-span-2 border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground">Your Courses</CardTitle>
              <Link to="/teacher/courses">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">Course</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Students</TableHead>
                    <TableHead className="text-muted-foreground">Revenue</TableHead>
                    <TableHead className="text-muted-foreground w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teacherCourses.map((course) => (
                    <TableRow key={course.id} className="border-border">
                      <TableCell className="font-medium text-foreground">
                        {course.title}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={course.status === "published" ? "default" : "outline"}
                          className={
                            course.status === "published"
                              ? "bg-accent/20 text-accent-foreground border-accent/30"
                              : "border-border text-muted-foreground"
                          }
                        >
                          {course.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {course.students.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        ${course.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Recent Enrollments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEnrollments.map((enrollment, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {enrollment.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {enrollment.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {enrollment.course}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {enrollment.date}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
