import SiteNav from "@/components/SiteNav";
import Hero from "@/components/Hero";
import StatTicker from "@/components/StatTicker";
import SolutionSection from "@/components/SolutionSection";
import ArchitectureSection from "@/components/ArchitectureSection";
import BusinessModelSection from "@/components/BusinessModelSection";
import RoadmapSection from "@/components/RoadmapSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <SiteNav />
      <Hero />
      <StatTicker />
      <SolutionSection />
      <ArchitectureSection />
      <BusinessModelSection />
      <RoadmapSection />
      <Footer />
    </main>
  );
}
