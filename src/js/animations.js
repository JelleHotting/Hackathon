gsap.registerPlugin(ScrollTrigger);

const heroText = document.getElementById("hero-text");
const heading = document.querySelector("h1");
const viewer = document.querySelector("model-viewer");

// Entree-animaties nadat de pagina volledig geladen is
window.addEventListener("appReady", () => {
  const tl = gsap.timeline();

  // 3D model springt in beeld
  tl.fromTo(
    viewer,
    { scale: 0.4, opacity: 0, filter: "blur(10px)" },
    {
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      duration: 2.5,
      ease: "elastic.out(1, 0.7)",
    },
  );
});

// Model naar het midden van het scherm verplaatsen tijdens de eerste scroll
gsap.to(viewer, {
  top: "50%",
  ease: "power1.inOut",
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "top -75%", // klaar na 75% viewport scrollen
    scrub: 1, // animatie volgt de scroll
  },
});

// "Black-hole-suck" animatie — bestuurd door te scrollen!
gsap.to(viewer, {
  scale: 0,
  rotation: 1080,
  opacity: 0,
  filter: "blur(0px)",
  ease: "power1.inOut",
  scrollTrigger: {
    trigger: "body",
    start: "top -150%", // start animatie wanneer we anderhalf scherm ver zijn weggescrolld
    end: "bottom bottom", // eindig onderaan de hele document body
    scrub: 1, // de animatie volgt exact je muis/scrollwiel (1 = snelle soepele reactietijd)
  },
});

// ===== EASTER EGG: TYP "JEDI" VOOR STAR WARS =====
let typedSequence = "";
const secretCode = "jedi";

// Bron (APA): Hotting, J. (z.d.). AboutMeWebsite [Broncode]. GitHub. https://github.com/JelleHotting/AboutMeWebsite/blob/main/script.js
window.addEventListener("keydown", (e) => {
  // Easter egg activatie
  typedSequence += e.key.toLowerCase();

  if (typedSequence.length > secretCode.length) {
    typedSequence = typedSequence.slice(-secretCode.length);
  }

  if (typedSequence === secretCode) {
    const container = document.getElementById("star-wars-container");
    if (container) {
      // Haal class weg en trigger reflow om de pure-CSS animatie te kunnen herhalen
      container.classList.remove("active");
      void container.offsetWidth;
      container.classList.add("active");
    }
    typedSequence = ""; // reset
  }

  // Sluit de animatie met ESC
  if (e.key === "Escape") {
    const container = document.getElementById("star-wars-container");
    if (container && container.classList.contains("active")) {
      container.classList.remove("active");
      // Trick om de CSS animatie te resetten: clone en replace
      const crawl = container.querySelector(".star-wars-crawl");
      if (crawl) {
        const newCrawl = crawl.cloneNode(true);
        crawl.parentNode.replaceChild(newCrawl, crawl);
      }
    }
  }
});
