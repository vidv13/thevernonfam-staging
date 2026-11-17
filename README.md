# thevernonfam.com

Static home page for thevernonfam.com, served by GitHub Pages.

Restored from the `tvf_web_linux` decommission backup taken 2026-09-06
(`s3://tvfweb-decom-backup-636957065322/i-0660fa635ce666c24/2026-09-06/www.tar.gz`,
docroot `www/sites/thevernonfam.com/html`). The original EC2 host was
terminated on 2026-09-06.

Home page only. The archived site also contained a `booklist/` page and a
`marlo/` directory of PHP scripts and research data; neither is published here.

## Deploy

Pushing to `main` publishes automatically via GitHub Pages.

## Staging

`tools/stage.sh` publishes the current commit (any branch) to a separate
GitHub Pages repo for review, without touching the live site:
https://vidv13.github.io/thevernonfam-staging/ (noindex, no CNAME).
To go live, merge the branch into `main`.

## The house (`/`) and the rooms (`/people/<name>/`)

Static HTML/CSS/JS, no build step. All paths are relative.

- `index.html` — the house. Each of the nine windows is a link to a room.
- `assets/base.css` — fonts, colours, and the window positions
  (`.w-up-1` … `.w-down-4`, as percentages of the painting).
- `assets/seasons.js` — the list of seasons. To add one, paint the same house
  at the same framing (3:2), drop it in `assets/img/`, and add one entry.
- `people/<name>/index.html` — a room. Everything inside `<main>` belongs to
  its owner; rooms can add their own CSS/JS without touching the house.

## Recipes (`/recipes/`)

Weekly dinner plan + family recipe box at thevernonfam.com/recipes/.
Static HTML/CSS/JS, no build step.

- `recipes/data.js` — all content. Add recipes to `RECIPES`; plan a week by
  adding an entry to `WEEKS` with its Monday date and a recipe per day.
- `recipes/app.js` — routing (`#/week`, `#/week/<monday>/<day>`, `#/box`,
  `#/r/<slug>`), check-off state (saved per phone in localStorage),
  keep-screen-on, swipe between days.
