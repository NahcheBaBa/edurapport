import missionPhoto from "@/assets/mission-photo.jpg";

const MissionSection = () => (
  <section className="bg-mission text-mission-foreground py-16 md:py-20" id="about">
    <div className="container flex flex-col md:flex-row items-center gap-10">
      <div className="flex-1">
        <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-6">Our Mission</h2>
        <p className="text-sm md:text-base leading-relaxed opacity-90">
          Pioneers in creating a dynamic learning environment where creativity flourishes and students are empowered to develop their
          core skills through interactive, engaging and innovative methods.
        </p>
      </div>
      <div className="flex-shrink-0 w-full md:w-[400px]">
        <img
          src={missionPhoto}
          alt="Students learning together"
          className="rounded-2xl w-full h-64 md:h-80 object-cover shadow-xl"
        />
      </div>
    </div>
  </section>
);

export default MissionSection;
