window.onload = () => {
  const intro = document.getElementById("intro");
  const work = document.getElementById("work");

  setTimeout(() => {
    intro.style.opacity = "0";
    setTimeout(() => {
      intro.style.display = "none";
      work.classList.add("loaded");
    }, 1500);
  }, 2000);

  document.querySelectorAll("[data-video]").forEach(project => {

    const iframe = project.querySelector("iframe");
    if (!iframe) return;

    const clickLayer = project.querySelector(".click-layer");
    const watch = project.querySelector(".watch");
    const player = new Vimeo.Player(iframe);

    let playing = false;

    // Hover preview only for main hero videos (not commercials)
    const isCommercial = project.classList.contains("commercial");
    if (!isCommercial && window.matchMedia("(hover: hover)").matches) {
      project.addEventListener("mouseenter", () => {
        player.setVolume(0);
        player.play().catch(() => {});
      });
      project.addEventListener("mouseleave", () => {
        if (!project.classList.contains("is-fullscreen")) {
          player.pause().catch(() => {});
        }
      });
    }

    // Click → play + fullscreen
    clickLayer.addEventListener("click", async () => {
      watch.style.display = "none";
      project.classList.add("is-fullscreen");
      project.classList.add("is-playing");

      await player.setVolume(1);
      await player.play();

      (project.requestFullscreen ||
       project.webkitRequestFullscreen ||
       project.msRequestFullscreen).call(project);

      playing = true;
    });

    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement) {
        project.classList.remove("is-fullscreen");
        project.classList.remove("is-playing");
        watch.style.display = "";
        player.pause();
        playing = false;
      }
    });
  });
};
