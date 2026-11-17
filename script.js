
"use strict";

/* =========================================
   46-MAKTAB FUTURISTIC
   MAIN JAVASCRIPT — UPDATED
========================================= */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// LOADER
window.addEventListener("load", () => {
  const loader = $("#loader");

  setTimeout(() => {
    loader?.classList.add("hide");
  }, 700);
});

// FOOTER YEAR
const year = $("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}

// MOBILE MENU
const menuToggle = $("#menuToggle");
const navigation = $("#navigation");

menuToggle?.addEventListener("click", () => {
  navigation?.classList.toggle("open");
  menuToggle.textContent =
    navigation?.classList.contains("open") ? "✕" : "☰";
});

$$(".navigation a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation?.classList.remove("open");
    if (menuToggle) menuToggle.textContent = "☰";
  });
});

// THEME SWITCH
const themeToggle = $("#themeToggle");

const savedTheme = localStorage.getItem("46_school_theme");

if (savedTheme === "light") {
  document.body.classList.add("light-theme");
  if (themeToggle) themeToggle.textContent = "☾";
}

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");

  const isLight =
    document.body.classList.contains("light-theme");

  localStorage.setItem(
    "46_school_theme",
    isLight ? "light" : "dark"
  );

  themeToggle.textContent = isLight ? "☾" : "☀";
  showToast(isLight ? "Yorug‘ rejim yoqildi" : "Qorong‘i rejim yoqildi");
});

// TOAST
function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

// BACK TO TOP
const backToTop = $("#backToTop");

window.addEventListener("scroll", () => {
  backToTop?.classList.toggle("show", window.scrollY > 450);
});

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// STATISTICS COUNTERS
const counters = $$(".counter");

function animateCounter(counter) {
  const target = Number(counter.dataset.target);
  if (!Number.isFinite(target)) return;

  const duration = 1800;
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const progress = Math.min(
      (currentTime - startTime) / duration,
      1
    );

    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.floor(target * eased);

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      counter.textContent = target + "+";
    }
  }

  requestAnimationFrame(updateCounter);
}

if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  counters.forEach(animateCounter);
}

// SCROLL REVEAL
const revealElements = $$(
  ".section-title, .about-grid, .director-card, " +
  ".person-card, .teacher-card, .education-card, " +
  ".news-card, .gallery-card, .contact-card, .contact-message"
);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => {
    element.classList.add("reveal");
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("revealed");
  });
}

// ACTIVE NAVIGATION
const pageSections = $$("main section[id]");
const navLinks = $$(".navigation a[href^='#']");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + entry.target.id
          );
        });
      });
    },
    { rootMargin: "-30% 0px -60% 0px" }
  );

  pageSections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

// 3D CARD EFFECT
const cards = $$(
  ".person-card, .teacher-card, .education-card, .news-card"
);

cards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 4;
    const rotateX = (0.5 - y / rect.height) * 4;

    card.style.transform =
      `perspective(700px) rotateX(${rotateX}deg) ` +
      `rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

// 3D SCHOOL ANIMATION
const schoolScene = $(".school-scene");

if (schoolScene) {
  schoolScene.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;

    const rect = schoolScene.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    const building = $(".school-building");

    if (building) {
      building.style.animation = "none";
      building.style.transform =
        `rotateY(${x * 22}deg) rotateX(${-y * 10 + 5}deg)`;
    }
  });

  schoolScene.addEventListener("pointerleave", () => {
    const building = $(".school-building");

    if (building) {
      building.style.animation = "";
      building.style.transform = "";
    }
  });
}

// SMOOTH ANCHOR LINKS
$$('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return;

    const target = $(id);

    if (target) {
      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      history.replaceState(null, "", id);
    }
  });
});

// GALLERY MESSAGE
$$(".gallery-card").forEach((card) => {
  card.addEventListener("click", () => {
    showToast("46-MAKTAB galereyasi");
  });
});

// CONSOLE
console.log(
  "%c46-MAKTAB FUTURISTIC",
  "color:#c084fc;font-size:22px;font-weight:bold;"
);

console.log(
  "%cRasmiy maktab veb-sayti ishga tushdi!",
  "color:#38bdf8;font-size:13px;"
);
