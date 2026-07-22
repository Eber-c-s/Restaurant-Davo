/* Restaurant Davo — main.js
   Vanilla JS, sin dependencias externas. */
(function () {
  "use strict";

  /* ---------- Header: estado sólido al hacer scroll ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var mobileMenu = document.querySelector(".mobile-menu");
  if (toggle && mobileMenu) {
    toggle.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.toggle("is-open");
      document.body.classList.toggle("menu-open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileMenu.classList.remove("is-open");
        document.body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) {
        mobileMenu.classList.remove("is-open");
        document.body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------- Revelado suave al hacer scroll ---------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 6, 5) * 70 + "ms";
      io.observe(el);
    });
  }

  /* ---------- Carta: navegación de categorías con scrollspy ---------- */
  var menuNavLinks = document.querySelectorAll(".menu-nav__row a");
  if (menuNavLinks.length) {
    var sections = Array.prototype.map.call(menuNavLinks, function (a) {
      return document.querySelector(a.getAttribute("href"));
    }).filter(Boolean);

    function setActiveByHash() {
      var scrollPos = window.scrollY + 200;
      var current = sections[0];
      sections.forEach(function (sec) {
        if (sec.offsetTop <= scrollPos) current = sec;
      });
      menuNavLinks.forEach(function (a) {
        var match = a.getAttribute("href") === "#" + (current && current.id);
        a.classList.toggle("is-active", match);
        if (match) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
    }
    document.addEventListener("scroll", throttle(setActiveByHash, 120), { passive: true });
    setActiveByHash();

    menuNavLinks.forEach(function (a) {
      a.addEventListener("click", function (e) {
        var target = document.querySelector(a.getAttribute("href"));
        if (target) {
          e.preventDefault();
          var y = target.getBoundingClientRect().top + window.scrollY - 130;
          window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });
          history.replaceState(null, "", a.getAttribute("href"));
        }
      });
    });
  }

  function throttle(fn, wait) {
    var last = 0;
    return function () {
      var now = Date.now();
      if (now - last >= wait) {
        last = now;
        fn();
      }
    };
  }

  /* ---------- Formularios: validación accesible + confirmación local ---------- */
  var forms = document.querySelectorAll("form[data-form]");
  forms.forEach(function (form) {
    var status = form.querySelector(".form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = form.checkValidity();
      if (!valid) {
        form.reportValidity();
        if (status) {
          status.textContent = "Por favor completa los campos obligatorios.";
          status.className = "form-status is-error";
        }
        return;
      }
      var name = form.querySelector('[name="nombre"]');
      var whatsMsg = form.getAttribute("data-whatsapp-template");
      if (status) {
        status.textContent = "¡Gracias" + (name && name.value ? ", " + name.value.split(" ")[0] : "") + "! Tu solicitud fue registrada. Para confirmar de inmediato, te redirigiremos a WhatsApp.";
        status.className = "form-status is-success";
      }
      if (whatsMsg) {
        var data = new FormData(form);
        var msg = whatsMsg.replace(/\{(\w+)\}/g, function (_, key) {
          return data.get(key) || "-";
        });
        var url = "https://wa.me/56973603573?text=" + encodeURIComponent(msg);
        setTimeout(function () { window.open(url, "_blank", "noopener"); }, 900);
      }
      form.reset();
    });
  });

  /* ---------- Año actual en footer ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
