(function () {
  "use strict";

  var data = window.__BRAND__ || {};
  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.from((scope || document).querySelectorAll(sel)); };
  var fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "] failed:", e); }
  }

  // ---------------------------------------------------------------
  // Nav: solidify on scroll + mobile toggle
  // ---------------------------------------------------------------
  function initNav() {
    var nav = $("[data-nav]");
    if (!nav) return;
    var onScroll = function () {
      if (scrollY > 60) nav.classList.add("is-scrolled");
      else nav.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var toggle = $("[data-nav-toggle]");
    var menu = $("[data-nav-menu]");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$(".nav-link, .btn-nav", menu).forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---------------------------------------------------------------
  // Smooth anchor scrolling (native)
  // ---------------------------------------------------------------
  function initSmoothAnchors() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var navOffset = 80;
      window.scrollTo({
        top: el.getBoundingClientRect().top + scrollY - navOffset,
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    });
  }

  // ---------------------------------------------------------------
  // Reveal on scroll
  // ---------------------------------------------------------------
  function initReveals() {
    var els = $$("[data-reveal]");
    if (!els.length) return;
    var io = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-revealed");
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.01, rootMargin: "0px 0px -2% 0px" });
      els.forEach(function (el) { io.observe(el); });
    }

    // Redundant safety net: some environments (older browsers, certain
    // automation/preview contexts) don't reliably fire IntersectionObserver
    // on programmatic scrolls. A throttled scroll/resize check guarantees
    // content never stays stuck at opacity:0.
    var raf = null;
    function sweep() {
      raf = null;
      $$("[data-reveal]:not(.is-revealed)").forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 1.02 && r.bottom > 0) {
          el.classList.add("is-revealed");
          if (io) io.unobserve(el);
        }
      });
    }
    function onScrollOrResize() {
      if (!raf) raf = requestAnimationFrame(sweep);
    }
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    sweep();

    setTimeout(function () {
      $$("[data-reveal]:not(.is-revealed)").forEach(function (el) {
        el.classList.add("is-revealed");
      });
    }, 6000);
  }

  // ---------------------------------------------------------------
  // Subtle 3D tilt on category cards
  // ---------------------------------------------------------------
  function initTilt() {
    if (!fineHover) return;
    $$(".cat-card:not(.cat-card-empty)").forEach(function (card) {
      var MAX = 6;
      var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        tx = -py * MAX; ty = px * MAX;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      card.addEventListener("mouseleave", function () {
        tx = 0; ty = 0;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      function loop() {
        cx += (tx - cx) * 0.15; cy += (ty - cy) * 0.15;
        card.style.setProperty("--rx", cx.toFixed(2) + "deg");
        card.style.setProperty("--ry", cy.toFixed(2) + "deg");
        raf = (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) ? requestAnimationFrame(loop) : null;
      }
    });
  }

  // ---------------------------------------------------------------
  // Contact form -> builds a WhatsApp deep link from the fields
  // ---------------------------------------------------------------
  function initContactForm() {
    var form = $("[data-contact-form]");
    if (!form) return;
    var submitBtn = form.querySelector("[type=submit]");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      var nombre = form.elements["nombre"] ? form.elements["nombre"].value.trim() : "";
      var interes = form.elements["interes"] ? form.elements["interes"].value : "";
      var mensaje = form.elements["mensaje"] ? form.elements["mensaje"].value.trim() : "";

      var lines = ["Hola Apu Outdoors, soy " + nombre + "."];
      if (interes) lines.push("Me interesa: " + interes + ".");
      if (mensaje) lines.push(mensaje);
      var text = encodeURIComponent(lines.join(" "));
      var phone = (data.whatsapp || "").replace(/\D/g, "");

      // window.open must run synchronously inside the click/submit handler —
      // any setTimeout/async delay here loses the user-gesture and gets
      // silently popup-blocked by Chrome/Safari/Firefox.
      window.open("https://wa.me/" + phone + "?text=" + text, "_blank", "noopener");

      form.classList.add("is-sending");
      if (submitBtn) submitBtn.classList.add("is-sending");
      setTimeout(function () {
        form.classList.remove("is-sending");
        if (submitBtn) submitBtn.classList.remove("is-sending");
      }, 900);
    });
  }

  // ---------------------------------------------------------------
  // ScrollTrigger-powered hero parallax (progressive enhancement)
  // ---------------------------------------------------------------
  function initHeroParallax() {
    if (!window.gsap || !window.ScrollTrigger) return;
    var heroContent = $(".hero-inner");
    if (!heroContent) return;
    gsap.to(heroContent, {
      yPercent: -30, opacity: 0.15, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
  }

  function boot() {
    safe(initNav, "initNav");
    safe(initSmoothAnchors, "initSmoothAnchors");
    safe(initReveals, "initReveals");
    safe(initTilt, "initTilt");
    safe(initContactForm, "initContactForm");

    if (window.gsap && window.ScrollTrigger) {
      try { gsap.registerPlugin(ScrollTrigger); } catch (_) {}
      safe(initHeroParallax, "initHeroParallax");
    }

    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
