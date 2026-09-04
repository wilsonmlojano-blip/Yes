# Image optimization for the Yes site

This repository contains a simple Node.js script that generates optimized image variants (JPEG, WebP, AVIF) at multiple widths. Use it to produce the files referenced in index.html's srcset attributes.

How to use

1. Add your original images to `assets/originals/` with names matching those used in the HTML (e.g. `hero.jpg`, `photo1.jpg`, `photo2.jpg`, `photo3.jpg`).

2. Install dependencies and run the optimizer locally:

```bash
npm install
npm run optimize-images
```

3. The script writes files to `assets/optimized/` like `photo1-400.webp`, `photo1-800.jpg`, `hero-1200.avif`, etc. Commit those optimized files to the repo (or serve them from a CDN).

Notes

- The script uses sharp — it runs locally (Linux/macOS/Windows) but requires a native dependency. If you want a CI-based approach, we can add a GitHub Action to build and commit optimized images automatically (requires a repository token with permissions).
- Quality and sizes can be tweaked in `scripts/optimize-images.js`.
