"use client";

import Link from "next/link";
import { useState } from "react";
import type { TourPrice } from "@/lib/wp";
import { DatePicker } from "./DatePicker";
import { prepareSnapshot } from "./pdfSnapshot";
import { CalendarDaysIcon, CircleChevronDownIcon, DollarSignIcon, FilePdfIcon, MinusIcon, PlusIcon, RouteIcon } from "./tourIcons";
import { collapseTourContent, expandTourContent } from "./TourContent";

const MAX_PAX = 3;

/**
 * Tour summary box: duration, per-pax price with saving and discount badge,
 * the expandable price calculator (1–3 travellers), and the action buttons.
 */
export function TourPricePanel({
  duration,
  prices,
  discount,
  brochureName,
}: {
  duration: string;
  prices: TourPrice[];
  discount: string;
  brochureName: string;
}) {
  const [pax, setPax] = useState(1);
  const [calcOpen, setCalcOpen] = useState(false);
  const [date, setDate] = useState("");
  const price = prices[pax - 1] ?? prices[0];
  const total = Math.round((price?.amount ?? 0) * pax);

  return (
    <div className="sl-tourpanel">
      <div className="sl-tourpanel__row">
        <div className="sl-tourpanel__top">
          <div className="sl-tourpanel__item">
            <CalendarDaysIcon className="sl-tourpanel__icon" />
            <div className="sl-tourpanel__detail">
              <span className="sl-tourpanel__label">Duration</span>
              <span className="sl-tourpanel__value">{duration}</span>
            </div>
          </div>
          <div className="sl-tourpanel__item">
            <DollarSignIcon className="sl-tourpanel__icon" />
            <div className="sl-tourpanel__detail">
              <span className="sl-tourpanel__label">Price per pax</span>
              <span className="sl-tourpanel__value sl-tourpanel__price">
                <span className="sl-tourpanel__old">{price?.old}</span>
                <span>{price?.current}</span>
              </span>
            </div>
          </div>
          <div className="sl-tourpanel__item">
            <p className="sl-tourpanel__save">
              Save US$ <span>{price?.save}</span>
            </p>
          </div>
        </div>
        <div className="sl-tourpanel__discount">
          <span>{discount}</span>
        </div>
      </div>

      <div className="sl-tourpanel__calc-wrap">
        <button type="button" className="sl-tourpanel__trigger" aria-expanded={calcOpen} onClick={() => setCalcOpen((o) => !o)}>
          <span>Open price calculator</span>
          <CircleChevronDownIcon />
        </button>
        <div className={`sl-tourpanel__expand${calcOpen ? " is-expanded" : ""}`} inert={!calcOpen}>
          <div className="sl-tourpanel__calc">
            <div className="sl-tourpanel__calc-top">
              <div className="sl-tourpanel__calc-inner">
                <div className="sl-tourpanel__field">
                  <span>Arrival date</span>
                  <DatePicker value={date} onChange={setDate} />
                </div>
                <div className="sl-tourpanel__field sl-tourpanel__pax">
                  <span>No. of pax</span>
                  <div className="sl-tourpanel__stepper">
                    <button type="button" aria-label="Fewer travellers" onClick={() => setPax((p) => Math.max(1, p - 1))}>
                      <MinusIcon />
                    </button>
                    <input type="text" readOnly value={pax} aria-label="Number of travellers" />
                    <button type="button" aria-label="More travellers" onClick={() => setPax((p) => Math.min(MAX_PAX, p + 1))}>
                      <PlusIcon />
                    </button>
                  </div>
                </div>
              </div>
              <div className="sl-tourpanel__total" aria-live="polite">
                <span>Total</span>
                <span className="sl-tourpanel__total-val">
                  <span className="sl-tourpanel__currency">US$</span>
                  <span className="sl-tourpanel__amount">{total}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sl-tourpanel__buttons">
        <BrochureButton fileName={brochureName} />
        <a className="sl-tourpanel__btn sl-tourpanel__btn--light" href="#map">
          <RouteIcon />
          <span>View route on map</span>
        </a>
        <Link className="sl-tourpanel__btn sl-tourpanel__btn--book" href="/contact">
          Book your tour
        </Link>
      </div>
    </div>
  );
}

/**
 * Saves the whole tour article as a PDF, with every tab and day expanded,
 * as the theme does with html2pdf.
 */
function BrochureButton({ fileName }: { fileName: string }) {
  const [busy, setBusy] = useState(false);

  const download = async () => {
    const article = document.querySelector<HTMLElement>(".sl-tourpost");
    if (!article || busy) return;
    setBusy(true);
    expandTourContent(article);
    try {
      const [{ default: html2pdf }] = await Promise.all([import("html2pdf.js"), new Promise((r) => setTimeout(r, 500))]);
      await html2pdf()
        .set({
          margin: 0.5,
          filename: `${fileName}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, onclone: prepareSnapshot },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .from(article)
        .save();
    } finally {
      collapseTourContent(article);
      setBusy(false);
    }
  };

  return (
    <button type="button" className="sl-tourpanel__btn sl-tourpanel__btn--light" onClick={download} disabled={busy}>
      <FilePdfIcon />
      <span>Download Brochure</span>
    </button>
  );
}
