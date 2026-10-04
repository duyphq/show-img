// Get that hamburger menu cookin' //

document.addEventListener("DOMContentLoaded", function() {
  // Get all "navbar-burger" elements
  var $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll(".navbar-burger"),
    0
  );
  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach(function($el) {
      $el.addEventListener("click", function() {
        // Get the target from the "data-target" attribute
        var target = $el.dataset.target;
        var $target = document.getElementById(target);
        // Toggle the class on both the "navbar-burger" and the "navbar-menu"
        $el.classList.toggle("is-active");
        $target.classList.toggle("is-active");
      });
    });
  }
});

// Smooth Anchor Scrolling
$(document).on("click", 'a[href^="#"]', function(event) {
  event.preventDefault();
  $("html, body").animate(
    {
      scrollTop: $($.attr(this, "href")).offset().top
    },
    500
  );
});

// When the user scrolls down 20px from the top of the document, show the scroll up button
window.onscroll = function() {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("toTop").style.display = "block";
  } else {
    document.getElementById("toTop").style.display = "none";
  }
}

// Preloader
$(document).ready(function($) {
  $(".preloader-wrapper").fadeOut();
  $("body").removeClass("preloader-site");
});
$(window).on('load', function() {
  var Body = $("body");
  Body.addClass("preloader-site");
});

// Envelope countdown timer
(function() {
  var target = new Date("2026-11-28T18:00:00+07:00").getTime();
  function updateCountdown() {
    var now = Date.now();
    var diff = target - now;
    if (diff < 0) diff = 0;
    var days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((diff % (1000 * 60)) / 1000);
    var eDays    = document.getElementById("eDays");
    var eHours   = document.getElementById("eHours");
    var eMinutes = document.getElementById("eMinutes");
    var eSeconds = document.getElementById("eSeconds");
    if (eDays)    eDays.textContent    = String(days).padStart(2, "0");
    if (eHours)   eHours.textContent   = String(hours).padStart(2, "0");
    if (eMinutes) eMinutes.textContent = String(minutes).padStart(2, "0");
    if (eSeconds) eSeconds.textContent = String(seconds).padStart(2, "0");
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

// Heart button
document.addEventListener("DOMContentLoaded", function () {
  var heartBtn = document.getElementById("heartBtn");
  if (!heartBtn) return;
  heartBtn.addEventListener("click", function () {
    var text = document.getElementById("heartText");
    var isConfirmed = heartBtn.classList.contains("confirmed");
    heartBtn.classList.add("beating");
    heartBtn.addEventListener("animationend", function () {
      heartBtn.classList.remove("beating");
    }, { once: true });
    heartBtn.classList.toggle("confirmed");
    text.textContent = isConfirmed ? "Xác nhận tham gia" : "Xác nhận";
  });
});

// Invitation card lace frame: one SVG of overlapping fan scallops along the
// top + sides, with a diagonal scallop on each top corner. Rebuilt on resize
// so the scallops always fit the card exactly (no cut-off tiles).
(function () {
  var card = document.querySelector(".inv-card");
  if (!card) return;
  var NS = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(NS, "svg");
  svg.setAttribute("class", "inv-lace");
  svg.setAttribute("aria-hidden", "true");
  card.insertBefore(svg, card.firstChild);

  function scallop(cx, cy, R, dir, petals, spread) {
    // dir = outward angle in degrees; returns [solid shapes, hole shapes]
    var solid = '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '"/>';
    var holes = '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R * 0.17) + '"/>';
    for (var i = 0; i < petals; i++) {
      var a = dir - spread / 2 + (spread * i) / (petals - 1);
      var rad = (a * Math.PI) / 180;
      // rim lobe: makes the outline follow each petal
      solid += '<circle cx="' + (cx + Math.cos(rad) * R * 0.86) + '" cy="' + (cy + Math.sin(rad) * R * 0.86) + '" r="' + (R * 0.3) + '"/>';
      // middle petal longer, the two outer petals plumper
      var rx = R * 0.11, ry = R * 0.25;
      if (petals === 5 && i === 2) { rx = R * 0.1; ry = R * 0.31; }
      if (i === 0 || i === petals - 1) { rx = R * 0.15; ry = R * 0.27; }
      var dist = R * 0.31 + ry;
      var px = cx + Math.cos(rad) * dist, py = cy + Math.sin(rad) * dist;
      holes += '<ellipse cx="' + px + '" cy="' + py + '" rx="' + rx + '" ry="' + ry +
        '" transform="rotate(' + (a + 90) + ' ' + px + ' ' + py + ')"/>';
    }
    return [solid, holes];
  }

  function build() {
    var W = card.offsetWidth, H = card.offsetHeight;
    if (!W || !H) return;
    var p = parseFloat(getComputedStyle(card).paddingTop) || 26; // panel inset
    var s = p / 26;
    var R = 17 * s;            // scallop radius
    var step = 32 * s;         // centre spacing (< 2R so neighbours overlap)
    var c = R * 1.2;           // scallop centre line, inset from the edge
    var solid = "", holes = "";
    function add(parts) { solid += parts[0]; holes += parts[1]; }

    // base band under the scallops (hidden mostly by the ivory panel)
    solid += '<rect x="' + c + '" y="' + c + '" width="' + (W - 2 * c) + '" height="' + (p - c + 2) + '"/>';
    solid += '<rect x="' + c + '" y="' + c + '" width="' + (p - c + 2) + '" height="' + (H - c) + '"/>';
    solid += '<rect x="' + (W - p - 2) + '" y="' + c + '" width="' + (p - c + 2) + '" height="' + (H - c) + '"/>';

    // top edge
    var n = Math.max(2, Math.round((W - 2 * c) / step)), d = (W - 2 * c) / n;
    for (var i = 1; i < n; i++) add(scallop(c + i * d, c, R, -90, 5, 130));
    // sides (run past the bottom; the envelope pocket covers them)
    var m = Math.ceil((H - c) / step) + 1, e = (W - 2 * c) / n; // reuse top spacing
    for (var j = 1; j < m; j++) {
      add(scallop(c, c + j * e, R, 180, 5, 130));
      add(scallop(W - c, c + j * e, R, 0, 5, 130));
    }
    // corners: slightly larger, pointing diagonally outward
    // corner centre pushed inward so its rim lobes stay inside the card
    var Rc = R * 1.12, cc = Rc * 1.16 / Math.SQRT2 + Rc * 0.45;
    add(scallop(cc, cc, Rc, -135, 7, 200));
    add(scallop(W - cc, cc, Rc, -45, 7, 200));

    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.innerHTML =
      '<defs>' +
      // blur + alpha threshold rounds the notches where scallops meet
      '<filter id="invLaceSmooth" x="-5%" y="-5%" width="110%" height="110%">' +
      '<feGaussianBlur stdDeviation="' + (1.1 * s) + '"/>' +
      '<feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -11"/></filter>' +
      '<mask id="invLaceMask" maskUnits="userSpaceOnUse" x="0" y="0" width="' + W + '" height="' + H + '">' +
      '<g fill="white" filter="url(#invLaceSmooth)">' + solid + '</g><g fill="black">' + holes + "</g></mask></defs>" +
      '<rect width="' + W + '" height="' + H + '" fill="#FBF7EE" mask="url(#invLaceMask)"/>';
  }

  build();
  if (window.ResizeObserver) new ResizeObserver(build).observe(card);
  else window.addEventListener("resize", build);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
})();
