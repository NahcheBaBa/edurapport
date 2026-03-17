import { BookOpen, Atom, Brain, FlaskConical, Leaf, Calculator } from "lucide-react";

const subjects = [
  { icon: BookOpen, label: "General Knowledge" },
  { icon: Atom, label: "Physics" },
  { icon: Brain, label: "Phonetics" },
  { icon: FlaskConical, label: "Science" },
  { icon: Leaf, label: "Biology" },
  { icon: Calculator, label: "Mathematics" },
];

const SubjectsSection = () => (
  <section className="py-16 md:py-24 bg-background" id="resources">
    <div className="container text-center">
      <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-10">
        Some of our <span className="text-gradient">Offered Subjects</span>
      </h2>
      <div className="flex flex-wrap justify-center gap-4">
        {subjects.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-2 border border-border rounded-full px-5 py-2.5 hover:shadow-md hover:border-primary transition-all cursor-pointer"
          >
            <s.icon size={18} className="text-primary" />
            <span className="text-sm font-semibold text-foreground">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SubjectsSection;
