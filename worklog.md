---
Task ID: 1
Agent: Main
Task: Build SARPO clothing store matching Russian design mockups - fix black background to white

Work Log:
- Analyzed Russian design mockups (Главная страница, Все товары, Страница товара, Оформление заказа) using VLM
- Extracted key design requirements: cream/white background (#F9F7F5), burgundy header (#2D020C), beige nav (#EFE6E1), white product cards
- Copied product images and logo from sarpo_site_updated.zip to public/images/
- Updated globals.css: Changed background from dark/black to cream (#F9F7F5), updated all CSS variables for SARPO brand colors
- Updated layout.tsx: Changed metadata to SARPO branding, set lang="ru"
- Created /src/lib/sarpo-data.ts: Product data, hero slides, collections in Russian
- Created /src/lib/cart-store.ts: Zustand cart store with add/remove/update
- Built complete single-page app in page.tsx with:
  - Header (burgundy top bar + beige nav)
  - Footer (burgundy with Products/Company/Contact columns)
  - HomePage (hero carousel + recommended products)
  - CatalogPage (sidebar filters + product grid + search/sort)
  - ProductPage (image gallery + details + add to cart + recommended)
  - CartPage (cart items + checkout form + payment methods)
- Fixed product images: Processed all product images with Sharp to replace black backgrounds with white
- Fixed Zustand selector for cart count (useCartStore selector pattern)
- All pages verified via VLM analysis: backgrounds white/cream, images on white, correct colors

Stage Summary:
- Page background is now cream/white (#F9F7F5) instead of black
- Product images now show on white backgrounds (processed with Sharp)
- All 4 pages match Russian mockup design: Home, Catalog, Product, Cart
- SARPO brand colors correctly applied: burgundy (#2D020C), ruby (#680018), beige (#EFE6E1), cream (#F9F7F5)
- Cart functionality working with Zustand state management
- Responsive design implemented for mobile and desktop
