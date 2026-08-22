# MrGeek Digital Marketing Agency — Website

**Florida's Real Estate SEO Specialists.** Multi-page marketing site. This repository currently contains the **global design system + Home page** (Prompt 1). Services pages, Florida market/city pages, Case Studies, Pricing, About, Blog and Contact will be added on the same system in the next phases.

## Tech

- Static HTML + CSS + JS — no frameworks, no build step, no dependencies.
- Performance-first: system-friendly font fallbacks (`Agency FB` → Barlow Condensed), lazy-loaded images, inline SVG icons, CSS-only patterns.

## File structure

```
index.html              Home page (all 15 sections)
css/style.css           Global design system + home page styles (reusable across all future pages)
js/main.js              Nav, dropdowns, mobile menu, counters, reveal animations, FL map, carousel, form
assets/
  logo/                 Brand logos (horizontal, white, icons, badge, favicons)
  images/               Optimized photography (hero, case studies, reviews, blog)
  icons/                SVG icon sprite + standalone brand mark
robots.txt / sitemap.xml
```

## Design system (locked to brand)

| Token | Value |
|---|---|
| Primary accent (lime green) | `#B5CC2E` |
| Primary dark (charcoal) | `#333333` |
| Background light | `#F7F8F4` |
| White | `#FFFFFF` |
| Borders / dividers | `#E8EAE3` |
| Headings font stack | `'Agency FB', 'Barlow Condensed', 'Saira Condensed', sans-serif` |
| Body font | `Inter` (Google Fonts, 400/500/600) |

Reusable CSS components (prefix-light, ready for all future pages): `.container`, `.section` (+ `-light/-alt/-dark`, `.pattern-chevrons`, `.cut` angled edges), `.btn` variants, `.eyebrow` + `.section-head`, `.tag`, `.plan`, `.case-card`, `.step`, `.field` form controls, `.reveal` scroll animations, `.diag` angled dividers.

## Run locally

```
python3 -m http.server 8000
# → http://localhost:8000
```

(Or open `index.html` directly — everything works over `file://` too, fonts load from Google Fonts CDN.)

## Placeholders to replace before launch

- Phone `+1 (305) 555-0187`, address `100 SE 2nd St, Suite 2100, Miami, FL 33131`, email `hello@mrgeekdigital.com`
- Domain in canonical/OG/schema: `https://www.mrgeekdigital.com`
- Stats (120+ agents, 4.2x, 67 cities), case-study numbers, review names/texts, pricing figures — all client-supplied placeholders
- Logo files in `assets/logo/` are generated placeholders — swap with the real brand kit (keep the same filenames)
- Brokerage wordmarks in the trust strip are styled text placeholders

## SEO checklist (home)

- Meta title: `Florida Real Estate SEO Agency | MrGeek`
- Meta description, canonical, Open Graph + Twitter cards, `theme-color`
- Single `H1`, logical `H2` per section, semantic landmarks (`header/nav/main/section/footer`)
- `ProfessionalService` JSON-LD with Florida `areaServed`, NAP, opening hours (placeholder data)
- Descriptive `alt` text on every image, lazy loading below the fold, `width/height` set to prevent CLS
