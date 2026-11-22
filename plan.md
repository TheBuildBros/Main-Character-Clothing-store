# Main Character — implementation plan

## Product and architecture
Deliver a responsive apparel storefront built in the initialized React/Vite application. The approved scope is a self-contained commerce prototype: product data is seeded locally; search/filtering and product detail routes work in the browser; bag and appearance preferences persist in localStorage; account forms validate and show demo-only feedback; checkout is a clearly marked handoff because Shopify, payment processing, and account services were not configured. No live transaction or secure account is implied.

### Structure
- `client/src/App.tsx`: shared router, global providers, site-level notification layer.
- `client/src/store/Storefront.tsx`: product fixtures, persisted bag/theme state, common header/footer, collection filters and product/detail interactions.
- `client/src/pages/Home.tsx`: approved landing-page order—name-only hero over campaign image, New Arrivals, flagship details, collection entry points.
- `client/src/pages/Collections.tsx`: searchable collection catalog, filter panel/drawer (category, size, color, price), active-filter chips, count/empty state.
- `client/src/pages/Bag.tsx`: line-item quantity/remove controls, empty state, subtotal, checkout handoff feedback.
- `client/src/pages/Account.tsx`: separate sign-in/sign-up form with validation, loading/success/error and demo-auth disclosure.
- `client/src/pages/Product.tsx`: product detail, selectable size, unavailable-size handling, add-to-bag.
- `client/src/index.css`: design tokens, responsive layouts, dark theme, reduced-motion-aware motion and accessible focus styles.
- `public/manus-routes.json`: canonical route manifest for home, collections, bag, account, and product detail pattern.

## Design
**Design Movement:** contemporary fashion editorial crossed with precise Swiss modernism.

**Core Principles:** 1) fashion imagery leads and UI recedes; 2) product discovery is direct and legible; 3) cobalt blue provides focused energy against a pale cool-neutral canvas; 4) every action has a clear accessible response.

**Color Philosophy:** use the user's palette as supplied: Pure White `#FFFFFF`, Ice White `#F4F7FB`, Platinum `#E6E9EE`, Chrome Silver `#C9CED6`, Steel `#8A93A0`, Sky Glow `#4FA3FF`, Electric Blue `#1E6BFF`, Deep Blue `#0A3FCC`, Ink Black `#0B0F1A`. Light mode stays clean and cool; electric blue is reserved for actions, selected states and focus, with deep blue for pressed/hover. Dark mode reverses the canvas to ink and steel while keeping blue highlights vivid.

**Layout Paradigm:** full-bleed editorial hero; left-aligned section titles; horizontally scrollable mobile product rails and dense but breathable two-column mobile catalog; desktop expands into asymmetrical editorial blocks and wider product grids. Filters become a bottom sheet on narrow screens and a persistent rail on desktop.

**Signature Elements:** compact electric-blue tab/size indicators; steel hairline dividers; image cards with a small rounded quick-add trigger and subtle hover crop.

**Interaction Philosophy:** fast, tactile controls; filter changes update results in place; bag updates are immediate and persistent; no dead-end button or simulated production capability.

**Animation:** restrained 180–350ms ease-out transitions; image scale 1.025 on hover; fade/translate section entry only when reduced motion is not requested; animate bag count changes and drawer/modal entry; avoid scroll hijacking and avoid unnecessary motion on mobile.

**Typography System:** use a crisp system sans (Inter-like) for functional copy and a high-contrast editorial serif for display headings via `Georgia`; compact uppercase tracking for product metadata. Display title is heavy and tight, body text remains comfortably readable on mobile.

**Brand Essence:** considered streetwear for people who dress with intention; expressive, precise, self-possessed.

**Brand Voice:** short, assured, human. Examples: “Wear the point of view.” “New pieces. No second thoughts.”

**Wordmark & Logo:** typeset MAIN CHARACTER in bold uppercase with tight tracking and a fine electric-blue underline/marker; no generated text logo.

**Signature Brand Color:** Electric Blue `#1E6BFF`.

## Runtime and dependencies
Use the initialized web-db-user React/Vite starter in static mode: this scoped prototype needs no database/server since no production auth, commerce APIs, or private data are requested. Use existing `lucide-react` icons and browser APIs; do not add dependencies. Include campaign image resources through the returned project-managed storage URLs. Declare `pnpm dev:static` on port 3000 via Webdev runtime config; route manifest must be served from `public/manus-routes.json`.
