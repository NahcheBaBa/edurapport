import heroCharacter from "@/assets/hero-character.png";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-background py-12 md:py-20">
      <div className="container flex flex-col md:flex-row items-center gap-8">
        {/* Character */}
        <div className="relative flex-shrink-0 w-64 md:w-[380px]">
          {/* Decorative circle */}
          <div className="absolute inset-0 rounded-full border-2 border-accent/30 scale-110" />
          <div className="absolute -top-4 -right-4 w-6 h-6 rounded-full bg-primary opacity-60 animate-float" />
          <div className="absolute top-8 -left-6 w-4 h-4 rounded-full bg-accent opacity-50 animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-12 -right-8 w-5 h-5 rounded-full bg-secondary opacity-40 animate-float" style={{ animationDelay: "0.5s" }} />
          <img src={heroCharacter} alt="EduRapport mascot" className="relative z-10 w-full" />
          {/* Speech bubble */}
          <div className="absolute bottom-4 left-0 bg-background rounded-xl shadow-lg p-3 text-xs font-semibold text-foreground z-20 max-w-[160px]">
            Hello Darling! Welcome to EduRapport. I'm Edu, your rapport buddy. Get linked to rapport!
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold leading-tight">
            Your One-stop{" "}
            <span className="text-gradient">for Learning the Easy Way</span>
          </h1>
          <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
            <a
              href="#signup"
              className="gradient-primary text-primary-foreground font-bold px-8 py-3 rounded-full text-sm hover:opacity-90 transition-opacity"
            >
              Sign up
            </a>
            <a
              href="#demo"
              className="border-2 border-foreground text-foreground font-bold px-8 py-3 rounded-full text-sm hover:bg-muted transition-colors"
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
