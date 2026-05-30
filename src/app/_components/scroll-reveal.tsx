"use client";

import { useEffect } from "react";

const TARGETS = ".sec-head,.feat,.prog-row,.ins,.ba-card,.rev,.cta-band,.contact-grid";
const STAGGER_PARENTS = [".feat-grid", ".ins-grid", ".ba-grid", ".rev-grid", ".prog-list"];

export function ScrollReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const els = Array.from(document.querySelectorAll<HTMLElement>(TARGETS));
    els.forEach((e) => e.classList.add("reveal"));

    STAGGER_PARENTS.forEach((sel) => {
      const parent = document.querySelector(sel);
      if (!parent) return;
      Array.from(parent.children).forEach((c, i) => {
        const el = c as HTMLElement;
        if (el.classList.contains("reveal")) {
          el.style.transitionDelay = `${i * 70}ms`;
        }
      });
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
    );
    els.forEach((e) => io.observe(e));

    return () => io.disconnect();
  }, []);

  return null;
}
