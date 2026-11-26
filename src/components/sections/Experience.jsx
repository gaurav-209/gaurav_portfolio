import { timeline } from "@/data/experience";
import SectionHeading from "@/components/ui/SectionHeading";
import JourneyTimeline from "@/components/sections/experience/JourneyTimeline";

export default function Experience() {
  return (
    <section className="section-pad" id="experience" aria-labelledby="experience-heading">
      <div className="container-wide">
        <SectionHeading
          id="experience-heading"
          lead="Career & Learning"
          accent="Milestones"
          subtitle="The roles, training and education that shaped how I build software. Scroll to follow the path."
        />
        <JourneyTimeline items={timeline} />
      </div>
    </section>
  );
}
