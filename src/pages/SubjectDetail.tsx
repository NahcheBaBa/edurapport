import { useParams, Link } from "react-router-dom";
import { ArrowLeft, PlayCircle, FileText, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import subjectIllustration from "@/assets/subject-illustration.png";
import { Button } from "@/components/ui/button";

const SubjectDetail = () => {
  const { name } = useParams<{ name: string }>();
  const subjectName = decodeURIComponent(name || "");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-16 px-4">
        <div className="container max-w-5xl">
          <Link
            to="/subjects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft size={18} />
            Back to Subjects
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Illustration */}
            <div className="flex-shrink-0 w-64 md:w-[360px]">
              <img
                src={subjectIllustration}
                alt={`${subjectName} illustration`}
                className="w-full"
              />
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-foreground mb-4">
                {subjectName}
              </h1>
              <p className="text-muted-foreground font-body text-base md:text-lg mb-8 max-w-lg">
                Explore interactive lessons, practice questions, and resources to master {subjectName}. Let's build rapport through learning!
              </p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Button className="gradient-primary text-primary-foreground font-bold rounded-full px-8 gap-2">
                  <PlayCircle size={18} />
                  Start Learning
                </Button>
                <Button variant="outline" className="rounded-full px-8 font-bold gap-2">
                  <FileText size={18} />
                  Practice Test
                </Button>
              </div>

              {/* Quick stats */}
              <div className="mt-10 grid grid-cols-3 gap-4 max-w-md mx-auto md:mx-0">
                {[
                  { value: "20+", label: "Lessons" },
                  { value: "50+", label: "Questions" },
                  { value: "Free", label: "Access" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-muted rounded-xl p-4 text-center">
                    <div className="text-xl font-heading font-extrabold text-primary">{stat.value}</div>
                    <div className="text-xs text-muted-foreground font-semibold">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SubjectDetail;
