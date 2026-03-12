import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import MissionSection from "@/components/MissionSection";
import SubjectsSection from "@/components/SubjectsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CommunitySection from "@/components/CommunitySection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <HowItWorks />
    <MissionSection />
    <SubjectsSection />
    <TestimonialsSection />
    <CommunitySection />
    <Footer />
  </div>
);

export default Index;
