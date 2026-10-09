# Manas Chan, personal site

Plain HTML, CSS, and JavaScript. No build step.

## Preview locally
Open `index.html` in a browser, or for the most accurate result run
`python3 -m http.server` in this folder and visit http://localhost:8000.

## Edit
- Words on each page: the four `.html` files.
- Projects and photo captions: `assets/js/content.js` (instructions at the top).
- Colors, fonts, spacing: the tokens at the top of `assets/css/style.css`.

## Add project screenshots
Put images in `images/projects/<project-id>/`, then add them to that
project's `media` list in `content.js`, for example:
  { type: "image", src: "images/projects/robin/live-view.jpg", alt: "Robin's live identification screen" }
Resize screenshots to about 1600px wide first.

## Publish free on GitHub Pages
1. Create a repo named `goatchan28.github.io` and upload this folder's contents.
2. In the repo, Settings > Pages > Deploy from branch > main.
3. The site goes live at https://goatchan28.github.io
