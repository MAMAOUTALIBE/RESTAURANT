import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarCheck } from "lucide-react";
import { ReservationForm } from "@/components/ReservationForm";

export const metadata: Metadata = {
  title: "Réserver une table",
  description:
    "Réservez votre table chez N'KULU Saveurs Africaines en quelques clics.",
};

export default function ReservationPage() {
  return (
    <main className="min-h-screen bg-ink pb-20 pt-28">
      <div className="container-page max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l&apos;accueil
        </Link>

        <h1 className="mt-6 flex items-center gap-3 font-display text-3xl font-bold text-cream sm:text-4xl">
          <CalendarCheck className="h-8 w-8 text-gold" />
          Réserver une table
        </h1>
        <p className="mt-3 text-muted">
          Indiquez vos préférences : nous vous confirmons votre réservation par
          email dans les plus brefs délais.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-ink-soft p-6 sm:p-8">
          <ReservationForm />
        </div>
      </div>
    </main>
  );
}
