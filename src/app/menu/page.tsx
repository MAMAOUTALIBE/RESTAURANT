import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MenuBrowser } from "@/components/MenuBrowser";
import { Reveal } from "@/components/ui/Reveal";
import { getMenuForBrowser } from "@/lib/dishes";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Le Menu",
  description:
    "Découvrez toute la carte AFRO MK LO BOKO : entrées, plats africains, desserts et boissons.",
};

export default async function MenuPage() {
  const { categories, dishes } = await getMenuForBrowser();

  return (
    <>
      <Header />
      <main className="bg-cream pb-20 pt-28 text-ink">
        <div className="container-page">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">
              Notre carte
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
              Le Menu
            </h1>
          </Reveal>

          <div className="mt-8">
            <MenuBrowser categories={categories} dishes={dishes} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
