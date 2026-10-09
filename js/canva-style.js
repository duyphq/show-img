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

// ── Memory album: 3D coverflow ring ──
// Same geometry and timing as the reference: each slide sits at offset d from the
// active one → translateX(60d%) translateZ(-150|d|px) rotateY(45d deg), scale and
// opacity shrinking with |d|; autoplay every 1.4s while visible (toggle button turns it
// on/off), paused for 6s after any manual move, swipe on touch.
(function () {
  var root = document.getElementById("coverflow");
  if (!root) return;
  var slides = Array.prototype.slice.call(root.querySelectorAll(".coverflow-slide"));
  var dots = Array.prototype.slice.call(root.querySelectorAll(".coverflow-dots button"));
  var title = root.querySelector(".coverflow-title");
  var text = root.querySelector(".coverflow-text");
  var n = slides.length, current = 0, autoplay = true, holding = false, visible = false, timer = null, holdTimer = null;
  var toggle = root.querySelector(".coverflow-toggle");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  function offset(i) {
    var d = (i - current + n) % n;
    if (d > n / 2) d -= n;
    return d;
  }

  function render() {
    slides.forEach(function (el, i) {
      var d = offset(i), a = Math.abs(d);
      el.style.transform = "translateX(" + 60 * d + "%) translateZ(" + -150 * a + "px) rotateY(" + 45 * d + "deg) scale(" + Math.max(0.7, 1 - 0.15 * a) + ")";
      el.style.opacity = Math.max(0.3, 1 - 0.25 * a);
      el.style.zIndex = 100 - a;
      el.classList.toggle("is-active", d === 0);
    });
    dots.forEach(function (b, i) { b.classList.toggle("is-active", i === current); });
    title.textContent = slides[current].dataset.title;
    text.textContent = slides[current].dataset.text;
  }

  function go(i) { current = (i + n) % n; render(); }
  function hold() {
    holding = true;
    clearTimeout(holdTimer);
    holdTimer = setTimeout(function () { holding = false; schedule(); }, 6000);
    schedule();
  }
  function schedule() {
    clearInterval(timer);
    if (n > 1 && autoplay && visible && !holding && !reduce.matches) timer = setInterval(function () { go(current + 1); }, 1400);
  }

  slides.forEach(function (el, i) { el.addEventListener("click", function () { if (i !== current) { go(i); hold(); } }); });
  dots.forEach(function (b, i) { b.addEventListener("click", function () { go(i); hold(); }); });
  root.querySelector(".coverflow-nav--prev").addEventListener("click", function () { go(current - 1); hold(); });
  root.querySelector(".coverflow-nav--next").addEventListener("click", function () { go(current + 1); hold(); });
  // auto-rotate keeps running under the mouse; this button switches it on/off
  toggle.addEventListener("click", function () {
    autoplay = !autoplay;
    holding = false;
    clearTimeout(holdTimer);
    toggle.classList.toggle("is-playing", autoplay);
    toggle.setAttribute("aria-pressed", String(autoplay));
    toggle.setAttribute("aria-label", autoplay ? "Tắt tự xoay" : "Bật tự xoay");
    if (autoplay) go(current + 1);
    schedule();
  });

  var start = null;
  var stage = root.querySelector(".coverflow-stage");
  stage.addEventListener("touchstart", function (e) { start = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }, { passive: true });
  stage.addEventListener("touchend", function (e) {
    if (!start) return;
    var dx = e.changedTouches[0].clientX - start.x, dy = Math.abs(e.changedTouches[0].clientY - start.y);
    start = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > dy) { go(current + (dx < 0 ? 1 : -1)); hold(); }
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; schedule(); }, { rootMargin: "300px 0px" }).observe(root);
  } else { visible = true; }
  if (reduce.addEventListener) reduce.addEventListener("change", schedule);

  render();
  schedule();
})();
