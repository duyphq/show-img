// Background music. It tries to start by itself as soon as the page loads; where the
// browser blocks sound until the guest interacts (iOS Safari, Chrome on a first visit…)
// it starts on the guest's first tap / click / key press instead.
(function () {
  var audio = document.getElementById("bgm");
  var btn = document.getElementById("musicBtn");
  if (!audio || !btn) return;
  audio.volume = 0.6;
  var userPaused = false;
  var GESTURES = ["pointerdown", "keydown", "touchstart"];

  function sync() {
    var on = !audio.paused;
    btn.classList.toggle("is-playing", on);
    btn.setAttribute("aria-pressed", String(on));
    btn.setAttribute("aria-label", on ? "Tắt nhạc" : "Bật nhạc");
  }
  function play() { return audio.play().then(sync, function (err) { sync(); throw err; }); }

  function firstGesture(e) {
    if (e.target.closest && e.target.closest("#musicBtn")) return;
    GESTURES.forEach(function (t) { document.removeEventListener(t, firstGesture, true); });
    if (!userPaused && audio.paused) play().catch(function () {});
  }

  play().catch(function () {
    GESTURES.forEach(function (t) { document.addEventListener(t, firstGesture, { capture: true, passive: true }); });
  });

  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    if (audio.paused) { userPaused = false; play().catch(function () {}); } else { userPaused = true; audio.pause(); }
  });
  audio.addEventListener("play", sync);
  audio.addEventListener("pause", sync);

  // pause when the tab is hidden, resume when it comes back (unless the guest turned it off)
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { if (!audio.paused) { audio.pause(); audio.dataset.resume = "1"; } }
    else if (audio.dataset.resume && !userPaused) { delete audio.dataset.resume; play().catch(function () {}); }
  });
})();
