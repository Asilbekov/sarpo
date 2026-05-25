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
