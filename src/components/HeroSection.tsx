import { useState, useEffect } from "react";
import heroCharacter from "@/assets/hero-character.png";
import heroHeading from "@/assets/hero-heading.png";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative overflow-hidden bg-background py-12 md:py-20">
      <div className="container flex flex-col md:flex-row items-center gap-8">
        {/* Character */}
        <div
          className={`relative flex-shrink-0 w-64 md:w-[380px] transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Decorative circle */}
          <div className="absolute inset-0 rounded-full border-2 border-accent/30 scale-110 animate-[spin_20s_linear_infinite]" />
          <div className="absolute -top-4 -right-4 w-6 h-6 rounded-full bg-primary opacity-60 animate-float" />
          <div className="absolute top-8 -left-6 w-4 h-4 rounded-full bg-accent opacity-50 animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-12 -right-8 w-5 h-5 rounded-full bg-secondary opacity-40 animate-float" style={{ animationDelay: "0.5s" }} />
          <img
            src={heroCharacter}
            alt="Edna - EduRapport mascot"
            className="relative z-10 w-full animate-float drop-shadow-2xl"
            style={{ animationDuration: "4s" }}
          />
          {/* Speech bubble */}
          <div
            className={`absolute bottom-4 left-0 bg-background rounded-xl shadow-lg p-3 text-xs font-semibold text-foreground z-20 max-w-[160px] transition-all duration-700 delay-500 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
          >
            Hello Darling! Welcome to EduRapport. I'm Edna, your rapport buddy. Get started, let's have a rapport!
          </div>
        </div>

        {/* Text */}
        <div
          className={`flex-1 text-center md:text-left transition-all duration-1000 delay-300 ease-out ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          }`}
        >
          <img src={heroHeading} alt="Your One-stop for Learning the Easy Way" className="max-w-xs md:max-w-md lg:max-w-lg w-full" />
          <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
            <a
              href="#signup"
              className="gradient-primary text-primary-foreground font-bold px-8 py-3 rounded-full text-sm hover:opacity-90 transition-opacity hover-scale"
            >
              Sign up
            </a>
            <a
              href="#demo"
              className="border-2 border-foreground text-foreground font-bold px-8 py-3 rounded-full text-sm hover:bg-muted transition-colors hover-scale"
            >
              Take Demo test
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
