const modelViewer = document.getElementById("satellite-viewer");
const loader = document.querySelector(".loader");
const progressBar = document.querySelector(".loader progress");

// Only show the loading animation once per session (resets on hard refresh)
if (sessionStorage.getItem("loaderShown")) {
  loader.classList.add("hidden");
} else {
  const loadStartTime = Date.now();
  const MIN_LOAD_TIME = 5000; // 5 seconds in milliseconds
  let modelLoaded = false;

  function updateProgress() {
    const elapsedTime = Date.now() - loadStartTime;
    const progress = Math.min((elapsedTime / MIN_LOAD_TIME) * 100, 100);
    progressBar.value = progress;
  }

  function hideLoaderIfReady() {
    const elapsedTime = Date.now() - loadStartTime;
    if (modelLoaded && elapsedTime >= MIN_LOAD_TIME) {
      loader.classList.add("hidden");
      sessionStorage.setItem("loaderShown", "true");
    }
  }

  // Mark model as loaded
  modelViewer.addEventListener("load", () => {
    modelLoaded = true;
    hideLoaderIfReady();
  });

  // Update progress bar every frame
  const progressInterval = setInterval(() => {
    updateProgress();
    hideLoaderIfReady();
  }, 16); // ~60fps

  // Check if 5 seconds have passed and clear interval
  setTimeout(() => {
    clearInterval(progressInterval);
    updateProgress();
    hideLoaderIfReady();
  }, MIN_LOAD_TIME);
}

let currentYaw = 0;
let targetYaw = 0;
let currentPitch = 75;
let targetPitch = 75;

function updateTargetFromScroll() {
  const maxScroll = window.innerHeight * 2; // 300vh
  const progress = Math.min(window.scrollY / maxScroll, 1);
  targetYaw = progress * 500;
  targetPitch = 60 + progress * 30;

  // Toggle fade-out class after scroll completes
  if (progress >= 1) {
    modelViewer.classList.add("fade-out");
  } else {
    modelViewer.classList.remove("fade-out");
  }
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