import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { QuickActions } from "@/components/QuickActions";
import { FeaturedDishes } from "@/components/FeaturedDishes";
import { PremiumEngagementSection } from "@/components/PremiumEngagementSection";

// Rendu dynamique : la page lit la base (plats, avis) → pas de prérendu au build.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <QuickActions />
        <FeaturedDishes />
        <PremiumEngagementSection />
      </main>
    </>
  );
}
