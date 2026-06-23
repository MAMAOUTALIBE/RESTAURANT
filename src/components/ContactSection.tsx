import { MapPin, Phone, Mail, Clock, Navigation } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/config";

const mapsHref = `https://maps.google.com/?q=${encodeURIComponent(
  siteConfig.contact.address,
)}`;

const infos: { Icon: typeof MapPin; label: string; href?: string }[] = [
  { Icon: MapPin, label: siteConfig.contact.address, href: mapsHref },
  {
    Icon: Phone,
    label: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`,
  },
  {
    Icon: Mail,
    label: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
  },
  { Icon: Clock, label: "Lun – Dim : 11h00 – 23h00" },
];

/** Section Contact : coordonnées + formulaire connecté. */
export function ContactSection() {
  return (
    <section id="contact" className="section bg-ink">
      <div className="container-page">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wider text-gold">
            Contact
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-cream sm:text-4xl">
            Contactez-nous
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-2 lg:gap-10">
          <Reveal>
            <ul className="space-y-4">
              {infos.map(({ Icon, label, href }) => (
                <li key={label} className="flex items-center gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 text-gold">
                    <Icon className="h-5 w-5" />
                  </span>
                  {href ? (
                    <a
                      href={href}
                      className="text-cream/85 transition hover:text-gold"
                    >
                      {label}
                    </a>
                  ) : (
                    <span className="text-cream/85">{label}</span>
                  )}
                </li>
              ))}
            </ul>
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline mt-5 w-full sm:w-auto"
            >
              <Navigation className="h-4 w-4 text-gold" />
              Itinéraire
            </a>
          </Reveal>
          <Reveal>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
