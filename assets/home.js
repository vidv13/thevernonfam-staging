/* Rocky Hill Farm — the front page.
 * Hangs the right season's painting, turns the season when the date-stamp
 * is clicked, and does a quiet roll call of the windows once per visit.
 */
(function () {
  "use strict";

  var farm = window.RockyHill;
  var stage = document.querySelector(".stage");
  var scene = document.querySelector(".scene");
  var almanac = document.querySelector(".almanac");
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function hang(season, instantly) {
    var img = new Image();
    img.className = "art";
    img.alt = season.alt;
    img.decoding = "async";
    img.src = farm.url(season);

    var show = function () {
      var old = scene.querySelectorAll(".art");
      scene.appendChild(img);
      if (instantly || calm) {
        img.style.transition = "none";
        img.classList.add("is-on");
        old.forEach(function (el) { el.remove(); });
        return;
      }
      // Let the new painting fade in over the old one, then take the old one down.
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { img.classList.add("is-on"); });
      });
      setTimeout(function () { old.forEach(function (el) { el.remove(); }); }, 1600);
    };

    if (img.decode) img.decode().then(show, show);
    else img.onload = show;
    return img;
  }

  function stamp(season) {
    almanac.textContent = farm.stamp(season);
    almanac.setAttribute("aria-label", farm.stamp(season) + ". Turn the season.");
  }

  function rollCall() {
    var KEY = "rhf-rollcall";
    try {
      if (sessionStorage.getItem(KEY)) return;
      sessionStorage.setItem(KEY, "1");
    } catch (e) { /* private mode: just do it */ }
    stage.classList.add("is-rollcall");
    setTimeout(function () { stage.classList.remove("is-rollcall"); }, 4200);
  }

  // First hanging
  scene.innerHTML = "";
  var first = hang(farm.season, true);
  stamp(farm.season);
  almanac.hidden = farm.seasons.length < 2;

  if (!calm) {
    var begin = function () { setTimeout(rollCall, 500); };
    if (first.decode) first.decode().then(begin, begin);
    else begin();
  }

  // Turning the season
  farm.onChange(function (season) {
    hang(season, false);
    stamp(season);
  });

  almanac.addEventListener("click", function () { farm.turn(); });

  // Warm the cache so the first turn of the season is a clean fade.
  window.addEventListener("load", function () {
    setTimeout(function () {
      farm.seasons.forEach(function (s) {
        if (s !== farm.season) new Image().src = farm.url(s);
      });
    }, 1500);
  });
})();
