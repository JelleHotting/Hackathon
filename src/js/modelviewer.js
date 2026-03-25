const modelViewer = document.getElementById("satellite-viewer");
const loader = document.querySelector(".loader");
const progressBar = document.querySelector(".loader progress");

document.body.style.overflow = "hidden"; // Voorkom scrollen tijdens het laden
const loadStartTime = Date.now();
const MIN_LOAD_TIME = 3500; // 3.5 seconden in milliseconden
let modelLoaded = false;
let skipLoading = true; // * Zet deze op false om de loader te laten zien *

const progressText = document.getElementById("progress-text");

if (skipLoading) {
  loader.classList.add("hidden");
  document.body.style.overflow = "";
}

function updateProgress() {
  const elapsedTime = Date.now() - loadStartTime;
  const progress = Math.min((elapsedTime / MIN_LOAD_TIME) * 100, 100);
  if (progressBar) progressBar.value = progress;
  if (progressText) {
    if (progress >= 100 && modelLoaded) {
      progressText.innerText = "READY";
    } else {
      document.body.style.overflow = "none";
      progressText.innerText = `${Math.floor(progress)}%`;
    }
  }
}

function hideLoaderIfReady() {
  const elapsedTime = Date.now() - loadStartTime;
  if (modelLoaded && elapsedTime >= MIN_LOAD_TIME) {
    loader.classList.add("hidden");
    document.body.style.overflow = ""; // Scrollen weer toestaan
    window.dispatchEvent(new Event("appReady"));
  }
}

// Markeer het 3D model als geladen
modelViewer.addEventListener("load", () => {
  modelLoaded = true;
  hideLoaderIfReady();
});

// Update voortgangsbalk elke frame
const progressInterval = setInterval(() => {
  updateProgress();
  hideLoaderIfReady();
}, 16); // ~60 beeldverversingen per seconde

// Controleer of de minimale laadtijd verstreken is en stop de interval
setTimeout(() => {
  clearInterval(progressInterval);
  updateProgress();
  hideLoaderIfReady();
}, MIN_LOAD_TIME);

let currentYaw = 0;
let targetYaw = 0;
let currentPitch = 75;
let targetPitch = 75;

function updateTargetFromScroll() {
  const maxScroll = window.innerHeight * 2; // 300vh representatie
  const progress = Math.min(window.scrollY / maxScroll, 1);
  targetYaw = progress * 500;
  targetPitch = 60 + progress * 30;
}

function animate() {
  currentYaw += (targetYaw - currentYaw) * 0.08;
  currentPitch += (targetPitch - currentPitch) * 0.08;
  modelViewer.cameraOrbit = `${currentYaw.toFixed(2)}deg ${currentPitch.toFixed(2)}deg 3.2m`;
  requestAnimationFrame(animate);
}

window.addEventListener("scroll", updateTargetFromScroll, {
  passive: true,
});
window.addEventListener("resize", updateTargetFromScroll);

updateTargetFromScroll();
animate();
