gsap.registerPlugin(ScrollTrigger);

const heroText = document.getElementById("hero-text");
const heading = document.querySelector("h1");
const viewer = document.querySelector("model-viewer");

// Entree-animaties nadat de pagina volledig geladen is
window.addEventListener("appReady", () => {
  const tl = gsap.timeline();

  // Filmische fade-in voor de hoofdtitel
  tl.fromTo(
    heading,
    { y: 100, opacity: 0, filter: "blur(20px)", scale: 0.9 },
    {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
      duration: 1.8,
      ease: "power3.out",
    },
  )
    // Tekst die langzaam van onderen 'onthuld' wordt
    .fromTo(
      heroText,
      { y: 40, opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" },
      {
        y: 0,
        opacity: 0.9,
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        duration: 1.2,
        ease: "power2.out",
      },
      "-=1", // Overlap dit frame deels met de titel-animatie
    )
    // 3D model springt in beeld
    .fromTo(
      viewer,
      { scale: 0.4, opacity: 0, filter: "blur(10px)" },
      {
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 2.5,
        ease: "elastic.out(1, 0.7)",
      },
      "-=1.5",
    );
});

// Scroll-gestuurde filmische exit: verkleinen + letterafstand + blur + langzaam wegebben
gsap.to(heroText, {
  scale: 0.4,
  opacity: 0,
  filter: "blur(12px)",
  letterSpacing: "0.4em",
  y: -60,
  ease: "power2.in",
  scrollTrigger: {
    trigger: "section",
    start: "top top", // begint zodra de sectie de bovenkant van je scherm raakt
    end: "+=30%", // loopt door over 30% extra scroll-afstand
    scrub: 1.2, // vloeiende scrub — speciaal een beetje traag (1.2s lag) voor een grootser effect
  },
});

// "Black-hole-suck" animatie — bestuurd door te scrollen!
// Vertaalt de oude CSS keyframes naar dynamische animatie.
gsap.to(viewer, {
  scale: 0, 
  rotation: 1080, 
  opacity: 0,
  filter: "blur(20px)",
  ease: "power1.inOut",
  scrollTrigger: {
    trigger: "body",
    start: "top -150%", // start animatie wanneer we anderhalf scherm ver zijn weggescrolld
    end: "bottom bottom", // eindig onderaan de hele document body
    scrub: 1, // de animatie volgt exact je muis/scrollwiel (1 = snelle soepele reactietijd)
  }
});
