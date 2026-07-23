import HashScroll from "@/components/layout/HashScroll";
import Hero from "@/components/home/Hero";
import StatsSection from "@/components/home/StatsSection";
import PopularCourses from "@/components/home/PopularCourses";
import ResultsSection from "@/components/home/ResultsSection";
import AboutSection from "@/components/home/AboutSection";
import FeatureStrip from "@/components/home/FeatureStrip";
import SocialProofSection from "@/components/home/SocialProofSection";

export default function Home() {
  return (
    <>
      <HashScroll />
      <Hero />
      <StatsSection />
      <PopularCourses />
      <ResultsSection />
      <AboutSection />
      <FeatureStrip />
      <SocialProofSection />
    </>
  );
}
