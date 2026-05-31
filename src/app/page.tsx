import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FeaturedDishes } from "@/components/FeaturedDishes";
import { QRCodeSection } from "@/components/QRCodeSection";
import { AboutSection } from "@/components/AboutSection";
import { PromoSection } from "@/components/PromoSection";
import { Testimonials } from "@/components/Testimonials";
import { ReviewsSection } from "@/components/ReviewsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

// Rendu dynamique : la page lit la base (plats, avis) → pas de prérendu au build.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturedDishes />

        {/* Bande : Commande QR · À propos · Offre spéciale */}
        <section className="section bg-cream text-ink">
          <div className="container-page">
            <div className="mb-10 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">
                  Expérience N&apos;KULU
                </p>
                <h2 className="mt-3 max-w-xl font-display text-3xl font-bold leading-tight sm:text-4xl">
                  Commander simplement, manger vraiment.
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-ink/65 sm:text-base lg:justify-self-end">
                Le site doit servir le restaurant avant tout : accès rapide au
                menu, commande directe, informations claires et une identité
                visuelle plus chaleureuse.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <QRCodeSection />
              </div>
              <div className="lg:col-span-4">
                <AboutSection />
              </div>
              <div className="lg:col-span-4">
                <PromoSection />
              </div>
            </div>
          </div>
        </section>

        <Testimonials />
        <ReviewsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
