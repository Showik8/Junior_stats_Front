import HeroSection from "@/app/components/public/landing/HeroSection";
import TopPerformers from "@/app/components/public/landing/TopPerformers";
import PlatformStats from "@/app/components/public/landing/PlatformStats";
import WeeklyMatchesTeaser from "@/app/components/public/landing/WeeklyMatchesTeaser";
import SponsorsMarquee from "@/app/components/public/landing/SponsorsMarquee";

export const metadata = {
  title: "Junior Stats - ქართული ფეხბურთის ახალი თაობა",
  description: "ქართული საბავშვო და ჭაბუკთა ფეხბურთის სრული სტატისტიკური ბაზა.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#060c1a] text-white">

      {/* 1. Hero — split layout */}
      <HeroSection />
      <SponsorsMarquee />

      {/* 2. Top Performers — player cards with rank badges */}
      <TopPerformers />

      {/* 3. Platform Indicators — 4 stats cards */}
      <PlatformStats />

      {/* 4. Matches of the week — horizontal scroll */}
      <WeeklyMatchesTeaser />

      {/* 5. Sponsors Scrolling Marquee */}

    </main>
  );
}
