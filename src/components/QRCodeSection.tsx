import QRCode from "qrcode";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { qrFeatures } from "@/data/services";
import { siteConfig } from "@/lib/config";

/** Carte « Commandez en un scan » avec un vrai QR code vers le menu. */
export async function QRCodeSection() {
  const target = `${siteConfig.url}/commander`;
  const qrSvg = await QRCode.toString(target, {
    type: "svg",
    margin: 1,
    color: { dark: "#080808", light: "#ffffff" },
  });

  return (
    <Reveal className="h-full">
      <div
        id="commander-qr"
        className="relative h-full overflow-hidden rounded-xl bg-forest p-7 text-cream shadow-card sm:p-8"
      >
        <div className="absolute inset-0 bg-kente opacity-40" aria-hidden />
        <div className="relative">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-gold">
            Digital
          </p>
          <h3 className="font-display text-2xl font-bold leading-tight sm:text-3xl">
            Commandez en un scan
          </h3>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/80">
            Scannez le QR Code et accédez à notre menu complet depuis votre
            téléphone.
          </p>

          <div className="mt-6 flex items-center gap-5">
            <div
              className="h-[140px] w-[140px] shrink-0 overflow-hidden rounded-lg bg-white p-2 [&>svg]:h-full [&>svg]:w-full"
              role="img"
              aria-label="QR code vers la page de commande"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
            <ul className="space-y-2.5">
              {qrFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-gold text-ink">
                    <Check className="h-3 w-3" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <a href="/commander" className="btn-primary mt-7 w-full sm:w-auto">
            Voir le menu &amp; commander
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </Reveal>
  );
}
