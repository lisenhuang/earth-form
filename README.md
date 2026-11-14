# Earth / Form

An artistic, interactive 3D ceramics website following a piece of pottery from raw clay to a finished vessel.

[Explore the live website](https://earth-form-ceramics.ethanng89.chatgpt.site)

## Inspiration

The idea for this project came from [Build 3D Websites with Kimi Code - Tutorial #4 by Kimi AI](https://www.youtube.com/watch?v=GZFoexLsMi8). The video inspired the clay-to-ceramic journey, custom 3D vessel, shifting glaze highlights, and editorial presentation. This repository contains a separately implemented website inspired by that concept.

## Experience

- Follow the clay through centering, shaping, drying, firing, and the finished object.
- Open the pottery studio to sculpt the vessel directly or adjust its height, body width, and opening.
- Explore Round, Tall, and Open shape presets.
- Choose Moss, Chalk, or Iron glaze and adjust gloss and lighting.
- Rotate the vessel, zoom in, inspect surface detail, or scrub through the transformation.
- Use touch controls, keyboard navigation, reduced motion, and a static fallback when 3D is unavailable.

## Run locally

No build step or package installation is required. From the repository root:

```sh
python3 -m http.server 4173 --directory dist
```

Open [http://localhost:4173](http://localhost:4173). Serve the files over HTTP rather than opening the HTML file directly, because the site uses JavaScript modules.

## Controls

In the studio, drag to rotate or select **Shape clay** and drag sideways across the vessel to change its profile. Scroll over the vessel to zoom; on a touch device, pinch to zoom. Use the sliders for precise adjustments.

With the 3D canvas focused, arrow keys rotate, `+` and `-` zoom, and `0` resets the view. Press `Escape` to return to the story. **Reset all** restores the original vessel. Shape edits remain during the current visit and reset on reload.

## Implementation

Built with HTML, CSS, JavaScript, and Three.js. The model is created procedurally in the browser, with morphing geometry and physically based materials. Three.js and RoomEnvironment are vendored in `dist/vendor/`. Google Fonts provides the typography, with system-font fallbacks.

Deploy the contents of `dist/` to a static web host.

## Third-party notices

Three.js and RoomEnvironment are distributed under the MIT license. See [the vendored license](dist/vendor/THREE-LICENSE.txt).
