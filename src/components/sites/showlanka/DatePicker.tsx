"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDaysIcon } from "./tourIcons";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const POPUP_HEIGHT = 250;

const pad = (n: number) => String(n).padStart(2, "0");
/** jQuery UI's default "mm/dd/yy" format, e.g. 10/20/2026. */
const format = (d: Date) => `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`;
const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

function parse(value: string): Date | null {
  const m = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return m ? new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2])) : null;
}

/** Read-only date field with a jQuery UI–style month calendar. */
export function DatePicker({
  value,
  onChange,
  name,
  label = "Arrival date",
  placeholder = "Select date",
  className = "sl-datepicker",
  icon = true,
}: {
  value: string;
  onChange: (value: string) => void;
  name?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  /** The tour calculator shows a calendar icon; the contact form's fields don't. */
  icon?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => new Date());
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const show = () => {
    const input = inputRef.current;
    if (!input) return;
    const box = input.getBoundingClientRect();
    // Like jQuery UI: open below the field, or above it when there's no room.
    const above = box.bottom + POPUP_HEIGHT > window.innerHeight && box.top > POPUP_HEIGHT;
    setPos({
      top: window.scrollY + (above ? box.top - POPUP_HEIGHT : box.bottom),
      left: window.scrollX + box.left,
    });
    const selected = parse(value);
    setView(selected ?? new Date());
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!popupRef.current?.contains(target) && !inputRef.current?.contains(target)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const year = view.getFullYear();
  const month = view.getMonth();
  const first = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));
  const today = new Date();
  const selected = parse(value);

  return (
    <div className={className}>
      <input ref={inputRef} readOnly name={name} placeholder={placeholder} type="text" value={value} onFocus={show} onClick={show} aria-label={label} />
      {icon && <CalendarDaysIcon />}
      {open &&
        createPortal(
          <div ref={popupRef} className="sl-datepicker__popup" style={{ top: pos.top, left: pos.left }} role="dialog" aria-label={`Choose ${label.toLowerCase()}`}>
            <div className="sl-datepicker__header">
              <button type="button" className="sl-datepicker__nav" aria-label="Prev" onClick={() => setView(new Date(year, month - 1, 1))}>
                <NavIcon direction="prev" />
              </button>
              <button type="button" className="sl-datepicker__nav sl-datepicker__nav--next" aria-label="Next" onClick={() => setView(new Date(year, month + 1, 1))}>
                <NavIcon direction="next" />
              </button>
              <div className="sl-datepicker__title">
                {MONTHS[month]}&nbsp;{year}
              </div>
            </div>
            <table className="sl-datepicker__calendar">
              <thead>
                <tr>
                  {DAYS.map((d) => (
                    <th key={d} scope="col">
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeks.map((week, w) => (
                  <tr key={w}>
                    {week.map((day, i) => {
                      if (!day) return <td key={i} />;
                      const date = new Date(year, month, day);
                      const state = selected && sameDay(date, selected) ? " is-active" : sameDay(date, today) ? " is-today" : "";
                      return (
                        <td key={i}>
                          <button
                            type="button"
                            className={`sl-datepicker__day${state}`}
                            onClick={() => {
                              onChange(format(date));
                              setOpen(false);
                            }}
                          >
                            {day}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
          document.body,
        )}
    </div>
  );
}

/** jQuery UI's circle-triangle icon. */
function NavIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden>
      <circle cx="8" cy="8" r="7" />
      <path d={direction === "prev" ? "M9.5 4.5 6 8l3.5 3.5z" : "M6.5 4.5 10 8l-3.5 3.5z"} />
    </svg>
  );
}
