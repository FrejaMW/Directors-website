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

    // Only run if this project actually has a Vimeo iframe
    const iframe = project.querySelector("iframe");
    if (!iframe) return;

    const clickLayer = project.querySelector(".click-layer");
    const watch = project.querySelector(".watch");

    const player = new Vimeo.Player(iframe);

    let playing = false;
    let interval = null;

    const isDiscreet = project.closest(".discreet") !== null;

    /* Hover preview (only on non-discreet videos) */
    if (!isDiscreet && window.matchMedia("(hover: hover)").matches) {
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

    /* CLICK → PLAY + FULLSCREEN */
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
      interval = setInterval(updateProgress, 200);
    });

    function updateProgress() {
      player.getCurrentTime().then(t => {
        return player.getDuration().then(d => {
          const percent = (t / d) * 100;
          const progress = project.querySelector(".progress");
          if (progress) progress.style.width = percent + "%";
        });
      });
    }

    // Optional controls if added later
    const playBtn = project.querySelector(".playpause");
    if (playBtn) {
      playBtn.addEventListener("click", e => {
        e.stopPropagation();
        if (playing) {
          player.pause();
          playBtn.textContent = "PLAY";
          project.classList.remove("is-playing");
        } else {
          player.play();
          playBtn.textContent = "PAUSE";
          project.classList.add("is-playing");
        }
        playing = !playing;
      });
    }

    const timeline = project.querySelector(".timeline");
    if (timeline) {
      timeline.addEventListener("click", e => {
        e.stopPropagation();
        const rect = timeline.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        player.getDuration().then(d => player.setCurrentTime(d * percent));
      });
    }

    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement) {
        project.classList.remove("is-fullscreen");
        project.classList.remove("is-playing");
        watch.style.display = "";
        player.pause();
        clearInterval(interval);
        playing = false;
      }
    });
  });
};
