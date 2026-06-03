import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import aboutCharacters from "@/assets/about-characters.png.asset.json";

const stats = [
  { value: "10+", label: "Subjects" },
  { value: "500+", label: "Lessons" },
  { value: "1k+", label: "Students" },
];

const About = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Navbar />
    <main className="flex-1">
      <section className="container py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Text column */}
          <div className="space-y-6 order-2 md:order-1">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              About EduRapport
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground leading-tight">
              Learning that meets{" "}
              <span className="text-primary">creativity</span>.
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              We make learning simple, engaging, and accessible for every student.
              Through interactive lessons, smart quizzes, and creative tools, we help
              learners build confidence and master subjects at their own pace.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="bg-card rounded-xl px-4 py-5 text-center shadow-sm border border-border"
                >
                  <span className="block text-2xl md:text-3xl font-bold text-primary">
                    {s.value}
                  </span>
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image column */}
          <div className="order-1 md:order-2 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
            <div className="relative bg-card rounded-3xl p-6 md:p-8 border border-border shadow-lg">
              <img
                src={aboutCharacters.url}
                alt="EduRapport learners — a student using a tablet and another with a microphone"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default About;
