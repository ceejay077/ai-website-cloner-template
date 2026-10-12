import Image from "next/image";

import { cn } from "@/lib/utils";

import { footerMenus, partnerLogos } from "./data";
import { SiteLink } from "./SiteLink";

export function SiteFooter() {
  return (
    <footer id="footer" className="sl-flex sl-flex-col site-footer">
      <div className="sl-flex footer-top-container">
        <div className="sl-row top-inner">
          {footerMenus.map((menu) => (
            <div key={menu.label} className="sl-col-lg-3 sl-col-12 menu-inner-wrapper">
              <nav className="sl-flex footer-menu" aria-label={menu.label}>
                <ul className="nav-menu">
                  {menu.items.map((item) => (
                    <li key={item.label} className={cn("menu-item", item.current && "current-menu-item")}>
                      <SiteLink
                        href={item.href}
                        target={item.newTab ? "_blank" : undefined}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.label}
                      </SiteLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          ))}
          <div className="sl-col-lg-3 sl-col-12">
            <p>
              No. 21 - 6/1,
              <br />
              Nelu Gardens,
              <br />
              Yatiyana, Minuwangda,
              <br />
              Sri Lanka.
            </p>
            <div className="sl-flex sl-flex-col contact-wrapper">
              <div className="sl-flex">
                <i className="fa-solid fa-phone" aria-hidden="true" />
                <span>0094 779 144664</span>
              </div>
              <div className="sl-flex">
                <i className="fa-solid fa-phone" aria-hidden="true" />
                <span>0094 112281729</span>
              </div>
              <div className="sl-flex">
                <i className="fa-solid fa-at" aria-hidden="true" />
                <a href="mailto:showlankatours@gmail.com">showlankatours@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="sl-container">
        <div className="sl-flex sl-flex-col footer-bottom-wrapper">
          <div className="icons-wrapper sl-flex">
            {partnerLogos.map((logo) => (
              <a key={logo.alt} href={logo.href} target="_blank" className="outer-wrapper">
                <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} sizes="90px" />
              </a>
            ))}
          </div>
          <div className="sl-flex social-wrapper">
            <a href="https://web.facebook.com/showlankatouroperators/" target="_blank" aria-label="Facebook">
              <i className="fa-brands fa-facebook" aria-hidden="true" />
            </a>
            <a href="https://www.youtube.com/@showlanka" target="_blank" aria-label="YouTube">
              <i className="fa-brands fa-youtube" aria-hidden="true" />
            </a>
          </div>
          <p>&copy; Showlanka tours {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
