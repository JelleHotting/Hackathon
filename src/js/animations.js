gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, SplitText);

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
    end: "30% top", // eindig bij 350% viewport height
    scrub: 1, // de animatie volgt exact je muis/scrollwiel (1 = snelle soepele reactietijd)
  },
});

// Reveal de "Inside the Black Hole" sectie aan het einde van de scroll
gsap.to("#black-hole-info", {
  opacity: 1,
  pointerEvents: "auto",
  scrollTrigger: {
    trigger: "body",
    start: "30% top", // fires at ~300vh
    end: "35% top", // finishes at ~350vh before text triggers
    scrub: true,
  },
});

// --- Inhoud van scrollAnimation.js (Aangepast voor integratie) ---

// Animatie eerste sectie
gsap.from(".introSection .informationText", {
  scrollTrigger: {
    trigger: ".introSection",
    start: "top center",
    end: "top 150px",
    scrub: 1.5,
  },
  rotation: 180,
  x: -200,
  opacity: 0,
  scale: 0.2,
});

// Animatie tweede sectie
gsap.from(".missionSection .informationText", {
  scrollTrigger: {
    trigger: ".missionSection",
    start: "top center",
    end: "top 50px",
    scrub: 1.5,
  },
  rotation: 360,
  x: 200,
  opacity: 0,
  scale: 0.2,
});

// Animatie derde sectie
gsap.from(".corevalueSection .informationText", {
  scrollTrigger: {
    trigger: ".corevalueSection",
    start: "top center",
    end: "top 150px",
    scrub: 2.5,
  },
  rotation: 180,
  x: -400,
  opacity: 0,
  scale: 0.2,
});

// Satteliet svg wat het pad volgt
gsap.to(".satellite", {
  immediateRender: true,
  motionPath: {
    path: "#guide-path",
    align: "#guide-path",
    alignOrigin: [0.5, 0.5],
    autoRotate: true,
    useSVG: true,
  },
  ease: "none",
  scrollTrigger: {
    trigger: ".informationSectionsWrapper",
    start: "top center",
    end: "bottom 20%",
    scrub: 1,
    markers: false,
  },
});

// Fade de satelliet uit wanneer deze bij de horizontalContainer komt
gsap.to(".satellite", {
  opacity: 0,
  ease: "power1.inOut",
  scrollTrigger: {
    trigger: ".horizontalContainer",
    start: "top center", // Begint de fade-out als header in beeld komt
    end: "top top", // Helemaal onzichtbaar zodra we vastpinnen
    scrub: true,
  },
});

// Horizontal scroll container
const horizontalScroll = gsap.to(".horizontalContainer", {
  x: () =>
    -(
      document.querySelector(".horizontalContainer").scrollWidth -
      window.innerWidth
    ),
  ease: "none",
  scrollTrigger: {
    trigger: ".horizontalContainer",
    start: "top top",
    end: () =>
      "+=" + document.querySelector(".horizontalContainer").scrollWidth,
    pin: true,
    scrub: 1,
  },
});

// Text fade in animatie voor de panels
document.fonts.ready.then(() => {
  // eerste horizontal panel
  gsap.utils.toArray(".panel:nth-child(1) h2, .panel:nth-child(1) p").forEach((el) => {
    const split = new SplitText(el, { type: "words" });
    gsap.from(split.words, {
      opacity: 0,
      y: 20,
      filter: "blur(8px)",
      stagger: 0.04,
      duration: 0.6,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        containerAnimation: horizontalScroll,
        toggleActions: "play none none reset",
        start: "left 80%",
      },
    });
  });

  // tweede horizontal panel
  gsap.utils
    .toArray(".panel:nth-child(2) h2, .panel:nth-child(2) p")
    .forEach((el) => {
      const split = new SplitText(el, { type: "lines" });
      gsap.from(split.lines, {
        rotationX: -100,
        transformOrigin: "50% 50% -160px",
        opacity: 0,
        duration: 3,
        ease: "power3",
        stagger: 0.25,
        scrollTrigger: {
          trigger: el,
          containerAnimation: horizontalScroll,
          scrub: 1,
          start: "left 80%",
        },
      });
    });
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
