import { Music, BookOpen, Palette, Pen } from "lucide-react";

const methods = [
  {
    icon: Music,
    title: "MUSIC PEDAGOGY",
    color: "bg-accent",
    desc: "Kill two birds with a stone, learn with rhythm and music! A powerful learning approach to make education fun, engaging and effective.",
  },
  {
    icon: BookOpen,
    title: "POETRY",
    color: "bg-secondary",
    desc: "Poetry isn't just about expressing feelings. With our platform, we use rhyme and rhythm to make learning educational content via storytelling easier.",
  },
  {
    icon: Palette,
    title: "DESIGNS",
    color: "bg-primary",
    desc: "Memes and illustrations are the language of the internet and education as well. We leverage these to make concepts easier to grasp.",
  },
  {
    icon: Pen,
    title: "ART",
    color: "bg-ring",
    desc: "Art is a canvas for learning, engaging learners and fostering creative thinking through creative expression and hands-on learning.",
  },
];

const HowItWorks = () => (
  <section className="py-16 md:py-24 bg-background">
    <div className="container">
      <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-center mb-14">
        <span className="text-foreground">How </span>
        <span className="text-gradient">the learning happens</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {methods.map((m) => (
          <div key={m.title} className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-2xl ${m.color} flex items-center justify-center mb-4`}>
              <m.icon className="text-primary-foreground" size={28} />
            </div>
            <h3 className="font-heading font-bold text-sm mb-2 text-foreground">{m.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
