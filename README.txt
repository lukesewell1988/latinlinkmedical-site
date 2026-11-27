Latin Link - static site (no build step)

Deploy: upload this folder as-is to Cloudflare Pages or Netlify (publish directory = this folder, no build command).
Pages: index.html (home), privacy.html, 404.html. Assets in /assets. Brochure: /latin-link-brochure-2026.pdf
_headers sets security and cache headers on both hosts.

Quote form: by default builds a pre-filled email to projects@latinlink.com (no backend).
 - Netlify Forms: in index.html add data-netlify="true" netlify-honeypot="bot-field" to <form id="quote-form"> and set data-endpoint="/".
 - Formspree: set data-endpoint="https://formspree.io/f/YOUR_ID" on the form.
Then change the note under the button, which currently says it opens the email app.

v3 (21 Nov 2026): home + 4 service pages (clinical-trial-translation, regulatory-translation-latin-america,
medical-device-translation, medical-communications-translation). Pages are produced by
/workspace/latinlink/site_src/build.py (python3 build.py). v2 backup: /workspace/latinlink/site_v2/

v4 (21 Nov 2026): typography, latinlink.com copy, client logos, SEO and AI-assistant files
- Fonts: replaced in v5 (see below).
- Clean URLs: each service page is now /<slug>/index.html (e.g. /clinical-trial-translation/). _redirects maps the old .html URLs (Netlify and Cloudflare Pages).
  To preview locally with working folder links: cd site && python3 -m http.server 8000, then open http://localhost:8000/
- Client logos in assets/clients/ come from the logo wall on latinlink.com (see assets/clients/SOURCES.txt). Confirm permission before going live.
- SEO/AI: JSON-LD (Organization, ProfessionalService, WebSite, Service, FAQPage, BreadcrumbList), sitemap.xml with lastmod,
  robots.txt allowing search engines and AI crawlers, llms.txt and llms-full.txt (plain-text summaries).
- Source: site_src/build.py writes all pages plus sitemap.xml, robots.txt, llms.txt, llms-full.txt and _redirects.

v5 (21 Nov 2026): fonts switched to Jost, the typeface used on latinlink.com (Google Fonts, SIL OFL 1.1).
- Self-hosted: assets/fonts/jost-latin-ext.woff2 (variable, weights 300-700, latin + latin-ext, 32 KB). No Google requests.
- Style matched to latinlink.com: sentence-case headings at weight 500, 15px nav at 400, uppercase square buttons, navy #1E2C50.
- The Fraunces/Figtree version is backed up in ../site_v4_fraunces/ and site_src/backup_fraunces/.

v6 (26 Nov 2026): Insights / News section added, site finished for publish on latinlinkmedical.com.
- New pages: /insights/ (index + newsletter sign-up) and first article
  /insights/latam-clinical-trial-regulatory-translation-pitfalls/ on COFEPRIS, ANVISA and INVIMA
  clinical-trial and regulatory translation pitfalls.
- Newsletter form uses the same mailto pattern as the quote form (no backend, no trackers).
- Nav: Insights replaces FAQ in the top bar (FAQ remains on the home page and in the footer).
- SEO: article Open Graph tags, Blog / BlogPosting / BreadcrumbList JSON-LD, sitemap, llms.txt updates.
- Canonical output folder remains /workspace/latinlink/site/ (Jost, matching latinlink.com).
  site_v4_fraunces/ is a typography backup only. Rebuild with: python3 /workspace/latinlink/site_src/build.py
