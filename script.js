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

  if (!window.Vimeo) return;

  document.querySelectorAll("[data-video]").forEach(project => {
    const iframe = project.querySelector("iframe");
    const player = new Vimeo.Player(iframe);

    const playBtn = project.querySelector(".playpause");
    const timeline = project.querySelector(".timeline");
    const progress = project.querySelector(".progress");
    const watch = project.querySelector(".watch");

    let playing = false;
    let interval = null;

    // Hover preview (desktop)
    if (window.matchMedia("(hover: hover)").matches) {
      project.addEventListener("mouseenter", () => {
        player.setVolume(0);
        player.play().catch(() => {});
      });

      project.addEventListener("mouseleave", () => {
        if (!playing) player.pause().catch(() => {});
      });
    }

    // Click → fullscreen
    project.addEventListener("click", () => {
      if (watch) watch.style.display = "none";
      playing = true;

      player.setVolume(1);
      player.play();

      iframe.requestFullscreen();
      interval = setInterval(updateProgress, 200);
    });

    function updateProgress() {
      Promise.all([player.getCurrentTime(), player.getDuration()])
        .then(([t, d]) => {
          progress.style.width = (t / d) * 100 + "%";
        });
    }

    playBtn.onclick = e => {
      e.stopPropagation();
      if (playing) {
        player.pause();
        playBtn.textContent = "PLAY";
      } else {
        player.play();
        playBtn.textContent = "PAUSE";
      }
      playing = !playing;
    };

    timeline.onclick = e => {
      e.stopPropagation();
      const rect = timeline.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      player.getDuration().then(d => player.setCurrentTime(d * percent));
    };

    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement) {
        playing = false;
        if (watch) watch.style.display = "";
        player.pause();
        clearInterval(interval);
      }
    });
  });
};
