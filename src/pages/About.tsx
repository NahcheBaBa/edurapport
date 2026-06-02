import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import aboutHero from "@/assets/about-hero.png.asset.json";

const About = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Navbar />
    <main className="flex-1">
      <section className="container py-12 md:py-16">
        <img
          src={aboutHero.url}
          alt="Learning Comes with a Good Rapport — About EduRapport"
          className="w-full h-auto rounded-2xl mb-10"
        />
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
            About EduRapport
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            We make learning simple, engaging, and accessible for every student.
            Through interactive lessons, smart quizzes, and creative tools, we help learners
            build confidence and master subjects at their own pace.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="bg-card rounded-xl px-6 py-4 shadow-sm border border-border">
              <span className="block text-2xl font-bold text-primary">10+</span>
              <span className="text-sm text-muted-foreground">Subjects</span>
            </div>
            <div className="bg-card rounded-xl px-6 py-4 shadow-sm border border-border">
              <span className="block text-2xl font-bold text-primary">500+</span>
              <span className="text-sm text-muted-foreground">Lessons</span>
            </div>
            <div className="bg-card rounded-xl px-6 py-4 shadow-sm border border-border">
              <span className="block text-2xl font-bold text-primary">1k+</span>
              <span className="text-sm text-muted-foreground">Students</span>
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default About;
