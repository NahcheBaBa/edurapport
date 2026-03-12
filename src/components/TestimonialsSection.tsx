import { Star } from "lucide-react";
import avatar from "@/assets/testimonial-avatar.jpg";

const TestimonialsSection = () => (
  <section className="py-16 md:py-24 bg-testimonial">
    <div className="container text-center">
      <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-12">
        <span className="text-gradient">What people are saying</span>
        <br />
        <span className="text-foreground">about us</span>
      </h2>

      <div className="max-w-lg mx-auto bg-background rounded-2xl shadow-lg p-8 relative">
        {/* Quote mark */}
        <div className="text-6xl font-heading text-primary leading-none mb-2">"</div>

        <div className="flex items-center gap-3 mb-4 justify-center">
          <img src={avatar} alt="Chat John" className="w-12 h-12 rounded-full object-cover" />
          <div className="text-left">
            <p className="font-heading font-bold text-sm text-foreground">Chat John</p>
            <p className="text-xs text-primary font-semibold">Student</p>
            <div className="flex gap-0.5 mt-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className="fill-primary text-primary" />
              ))}
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed italic">
          "I never thought I'd enjoy learning again! This app reignited my love for art, music, and poetry, all while
          teaching me new things. Perfect for anyone who wants to learn in a fun and inspiring way."
        </p>
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
