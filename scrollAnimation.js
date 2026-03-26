/* Gebruikte bronnen voor gsap:
https://gsap.com/docs/v3/
https://gsap.com/docs/v3/Plugins/ScrollTrigger/
https://gsap.com/docs/v3/Plugins/ScrollSmoother/
https://gsap.com/docs/v3/Plugins/SplitText/
https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/
https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/#accessible-animations-with-prefers-reduced-motion

*/

// GSAP plugins registeren
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, SplitText, ScrollSmoother);

// Smoothscroll aanzetten
ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 1,
  effects: true,
});

document.addEventListener("DOMContentLoaded", () => {
  // Animaties uit als reduced motion aan staat
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (!prefersReducedMotion) {
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

    // eerste horizontal panel
    document.fonts.ready.then(() => {
      gsap.utils.toArray(".panel h2, .panel p").forEach((el) => {
        const split = SplitText.create(el, { type: "words" });
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
          const split = SplitText.create(el, { type: "lines" });
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
  }
});
