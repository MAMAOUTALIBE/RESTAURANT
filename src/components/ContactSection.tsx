import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/config";

const phoneHref = `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`;
const mailHref = `mailto:${siteConfig.contact.email}`;
const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  siteConfig.contact.address,
)}`;

const infos = [
  {
    Icon: MapPin,
    label: siteConfig.contact.address,
    href: mapsHref,
    external: true,
  },
  {
    Icon: Phone,
    label: siteConfig.contact.phone,
    href: phoneHref,
    external: false,
  },
  {
    Icon: Mail,
    label: siteConfig.contact.email,
    href: mailHref,
    external: false,
  },
  {
    Icon: Clock,
    label: "Lun – Dim : 11h00 – 23h00",
    href: null,
    external: false,
  },
];

/** Section Contact : coordonnées cliquables + formulaire connecté. */
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

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <Reveal>
            <ul className="space-y-3">
              {infos.map(({ Icon, label, href, external }) => {
                const inner = (
                  <>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 text-gold">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-cream/85">{label}</span>
                  </>
                );
                return (
                  <li key={label}>
                    {href ? (
                      <a
                        href={href}
                        {...(external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="flex items-center gap-4 rounded-xl py-2 transition hover:text-gold [&_span:last-child]:hover:text-gold"
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 py-2">
                        {inner}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </Reveal>
          <Reveal>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
