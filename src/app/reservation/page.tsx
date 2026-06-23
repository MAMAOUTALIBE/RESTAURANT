import type { Metadata } from "next";
import { CalendarCheck } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ReservationForm } from "@/components/ReservationForm";

export const metadata: Metadata = {
  title: "Réserver une table",
  description: "Réservez votre table chez restaurant en quelques clics.",
};

function str(value: string | string[] | undefined): string | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  return v ? v.slice(0, 120) : undefined;
}

export default async function ReservationPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const defaults = {
    name: str(sp.name),
    phone: str(sp.phone),
    email: str(sp.email),
    date: str(sp.date),
    time: str(sp.time),
    guests: str(sp.guests),
    notes: str(sp.notes),
  };

  return (
    <>
      <Header />
      <main className="bg-ink pb-12 pt-24 sm:pb-20 sm:pt-28">
        <div className="container-page max-w-2xl">
          <h1 className="mt-2 flex items-center gap-3 font-display text-2xl font-bold text-cream sm:text-4xl">
            <CalendarCheck className="h-7 w-7 text-gold sm:h-8 sm:w-8" />
            Réserver une table
          </h1>
          <p className="mt-2 text-sm text-muted sm:mt-3 sm:text-base">
            Indiquez vos préférences : nous vous confirmons votre réservation par
            email dans les plus brefs délais.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-ink-soft p-5 sm:mt-8 sm:p-8">
            <ReservationForm defaults={defaults} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
