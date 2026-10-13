"use client";

import { useEffect, useRef } from "react";

/**
 * Tour body authored in WordPress (intro, Gutena tabs, day-by-day <details>),
 * with the tab switching and "Expand All / Collapse All" the theme adds.
 */
export function TourContent({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const tab = target.closest<HTMLElement>(".gutena-tab-title[data-tab]");
      if (tab) {
        const block = tab.closest(".gutena-tabs-block");
        if (block) selectTab(block, tab.dataset.tab ?? "1");
        return;
      }
      const toggle = target.closest<HTMLElement>(".expand-toggle-wrapper span");
      if (toggle) {
        const expand = toggle.classList.contains("expand-all");
        const wrapper = toggle.parentElement;
        wrapper?.querySelector(".expand-all")?.classList.toggle("hidden", expand);
        wrapper?.querySelector(".collapse-all")?.classList.toggle("hidden", !expand);
        wrapper?.parentElement?.querySelectorAll("details").forEach((d) => (d.open = expand));
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const target = e.target as HTMLElement;
      if (target.matches(".gutena-tab-title, .expand-toggle-wrapper span")) {
        e.preventDefault();
        target.click();
      }
    };
    // Tab titles and toggles are plain list items/spans in the CMS markup; make them keyboard-reachable.
    root.querySelectorAll<HTMLElement>(".gutena-tab-title, .expand-toggle-wrapper span").forEach((el) => {
      el.tabIndex = 0;
      el.setAttribute("role", "button");
    });
    root.addEventListener("click", onClick);
    root.addEventListener("keydown", onKey);
    return () => {
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKey);
    };
  }, []);

  return <div ref={ref} className="sl-tourpost__content" dangerouslySetInnerHTML={{ __html: html }} />;
}

function selectTab(block: Element, id: string) {
  block.querySelectorAll(":scope > .gutena-tabs-tab > .gutena-tab-title").forEach((li) => {
    const on = li.getAttribute("data-tab") === id;
    li.classList.toggle("active", on);
    li.classList.toggle("inactive", !on);
  });
  block.querySelectorAll(":scope > .gutena-tabs-content > .gutena-tab-block").forEach((panel) => {
    panel.classList.toggle("active", panel.getAttribute("data-tab") === id);
  });
}

/** Show every tab panel and open every day, for the PDF brochure. */
export function expandTourContent(root: Element) {
  root.querySelectorAll(".gutena-tab-block").forEach((panel) => panel.classList.add("active"));
  root.querySelectorAll<HTMLDetailsElement>(".gutena-tab-block details").forEach((d) => (d.open = true));
}

/** Back to the first tab with every day closed, as the theme resets after the PDF. */
export function collapseTourContent(root: Element) {
  root.querySelectorAll(".gutena-tabs-block").forEach((block) => selectTab(block, "1"));
  root.querySelectorAll<HTMLDetailsElement>(".gutena-tab-block details").forEach((d) => (d.open = false));
}
