---
Task ID: 1
Agent: Main Agent
Task: Copy repo from GitHub, update order status to "оформлен", add cart sorting (price asc/desc, alphabet), controlled form fields, order API

Work Log:
- Reset local repo from GitHub remote (git fetch + git reset --hard origin/main)
- Fixed Prisma schema: changed provider from "postgresql" to "sqlite" to match .env DATABASE_URL
- Changed Order model status default from "pending" to "оформлен"
- Pushed Prisma schema to SQLite database successfully
- Created POST /api/orders API endpoint with Prisma create (status = "оформлен")
- Created GET /api/orders API endpoint to list all orders
- Updated CartPage with sorting dropdown (По алфавиту / От дорогого к дешёвому / От дешёвого к дорогому)
- Default sort is alphabetically by product name (localeCompare with 'ru')
- Made form fields controlled (customerName, phone, address states)
- Added form validation before order submission
- Added order API call on checkout with loading state
- Cart clears after successful order
- Empty cart state shows "Корзина пуста" and "Перейти в каталог →"
- Lint passes cleanly

Stage Summary:
- Order API working: POST creates order with status "оформлен", GET returns all orders
- Cart sorting working: 3 options (alphabetical, price desc, price asc)
- Form fields are now controlled and validated
- Successful order clears cart and shows toast with status

---
Task ID: 2
Agent: Main Agent
Task: Fix back button navigation — catalog→product→back was going to home instead of catalog, and catalog filter state was lost

Work Log:
- Diagnosed root cause: single `previousPage` state variable was being overwritten on each navigation, losing the full history. Also, `useCallback` with `[currentPage]` dependency caused stale closure issues.
- Replaced single `previousPage` with a proper navigation history stack (`useRef<HistoryEntry[]>`)
- Created `HistoryEntry` interface storing complete page state: page, selectedProduct, catalogSearch, catalogCollection, catalogFilterState
- Added `useRef` mirrors for all state values synced via `useEffect` to avoid stale closure issues in callbacks
- Replaced all navigation callbacks (`navigate`, `selectProduct`, `navigateToSearch`, `navigateToCollection`) to push current state to history before navigating
- Replaced `goBack` to pop from history stack and restore complete state
- Extended `CatalogFilterState` to track full filter state: search, selectedCollections, sortBy, priceMin, priceMax
- Modified `CatalogPage` to accept `initialState?: CatalogFilterState` instead of `initialSearch`/`initialCollection`
- Added `onFilterChange` callback to CatalogPage that reports filter changes to parent via useEffect
- When navigating back, full catalog filter state is restored from history entry
- Lint passes cleanly

Stage Summary:
- Back button now correctly returns to previous page (catalog→product→back→catalog, not catalog→product→back→home)
- Full navigation history is preserved (multi-step back supported)
- Catalog filter state (search, collection, sort, price) is fully preserved when navigating back
- Used refs to avoid stale closure issues that caused the original bug
