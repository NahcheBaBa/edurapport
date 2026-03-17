import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  BookOpen, Dna, Atom, FlaskConical, Palette,
  Ruler, ScrollText, Landmark, Heart, Globe,
} from "lucide-react";

const subjects = [
  { icon: BookOpen, label: "English" },
  { icon: Dna, label: "Biology" },
  { icon: Atom, label: "Physics" },
  { icon: FlaskConical, label: "Science" },
  { icon: Palette, label: "Creative Art" },
  { icon: Ruler, label: "Mathematics" },
  { icon: ScrollText, label: "Literature" },
  { icon: Landmark, label: "Government" },
  { icon: Heart, label: "Social & Emotional\nLearning" },
  { icon: Globe, label: "Civic Education" },
];

const SubjectSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-16 px-4">
        <Link to="/" className="self-start mb-6 ml-4 md:ml-12 flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors">
          <ArrowLeft size={18} />
          Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-primary text-center mb-12 uppercase tracking-wide">
          Select a Subject Let's Have a Rapport
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 max-w-5xl w-full">
          {subjects.map((s) => (
            <button
              key={s.label}
              onClick={() => navigate(`/subjects/${encodeURIComponent(s.label.replace("\n", " "))}`)}
              className="group flex flex-col items-center gap-3 cursor-pointer"
            >
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-[hsl(190,80%,50%)] to-[hsl(195,100%,45%)] flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:shadow-xl transition-all duration-200">
                <s.icon size={48} className="text-primary-foreground" strokeWidth={1.5} />
              </div>
              <span className="text-sm md:text-base font-heading font-semibold text-foreground text-center whitespace-pre-line">
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SubjectSelection;
