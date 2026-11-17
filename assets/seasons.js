/* Rocky Hill Farm — the seasons.
 *
 * To add a season: paint the same house (same framing, 3:2), save it in
 * assets/img/, and add one entry below. Nothing else needs to change.
 *
 *   id      used in <html data-season="…"> for any season-specific CSS
 *   label   what the little date-stamp says
 *   starts  "MM-DD" — the season runs from this day until the next one starts
 *   art     file in assets/img/
 *   sky     colour of the sky at the top of the painting (fills above it on phones)
 *   alt     how the painting is described to someone who can't see it
 */
(function () {
  "use strict";

  var SEASONS = [
    {
      id: "summer",
      label: "Summer",
      starts: "05-01",
      art: "house-summer.webp",
      sky: "#abc4e7",
      alt: "The Vernon house at Rocky Hill Farm in summer: a white brick house with tall columns and dark shutters, every window lit, under green trees."
    },
    {
      id: "fall",
      label: "Fall",
      starts: "09-15",
      art: "house-fall.webp",
      sky: "#afc0d3",
      alt: "The Vernon house at Rocky Hill Farm in autumn: a white brick house with tall columns and dark shutters, every window lit, under orange trees at golden hour."
    }
    // { id: "winter", label: "Winter", starts: "12-01", art: "house-winter.webp", sky: "#…", alt: "…" },
    // { id: "spring", label: "Spring", starts: "03-01", art: "house-spring.webp", sky: "#…", alt: "…" },
  ];

  var KEY = "rhf-season";
  var imgBase = new URL("img/", document.currentScript.src).href;
  var listeners = [];
  var current = null;

  function byId(id) {
    for (var i = 0; i < SEASONS.length; i++) if (SEASONS[i].id === id) return SEASONS[i];
    return null;
  }

  /* The season whose start date most recently passed (wrapping over New Year). */
  function forDate(date) {
    var today = ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
    var sorted = SEASONS.slice().sort(function (a, b) { return a.starts < b.starts ? -1 : 1; });
    var pick = sorted[sorted.length - 1];
    for (var i = 0; i < sorted.length; i++) if (sorted[i].starts <= today) pick = sorted[i];
    return pick;
  }

  function remembered() {
    try { return byId(sessionStorage.getItem(KEY)); } catch (e) { return null; }
  }

  function apply(season, remember) {
    current = season;
    var root = document.documentElement;
    root.dataset.season = season.id;
    root.style.setProperty("--art", 'url("' + imgBase + season.art + '")');
    root.style.setProperty("--sky", season.sky);
    if (remember) {
      try { sessionStorage.setItem(KEY, season.id); } catch (e) { /* private mode */ }
    }
    listeners.forEach(function (fn) { fn(season); });
  }

  window.RockyHill = {
    seasons: SEASONS,
    get season() { return current; },
    url: function (season) { return imgBase + season.art; },
    stamp: function (season) { return season.label + " " + new Date().getFullYear(); },
    /* Turn to the next season in the list. */
    turn: function () {
      var i = SEASONS.indexOf(current);
      apply(SEASONS[(i + 1) % SEASONS.length], true);
    },
    onChange: function (fn) { listeners.push(fn); }
  };

  apply(remembered() || forDate(new Date()), false);
})();
