import PageBanner from "@/components/ui/PageBanner";
import AboutContent from "@/components/about/AboutContent";
import AboutCourses from "@/components/about/AboutCourses";
import VisionSection from "@/components/home/VisionSection";
import MissionSection from "@/components/home/MissionSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import { aboutContent } from "@/data/content";

export const metadata = {
  title: "About Us",
  description: aboutContent.paragraphs[0],
};

export default function AboutPage() {
  return (
    <>
      <PageBanner
        title="About Us"
        subtitle="Welcome to Prep Up Gwalior — quality learning that builds knowledge, skills, and confidence."
      />
      <AboutContent />
      <VisionSection />
      <MissionSection />
      <WhyChooseUs />
      <AboutCourses />
    </>
  );
}
