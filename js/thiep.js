// index.html (invitation) — splash, calendar, countdown, album dots, scroll reveal
(function () {
  var WEDDING = new Date("2026-11-28T18:00:00+07:00");

  // ── Splash: floating hearts + "Mở thiệp" ──
  var splash = document.getElementById("splash");
  var hearts = splash.querySelector(".splash-hearts");
  var tones = ["#8E2A35", "#A33B47", "#C9A46A", "#E8D9C4"];
  for (var i = 0; i < 14; i++) {
    var h = document.createElement("i");
    h.style.left = Math.random() * 100 + "%";
    h.style.color = tones[i % tones.length];
    h.style.opacity = 0.6;
    h.style.scale = (0.5 + Math.random() * 0.8).toFixed(2);
    h.style.animationDuration = 9 + Math.random() * 9 + "s";
    h.style.animationDelay = -Math.random() * 14 + "s";
    hearts.appendChild(h);
  }

  var HEART = '<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.1C.9 8.6 3 5 6.6 5c2 0 3.4 1.1 4.4 2.6C12 6.1 13.4 5 15.4 5 19 5 21.1 8.6 19.6 11.9 17.5 16.4 12 21 12 21z" fill="currentColor"/></svg>';

  // ── Music: plays audio/nhac.mp3 if present; button hidden otherwise ──
  var bgm = document.getElementById("bgm");
  var musicBtn = document.getElementById("musicBtn");
  bgm.addEventListener("canplay", function () { musicBtn.hidden = false; }, { once: true });
  if (bgm.readyState >= 3) musicBtn.hidden = false; // already loaded before this script ran
  bgm.addEventListener("error", function () { musicBtn.remove(); });
  function setPlaying(on) { musicBtn.classList.toggle("is-playing", on); }
  bgm.addEventListener("play", function () { setPlaying(true); });
  bgm.addEventListener("pause", function () { setPlaying(false); });
  musicBtn.addEventListener("click", function () {
    if (bgm.paused) bgm.play().catch(function () {}); else bgm.pause();
  });

  // ── Ambient petals + hearts drifting down the page ──
  function startAmbient() {
    var layer = document.getElementById("ambient");
    var colors = ["#8E2A35", "#B0495A", "#E1BC7C", "#E9CE9E", "#F3E3DA"];
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    for (var k = 0; k < 18; k++) {
      var el = document.createElement("i");
      var isHeart = k % 3 === 0;
      el.className = isHeart ? "heart" : "petal";
      if (isHeart) el.innerHTML = HEART;
      el.style.left = Math.random() * 100 + "%";
      el.style.setProperty("--c", colors[k % colors.length]);
      el.style.setProperty("--sway", (Math.random() * 120 - 60).toFixed(0) + "px");
      el.style.scale = (0.6 + Math.random() * 0.8).toFixed(2);
      el.style.animationDuration = (11 + Math.random() * 10).toFixed(1) + "s";
      el.style.animationDelay = (-Math.random() * 20).toFixed(1) + "s";
      layer.appendChild(el);
    }
  }

  // ── Open the card: hearts burst, splash lifts away, music + petals start ──
  document.getElementById("openCard").addEventListener("click", function () {
    // particle burst: hearts, petals and sparkles from the centre
    var FLOWER = '<svg viewBox="0 0 24 24" fill="currentColor"><g><ellipse cx="12" cy="5" rx="2.2" ry="4.5"/><ellipse cx="12" cy="5" rx="2.2" ry="4.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="5" rx="2.2" ry="4.5" transform="rotate(120 12 12)"/><ellipse cx="12" cy="5" rx="2.2" ry="4.5" transform="rotate(180 12 12)"/><ellipse cx="12" cy="5" rx="2.2" ry="4.5" transform="rotate(240 12 12)"/><ellipse cx="12" cy="5" rx="2.2" ry="4.5" transform="rotate(300 12 12)"/></g><circle cx="12" cy="12" r="1.8" fill-opacity=".45"/></svg>';
    var shapes = [HEART, FLOWER, "✦"];
    var pcolors = ["#E1BC7C", "#F3E3DA", "#B0495A", "#E9CE9E", "#ffffff"];
    for (var n = 0; n < 28; n++) {
      var pt = document.createElement("div");
      var x = Math.random() * 100, y = Math.random() * 100;
      pt.className = "particle";
      pt.innerHTML = shapes[n % shapes.length];
      pt.style.color = pcolors[n % pcolors.length];
      pt.style.fontSize = (12 + Math.random() * 16).toFixed(0) + "px";
      pt.style.textShadow = "0 0 10px " + pcolors[n % pcolors.length];
      pt.style.setProperty("--dx", ((x - 50) * 5).toFixed(0) + "px");
      pt.style.setProperty("--dy", ((y - 50) * 5).toFixed(0) + "px");
      pt.style.setProperty("--rot-start", (Math.random() * 40 - 20).toFixed(0) + "deg");
      pt.style.setProperty("--rot-end", (120 + Math.random() * 180).toFixed(0) + "deg");
      pt.style.setProperty("--delay", (Math.random() * 0.25).toFixed(2) + "s");
      document.body.appendChild(pt);
      setTimeout(pt.remove.bind(pt), 1800);
    }
    splash.classList.add("is-open");
    document.body.classList.remove("is-locked");
    setTimeout(function () { splash.remove(); }, 1400);
    if (bgm.readyState > 0 || bgm.networkState !== 3) bgm.play().catch(function () {});
    startAmbient();
  });

  // ── Calendar: November 2026, Monday-first, heart on the 28th ──
  var grid = document.getElementById("calendarGrid");
  var year = 2026, month = 10; // 0-based
  var offset = (new Date(year, month, 1).getDay() + 6) % 7;
  var days = new Date(year, month + 1, 0).getDate();
  var html = "";
  for (var b = 0; b < offset; b++) html += "<span></span>";
  for (var d = 1; d <= days; d++) {
    html += d === 28 ? '<span class="is-day" aria-label="Ngày cưới 28">' + d + "</span>" : "<span>" + d + "</span>";
  }
  grid.innerHTML = html;

  // ── Countdown ──
  var cd = {};
  ["d", "h", "m", "s"].forEach(function (k) { cd[k] = document.querySelector('[data-cd="' + k + '"]'); });
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function tick() {
    var diff = Math.max(0, WEDDING - Date.now());
    var s = Math.floor(diff / 1000);
    cd.d.textContent = pad(Math.floor(s / 86400));
    cd.h.textContent = pad(Math.floor((s % 86400) / 3600));
    cd.m.textContent = pad(Math.floor((s % 3600) / 60));
    cd.s.textContent = pad(s % 60);
  }
  tick();
  setInterval(tick, 1000);

  // ── Album: scroll-snap track with synced dots ──
  var track = document.getElementById("albumTrack");
  var dots = document.getElementById("albumDots");
  var slides = Array.prototype.slice.call(track.children);
  slides.forEach(function (slide, idx) {
    var dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", "Ảnh " + (idx + 1));
    dot.addEventListener("click", function () {
      track.scrollTo({ left: slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2, behavior: "smooth" });
    });
    dots.appendChild(dot);
  });

  function markActive() {
    var mid = track.scrollLeft + track.clientWidth / 2, best = 0, bestDist = Infinity;
    slides.forEach(function (slide, idx) {
      var dist = Math.abs(slide.offsetLeft + slide.clientWidth / 2 - mid);
      if (dist < bestDist) { bestDist = dist; best = idx; }
    });
    slides.forEach(function (slide, idx) { slide.classList.toggle("is-active", idx === best); });
    Array.prototype.forEach.call(dots.children, function (dot, idx) { dot.classList.toggle("is-active", idx === best); });
  }
  track.addEventListener("scroll", function () { window.requestAnimationFrame(markActive); }, { passive: true });
  window.addEventListener("resize", markActive);
  markActive();

  // ── Reveal on scroll ──
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-in"); });
  }
})();
