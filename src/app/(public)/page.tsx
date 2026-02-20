import HeroSection from "@/app/components/public/landing/HeroSection";
import WeeklyMatchesTeaser from "@/app/components/public/landing/WeeklyMatchesTeaser";
import TopPerformers from "@/app/components/public/landing/TopPerformers";
import ScoutInfoSection from "@/app/components/public/landing/ScoutInfoSection";
import PlatformStats from "@/app/components/public/landing/PlatformStats";
import SponsorsMarquee from "@/app/components/public/landing/SponsorsMarquee";

export const metadata = {
  title: "Junior Stats - ქართული ფეხბურთის ახალი თაობა",
  description: "ქართული საბავშვო და ჭაბუკთა ფეხბურთის სრული სტატისტიკური ბაზა.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg-deep)] text-white">
      
      {/* 1. Hero / Video Background */}
      <HeroSection />

      {/* 2. Top Performers (Players / Teams by Age) */}
      <TopPerformers />

      {/* 3. Weekly Live/Upcoming Matches */}
      <WeeklyMatchesTeaser />

      {/* 4. Scout / Agent Information Split */}
      <ScoutInfoSection />

      {/* 5. Animated Platform Statistics */}
      <PlatformStats />

      {/* 6. Sponsors Scrolling Marquee */}
      <SponsorsMarquee />

    </main>
  );
}
