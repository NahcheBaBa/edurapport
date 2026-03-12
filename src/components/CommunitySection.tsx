import communityPhoto from "@/assets/community-photo.jpg";

const CommunitySection = () => (
  <section className="relative py-24 md:py-32" id="contact">
    <div className="absolute inset-0">
      <img src={communityPhoto} alt="Community" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-foreground/60" />
    </div>
    <div className="relative z-10 container text-center">
      <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-primary-foreground mb-4">
        Want to share your Knowledge?
        <br />
        Join our community
      </h2>
      <p className="text-sm text-primary-foreground/80 max-w-xl mx-auto mb-8">
        When you join our community and get a chance to be featured on our site. EduRapport Community powers the quality
        of contents and rapport we have with learners, educators and parents alike.
      </p>
      <a
        href="#join"
        className="inline-block gradient-primary text-primary-foreground font-bold px-10 py-3.5 rounded-full text-sm hover:opacity-90 transition-opacity"
      >
        Join the mission
      </a>
    </div>
  </section>
);

export default CommunitySection;
