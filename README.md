# 🖥️ Pujan Bose — Personal Portfolio

> A fast, minimal, fully hand-coded personal portfolio for a backend-focused engineer.  
> Live at **[isnowzan.github.io](https://isnowzan.github.io)**

---

## ✨ Features

- **Zero frameworks** — pure HTML, CSS, and vanilla JavaScript
- **Custom animated cursor** — dot + lagging ring, hidden on touch devices
- **Animated grid canvas** — interactive dot grid background that reacts to mouse position
- **Typing animation** — role titles cycle through a typewriter effect
- **Theme switcher** — Dark / Light / System preference, persisted in `localStorage`
- **Hamburger menu** — smooth slide-down mobile nav drawer with ✕ animation
- **3D card spotlight** — featured project card follows mouse with perspective tilt
- **Shimmer sweep** — hover effect on regular project cards
- **Skill cards** — hover spotlight + dim-siblings effect for the skills grid
- **Scroll reveal** — sections fade + slide in as they enter the viewport
- **"Hire Me" popup** — one-click email copy with a clean popover
- **Fully responsive** — mobile-first tweaks at 600 px and 900 px breakpoints

---

## 🗂️ Project Structure

```
iSnowZan.github.io/
├── index.html          # All markup — nav, hero, about, skills, projects, contact, footer
├── style.css           # Design tokens, component styles, animations, responsive rules, themes
├── script.js           # Canvas grid, typing effect, theme switcher, cursor, scroll reveal, 3D cards
├── README.md           # This file
└── icons/
    ├── favicons/       # All favicon & app icon files
    │   ├── favicon.svg           # SVG icon (modern browsers)
    │   ├── favicon.png           # 512×512 high-res raster icon
    │   ├── favicon-32x32.png     # Standard browser tab icon
    │   ├── favicon-192x192.png   # Android home screen / PWA icon
    │   └── apple-touch-icon.png  # iOS Safari home screen icon
    └── *.svg           # Inline SVG icons used throughout the UI
```

---

## 🎨 Design Tokens

All colours and spacing live in CSS custom properties at the top of `style.css`, making them trivial to retheme:

```css
:root {
  --bg:        #080810;
  --surface:   #0e0e1c;
  --primary:   #00d4aa;   /* teal accent */
  --secondary: #7c6ff7;   /* violet */
  --accent:    #f472b6;   /* pink */
  --text:      #e2e8f0;
  --font:      'Inter', sans-serif;
  --mono:      'JetBrains Mono', monospace;
}
```

---

## 🚀 Running Locally

No build step, no dependencies. Just open the file:

```bash
# Option 1 — open directly in your browser
open index.html

# Option 2 — serve with any static server (recommended for accurate behaviour)
npx serve .
# or
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

---

## 🌐 Deployment

The site is deployed via **GitHub Pages** directly from the `main` branch.  
Any push to `main` is live within seconds — no CI, no build pipeline needed.

---

## 🛠️ Customisation

| What to change | Where |
|---|---|
| Name, bio, stack | `index.html` — Hero and About sections |
| Projects | `index.html` — `#projects` section |
| Skills | `index.html` — `#skills` section |
| Contact links | `index.html` — `#contact` section + `hire-email` span |
| Colours / fonts | `style.css` — `:root` variables |
| Typing role titles | `script.js` — `ROLES` array near the top |
| Grid canvas style | `script.js` — `drawGrid()` function |

---

## 📄 License

This project is open source under the [MIT License](LICENSE).  
Feel free to fork and adapt it for your own portfolio — a credit or star is always appreciated! 🙏
