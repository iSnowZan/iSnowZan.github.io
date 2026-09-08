# 🖥️ Pujan Bose — Personal Portfolio

> A fast, minimal, fully hand-coded personal portfolio for a backend-focused engineer.  
> Live at **[isnowzan.github.io](https://isnowzan.github.io)**

---

## ✨ Features

- **Zero frameworks** — pure semantic HTML5, modern CSS3, and vanilla ES6+ JavaScript.
- **Interactive Career Experience Timeline** — scroll-driven vertical progress track, waypoint milestones, dynamic pop-in / pop-out card scaling with focus illumination, and quick-navigation milestone tabs.
- **Custom animated cursor** — precision dot + lagging trailing ring for fine-pointer desktop viewports; cleanly suppressed on touch devices, small screens (≤ 900px), and DevTools responsive emulation.
- **Animated grid canvas** — interactive dot grid background that reacts to mouse position with radial proximity highlighting.
- **Typing animation** — role titles cycle smoothly through a terminal-inspired typewriter effect.
- **Three-mode Theme Switcher** — Dark / Light / System preferences, persisted in `localStorage` with zero-flash pre-paint initialization.
- **Responsive Mobile Navigation** — compact header layout with Lucide menu toggle (`menu.svg` swapping to `✕` close icon) and animated backdrop-blur drawer.
- **3D card spotlight** — featured project card follows mouse position with realistic perspective tilt.
- **Shimmer sweep** — sleek hover effects across distributed system and backend project cards.
- **Skill cards** — mouse-tracked inner spotlight + dim-siblings effect across categorized technology stacks.
- **Scroll reveal** — smooth fade & slide-in entrance animations as sections enter the viewport.
- **"Hire Me" popup** — one-click email copy with visual feedback and direct contact actions.
- **Fully responsive** — tailored layout rules across `390px`, `680px`, and `900px` breakpoints for phones, tablets, and desktops.

---

## 🗂️ Project Structure

```
iSnowZan.github.io/
├── index.html          # Semantic markup — nav, hero, about, experience, skills, projects, contact, footer
├── style.css           # Design tokens, component styles, timeline, animations, responsive rules, themes
├── script.js           # Canvas grid, typing effect, theme switcher, timeline scroll, cursor, 3D cards
├── README.md           # Documentation & setup guide
├── .gitignore          # Ignored OS, IDE, secrets, and local files
└── icons/
    ├── menu.svg        # Lucide menu hamburger icon
    ├── cross.svg       # Lucide medical cross icon
    ├── favicons/       # All favicon & app icon files
    │   ├── favicon.svg           # SVG icon (modern browsers)
    │   ├── favicon.png           # 512×512 high-res raster icon
    │   ├── favicon-32x32.png     # Standard browser tab icon
    │   ├── favicon-192x192.png   # Android home screen / PWA icon
    │   └── apple-touch-icon.png  # iOS Safari home screen icon
    └── *.svg           # SVG icons used throughout the UI
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

No build step, no dependencies. Just open the file or serve with any static HTTP server:

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

The site is deployed via **GitHub Pages** directly from the repository.  
Any push to the production branch is live within seconds — no complex CI or build pipeline needed.

---

## 🛠️ Customisation

| What to change | Where |
|---|---|
| Name, bio, tech stack | `index.html` — Hero and About sections |
| Work Experience & Timeline | `index.html` — `#experience` section |
| Skills & Depth | `index.html` — `#skills` section |
| Featured & Production Projects | `index.html` — `#projects` section |
| Contact links | `index.html` — `#contact` section + `hire-email` span |
| Colours / typography | `style.css` — `:root` variables |
| Typing role titles | `script.js` — `ROLES` array near the top |
| Grid canvas style | `script.js` — `drawGrid()` function |

---

## 📄 License

This project is open source under the [MIT License](LICENSE).  
Feel free to fork and adapt it for your own portfolio — a credit or star is always appreciated! 🙏
