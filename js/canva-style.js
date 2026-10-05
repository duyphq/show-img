// thiep-canva.html — countdown, hanging vines, scroll reveal, back-to-top
(function () {
  var WEDDING = new Date("2026-11-28T18:00:00+07:00");

  // ── Countdown ──
  var cd = {};
  ["d", "h", "m", "s"].forEach(function (k) { cd[k] = document.querySelector('[data-cd="' + k + '"]'); });
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function tick() {
    var s = Math.floor(Math.max(0, WEDDING - Date.now()) / 1000);
    cd.d.textContent = pad(Math.floor(s / 86400));
    cd.h.textContent = pad(Math.floor((s % 86400) / 3600));
    cd.m.textContent = pad(Math.floor((s % 3600) / 60));
    cd.s.textContent = pad(s % 60);
  }
  tick();
  setInterval(tick, 1000);

  // ── Hanging vines ──
  // The RSVP section has the supplied vine artwork inlined in index.html (static);
  // every other .vines box gets the drawn, swaying strands.
  var boxes = document.querySelectorAll(".vines");
  var otherBoxes = Array.prototype.filter.call(boxes, function (b) { return !b.classList.contains("vines--art") && !b.classList.contains("vines--static"); });
  drawStrands();

  function drawStrands() {
  var lengths = [0.62, 0.32, 0.9, 0.28, 0.55, 0.78, 0.4];
  otherBoxes.forEach(function (box) {
    if (box.childElementCount) return;
    lengths.forEach(function (len, i) {
      var NS = "http://www.w3.org/2000/svg";
      var svg = document.createElementNS(NS, "svg");
      svg.setAttribute("viewBox", "0 0 60 " + Math.round(400 * len));
      svg.setAttribute("preserveAspectRatio", "xMidYMin slice");
      svg.style.height = Math.round(620 * len) + "px";
      svg.style.animationDelay = (-i * 0.9).toFixed(1) + "s";
      svg.innerHTML = '<use href="#vine"/>';
      box.appendChild(svg);
    });
  });
  }

  // ── Reveal on scroll ──
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-in"); });
  }

  // ── Active nav link + back-to-top ──
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav a[href^='#']"));
  var toTop = document.querySelector(".to-top");
  function onScroll() {
    toTop.classList.toggle("is-shown", window.scrollY > window.innerHeight * 0.8);
    var current = links[0];
    links.forEach(function (a) {
      var target = document.querySelector(a.getAttribute("href"));
      if (target && target.getBoundingClientRect().top <= 120) current = a;
    });
    links.forEach(function (a) { a.classList.toggle("is-active", a === current); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
