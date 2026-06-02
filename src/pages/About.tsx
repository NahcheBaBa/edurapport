import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import aboutHero from "@/assets/about-hero.png.asset.json";

const About = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Navbar />
    <main className="flex-1 container py-12">
      <img
        src={aboutHero.url}
        alt="Learning Comes with a Good Rapport — About EduRapport"
        className="w-full h-auto rounded-2xl"
      />
    </main>
    <Footer />
  </div>
);

export default About;
