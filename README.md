# MrGeek Digital Marketing Agency — Website

**Florida's Real Estate SEO Specialists.** Static multi-page marketing site — HTML + CSS + JS, no frameworks, no build step.

> Design system: lime green `#B5CC2E` · charcoal `#333333` · off-white `#F7F8F4` · borders `#E8EAE3` · headings `Agency FB → Barlow Condensed` · body `Inter`.

## Pages (39)

| Section | URLs |
|---|---|
| Home | `/` |
| Services (7) | `/services/` + local-seo, google-business-profile, real-estate-website-seo, neighborhood-content, link-building-digital-pr, ai-search-optimization |
| Florida Markets (11) | `/florida-markets/` + miami, fort-lauderdale, west-palm-beach, naples, fort-myers, sarasota, tampa, st-petersburg, orlando, jacksonville |
| Case Studies (5) | `/case-studies/` + tampa-agent, naples-luxury-team, orlando-brokerage, miami-condo-specialist |
| Blog (7) | `/blog/` + 6 posts (tampa-agents-beat-zillow, snowbird-season-seo, naples-ai-search-checklist, orlando-gbp-map-pack, miami-condo-neighborhood-pages, hurricane-season-search-behavior) |
| Conversion | `/free-seo-audit.html` · `/contact.html` · `/thank-you.html` |
| Company | `/about.html` · `/pricing.html` |
| Legal/system | `/privacy-policy.html` · `/terms.html` · `/404.html` · `sitemap.xml` · `robots.txt` |

## Folder structure

```
index.html + root pages      home, about, pricing, audit, contact, legal, 404
/services/ /florida-markets/ /case-studies/ /blog/
/css/style.css               design system (source) — tokens, components
/css/services|markets|pages|blog.css   section styles
/css/*.min.css               minified builds (what pages reference)
/js/main.js                  source · /js/main.min.js what pages reference
/assets/logo|images|icons/   logos, optimized Florida imagery, SVG sprite
mrgeek-home-single-file.html offline design-review build (CSS/JS/images inlined)
mrgeek-website.zip           full-site export
```

## Placeholders to replace before launch

All marked with `<!-- PLACEHOLDER: ... -->` comments in the HTML.

- **Contact:** phone `+1 (305) 555-0187`, email `hello@mrgeekdigital.com`, address `100 SE 2nd St, Suite 2100, Miami, FL 33131`, hours
- **Domain:** `https://www.mrgeekdigital.com` (canonical/OG/schema/sitemap — search-replace when live)
- **Stats & results:** hero stats (120+ / 4.2x / 67), About counters, pricing figures ($997 / $1,997 / $3,497), all case-study names/numbers, review texts
- **Logos:** `assets/logo/*` are generated placeholders — swap with the real brand kit, keep filenames
- **Forms:** `action="https://formspree.io/your-form-id"` + `data-redirect` — point at a real form service (Formspree/Basin/Netlify). `main.min.js` redirects to `/thank-you.html` until connected; remove `data-redirect` when posting natively
- **Booking:** contact page "Book a Call" button → Calendly embed
- **Map:** contact page map placeholder → Google Maps iframe
- **Social:** footer/thank-you URLs (`facebook.com/mrgeekdigital` etc.)
- **Legal:** privacy/terms are drafts — legal review before launch
- **Analytics:** add GA4/Plausible snippet before `</head>`

## Fonts note

Headings use `font-family: 'Agency FB', 'Barlow Condensed', ...`. **Agency FB is a Microsoft font, not a webfont** — Windows visitors see it; everyone else sees Barlow Condensed (loaded from Google Fonts). To make the wordmark font universal, license **Agency FB** (or the metric-similar *Sackers Gothic*) as WOFF2, upload to `/assets/fonts/`, and add:

```css
@font-face { font-family: 'Agency FB'; src: url('/assets/fonts/agencyfb.woff2') format('woff2'); font-weight: 700; font-display: swap; }
```

## Deploy on Netlify (2 ways)

**A. Drag & drop (fastest — 1 minute):**
1. Extract `mrgeek-website.zip`
2. Go to **https://app.netlify.com/drop**
3. Drag the extracted folder onto the page → live URL (`something.netlify.app`)

**B. Connect GitHub (auto-deploy on every push):**
1. Netlify → **Add new site → Import an existing project → GitHub**
2. Repo: `mrtalhahabib/MrGeekDigital-Florida` · Branch: `arena/01a02883-mrgeekdigital-florida`
3. Build command: **(khali)** · Publish directory: **`.`** (sirf dot) → Deploy

**Already configured:** `netlify.toml` (publish dir, cache + security headers) · `_redirects` (`/audit`, `/freeaudit` short links + 301 aliases) · **Forms** (`data-netlify` + honeypot + `action="thank-you.html"` — submissions Netlify ke **Forms tab** mein, user ko thank-you page) · `404.html` automatic. Custom domain: Site settings → Domain management.

## Local preview & deploy

```
python3 -m http.server 8080     # → http://localhost:8080
```

Deploy: upload everything (except `.git/`, `mrgeek-website.zip`) to any static host — Netlify (drag-and-drop), Cloudflare Pages, Vercel, or classic cPanel. Then:

1. Search-replace `https://www.mrgeekdigital.com` if the domain differs
2. Point the form `action` at your form service
3. Submit `sitemap.xml` in Google Search Console
4. Add analytics + real NAP/logo/legal placeholders above

## SEO checklist (implemented)

Unique titles (50–60) + descriptions (140–160) on every page · one H1 each · canonical + OG + Twitter cards · JSON-LD: Organization/ProfessionalService (home), Service + BreadcrumbList (services), areaServed City (markets), Article + BlogPosting (blog), FAQPage (19 pages), Product/Offer (pricing) · semantic landmarks · alt text with Florida context · lazy loading + width/height on all imagery · sitemap 40 URLs · robots.txt · minified CSS/JS.

## Accessibility

Skip-to-content link · visible focus states · keyboard-operable menu/carousel/accordions (`<details>`) · ARIA labels on controls · text-green darkened to `#8FA51F` for contrast · charcoal text on green buttons · `prefers-reduced-motion` disables animations.
