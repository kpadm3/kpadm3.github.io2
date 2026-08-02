# V3 Build 03 — Random Hero Diagrams

Replace only:
- index.html
- assets/css/site.css
- assets/js/site.js

Included hero diagrams:
1. Stacked Layers
2. Funnel to Impact

Behaviour:
- One diagram is selected randomly on a new page load.
- The visitor can choose Stacked or Funnel.
- Shuffle selects another option.
- A manually selected option remains for the current browser tab.
- No static image assets are required.

Test:
1. Run `python -m http.server 8000`
2. Open `http://localhost:8000`
3. Hard refresh several times
4. Test Stacked, Funnel, and Shuffle
5. Check mobile layout before committing
