import Link from "next/link";
import { AtSign, Phone } from "lucide-react";
import { contact, footerNavs, partners, social } from "./config";

export function SiteFooter() {
  return (
    <footer className="sl-footer" role="contentinfo">
      <div className="sl-footer__top">
        {footerNavs.map((nav) => (
          <nav key={nav.label} aria-label={nav.label}>
            <ul className="sl-footer__menu">
              {nav.links.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a href={link.href} target="_blank" rel="noopener">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href}>{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div>
          <p style={{ margin: "0 0 16px" }}>
            {contact.address.map((line) => (
              <span key={line} style={{ display: "block" }}>
                {line}
              </span>
            ))}
          </p>
          <div className="sl-footer__contact">
            {contact.phones.map((phone) => (
              <div key={phone}>
                <Phone size={12} fill="currentColor" aria-hidden />
                <span>{phone}</span>
              </div>
            ))}
            <div>
              <AtSign size={12} aria-hidden />
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </div>
          </div>
        </div>
      </div>
      <div className="sl-footer__bottom">
        <div className="sl-footer__icons">
          {partners.map((partner) => (
            <a key={partner.alt} href={partner.href} target="_blank" rel="noopener">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={partner.src} alt={partner.alt} loading="lazy" />
            </a>
          ))}
        </div>
        <div className="sl-footer__social">
          <a href={social.facebook} target="_blank" rel="noopener" aria-label="Facebook">
            <svg viewBox="0 0 512 512" width={16} height={16} fill="currentColor" aria-hidden>
              <path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256c0 120 82.7 220.8 194.2 248.5V334.2h-52.8V256h52.8v-33.7c0-87.1 39.4-127.5 125-127.5 16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287v175.9C413.8 494.8 512 386.9 512 256z" />
            </svg>
          </a>
          <a href={social.youtube} target="_blank" rel="noopener" aria-label="YouTube">
            <svg viewBox="0 0 576 512" width={18} height={16} fill="currentColor" aria-hidden>
              <path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6C14.9 167 14.9 256.4 14.9 256.4s0 89.4 11.4 132.3c6.3 23.6 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zM232.2 337.6V175.2l142.7 81.2-142.7 81.2z" />
            </svg>
          </a>
        </div>
        <p style={{ margin: 0 }}>© Showlanka tours {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
