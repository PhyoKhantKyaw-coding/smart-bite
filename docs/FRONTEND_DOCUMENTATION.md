# Smart Bite - Frontend Development Documentation

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 19 |
| **Language** | TypeScript 5.5 |
| **Build Tool** | Vite 5 + SWC |
| **Styling** | TailwindCSS 4 + PostCSS |
| **State Management** | Redux Toolkit + TanStack Query |
| **Routing** | React Router DOM 6 |
| **Real-time** | SignalR (@microsoft/signalr) |
| **HTTP Client** | Axios |
| **Maps** | Leaflet + react-leaflet |
| **Charts** | Chart.js + react-chartjs-2 |
| **i18n** | i18next + react-i18next |
| **Auth** | @react-oauth/google (Google OAuth) |
| **UI Library** | shadcn/ui (Radix primitives) |
| **Icons** | lucide-react + @radix-ui/react-icons |
| **Notifications** | sonner (toasts) |

---

## Project Structure

```
src/
├── api/                    # API service layers (typed request/response per domain)
│   ├── auth/
│   ├── dashboard/
│   ├── delivery/
│   ├── food/
│   ├── order/
│   ├── products/
│   ├── store/
│   ├── todos/
│   └── user/
├── assets/                 # Static assets (images, SVGs)
├── components/             # Shared/reusable components
│   ├── ui/                 # shadcn/ui primitives (19 components)
│   ├── ClickableMap.tsx
│   ├── DeliveryLocationTracker.tsx
│   ├── FoodCard.tsx
│   ├── Footer.tsx
│   ├── ImageUpload.tsx
│   ├── OrderTrackingMapDialog.tsx
│   ├── ProfileDialog.tsx
│   ├── Voucher.tsx
│   └── Wrapper.tsx
├── configs/                # App configuration
│   ├── axios.ts            # Axios instance with JWT interceptor
│   └── locale.ts           # i18next initialization
├── contexts/               # React contexts
│   └── DialogContext.tsx
├── hooks/                  # Custom React hooks
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── UseAuth.tsx         # Auth logic (JWT decode, login, logout, role redirect)
│   ├── useDeliveryLocation.tsx
│   └── mobile.tsx
├── layouts/                # Role-based layouts
│   ├── AdminLayout.tsx
│   ├── DefaultLayout.tsx
│   ├── DeliveryLayout.tsx
│   └── UserLayout.tsx
├── lib/                    # Utility functions & helpers
│   ├── deviceUtils.ts
│   ├── imageUtils.ts
│   ├── mockData.ts
│   ├── siteData.ts
│   └── utils.ts            # cn() utility (clsx + tailwind-merge)
├── locales/                # Internationalization
│   ├── en.json             # English
│   └── mm.json             # Burmese (Myanmar)
├── modules/                # Feature-based modules (pages + chunk components)
│   ├── admin/
│   │   ├── dashboard-v2/   # Admin dashboard with charts
│   │   ├── delivery-management/
│   │   ├── food-management/
│   │   ├── order-management/
│   │   ├── store-management/
│   │   └── user-management/
│   ├── auth/               # Login
│   ├── contact/
│   ├── delivery/           # Delivery partner dashboard
│   ├── home/               # Menu, cart, orders, product detail, vouchers
│   └── user/               # User profile & dashboard
├── router/
│   └── Router.tsx          # Role-based route definitions
├── services/
│   └── signalRService.ts   # SignalR singleton for real-time tracking
├── store/                  # Redux Toolkit store
│   ├── authSlice.ts
│   └── index.ts
├── types/
│   └── delivery.ts
├── App.tsx                 # Root component (GoogleOAuthProvider wrapper)
├── index.css               # TailwindCSS v4 imports + theme tokens
└── main.tsx                # Entry point (Redux Provider)
```

---

## Pages & Routes

| # | Route | Component | Layout | Role | Description |
|---|-------|-----------|--------|------|-------------|
| 1 | `/` | HomeView | UserLayout | Public | Landing / menu page |
| 2 | `/menu` | HomeView | UserLayout | Public | Menu browsing |
| 3 | `/about` | AboutView | UserLayout | Public | About page |
| 4 | `/contact` | ContactView | UserLayout | Public | Contact page |
| 5 | `/auth` | LoginView | UserLayout | Public | Login (Google OAuth) |
| 6 | `/user` | HomeView | UserLayout | User | User dashboard / menu |
| 7 | `/user/menu` | HomeView | UserLayout | User | Menu (authenticated) |
| 8 | `/user/about` | AboutView | UserLayout | User | About (authenticated) |
| 9 | `/user/contact` | ContactView | UserLayout | User | Contact (authenticated) |
| 10 | `/user/profile` | Profile | UserLayout | User | User profile |
| 11 | `/admin` | DashboardV2View | AdminLayout | Admin | Admin dashboard |
| 12 | `/admin/dashboard` | DashboardV2View | AdminLayout | Admin | Admin dashboard |
| 13 | `/admin/foods` | FoodManagementView | AdminLayout | Admin | Food CRUD |
| 14 | `/admin/orders` | OrderManagementView | AdminLayout | Admin | Order management |
| 15 | `/admin/stores` | StoreManagementView | AdminLayout | Admin | Store management |
| 16 | `/admin/deliveries` | DeliveryManagementView | AdminLayout | Admin | Delivery management |
| 17 | `/admin/users` | UserView | AdminLayout | Admin | User management |
| 18 | `/delivery` | DeliveryView | DeliveryLayout | Delivery | Delivery dashboard |
| 19 | `/delivery/dashboard` | DeliveryView | DeliveryLayout | Delivery | Delivery dashboard |

---

## Component Inventory

### UI Primitives (shadcn/ui - Radix-based)

| Component | Usage |
|-----------|-------|
| Avatar | User profile images |
| Badge | Status labels |
| Button | Actions |
| Card | Content containers |
| Dialog | Modals |
| DropdownMenu | Context menus |
| Input | Text inputs |
| Label | Form labels |
| RadioGroup | Option selection |
| Separator | Dividers |
| Sheet | Slide-over panels |
| Sidebar | Navigation sidebar |
| Skeleton | Loading states |
| Sonner | Toast notifications |
| Table | Data tables |
| Tabs | Tabbed interfaces |
| Textarea | Multi-line input |
| Tooltip | Hover tooltips |

### Shared Components

| Component | File | Purpose |
|-----------|------|---------|
| ClickableMap | `components/ClickableMap.tsx` | Interactive map for location selection |
| DeliveryLocationTracker | `components/DeliveryLocationTracker.tsx` | Real-time delivery partner tracking |
| FoodCard | `components/FoodCard.tsx` | Food item display card |
| Footer | `components/Footer.tsx` | Site footer |
| ImageUpload | `components/ImageUpload.tsx` | Image upload with preview |
| OrderTrackingMapDialog | `components/OrderTrackingMapDialog.tsx` | Map dialog for order tracking |
| ProfileDialog | `components/ProfileDialog.tsx` | User profile popup |
| Voucher | `components/Voucher.tsx` | Discount voucher display |
| Wrapper | `components/Wrapper.tsx` | Root wrapper (QueryClient + Toaster) |

### Feature Chunk Components

#### Home Module (`modules/home/chunks/`)
| Component | Purpose |
|-----------|---------|
| HeroSection | Landing hero banner |
| ProductDetailDialog | Food product details |
| AddOrderDialog | Add item to cart |
| CartDialog | Shopping cart |
| EditCartItemDialog | Edit cart item |
| FavoriteDialog | Favorites management |
| OrdersDialog | Order history |
| OrderTrackingDialog | Live order tracking |
| VoucherDialog | Voucher selection |
| MapSelectionDialog | Location selection on map |
| KPayQRDialog | KPay payment QR code |

#### Admin Dashboard (`modules/admin/dashboard-v2/chunks/`)
| Component | Purpose |
|-----------|---------|
| SalesOverview | Sales summary cards |
| RevenueChart | Revenue line chart |
| OrdersChart | Orders bar chart |
| CategoryChart | Category distribution pie chart |
| TopProducts | Top-selling products table |
| RecentActivity | Recent orders activity feed |

#### Admin Food Management (`modules/admin/food-management/chunks/`)
| Component | Purpose |
|-----------|---------|
| AddEditFoodDialog | Create / edit food item |
| FoodTable | Food items data table |

#### Admin Order Management (`modules/admin/order-management/chunks/`)
| Component | Purpose |
|-----------|---------|
| OrderDetailDialog | Order details modal |

#### Admin Store Management (`modules/admin/store-management/chunks/`)
| Component | Purpose |
|-----------|---------|
| AddEditStoreDialog | Create / edit store |
| AddEditTownDialog | Create / edit town |
| StoreDetailDialog | Store details modal |
| StoreMapDialog | Store location on map |
| StoreTable | Stores data table |

#### Admin Delivery Management (`modules/admin/delivery-management/chunks/`)
| Component | Purpose |
|-----------|---------|
| AddEditDeliveryDialog | Create / edit delivery partner |
| DeliveryMapView | Delivery locations on map |
| DeliveryPerformanceChart | Delivery performance metrics |
| DeliveryStatsCards | Delivery statistics |
| DeliveryTable | Delivery partners data table |

#### Admin User Management (`modules/admin/user-management/chunks/`)
| Component | Purpose |
|-----------|---------|
| AddEditUserDialog | Create / edit user |
| UserTable | Users data table |

#### Delivery Module (`modules/delivery/chunks/`)
| Component | Purpose |
|-----------|---------|
| OrdersForDelivery | Pending delivery orders |
| DeliveredOrders | Completed deliveries |
| OrderDetailDialog | Order details for delivery partner |

---

## Architecture Overview

### Auth Flow
1. User logs in via **Google OAuth** or email/password
2. Backend returns **JWT** with claims: `NameIdentifier` (userId), `Role` (`user`/`admin`/`delivery`), `Name`
3. JWT stored in **localStorage** (`authToken`); profile cached in **sessionStorage** (`userProfile`)
4. **Redux authSlice** manages current user state in memory
5. **ProtectedRoute** component checks JWT validity + role before rendering
6. **Axios interceptor** attaches `Authorization: Bearer <token>` header to all requests
7. On 401 response, user is redirected to login
8. Delivery users automatically start **SignalR location tracking** on login

### Data Flow
- **TanStack Query** handles server state (caching, refetching, mutations)
- **Redux Toolkit** manages client-only state (auth, UI state)
- API modules in `src/api/` provide typed functions per domain
- Each API module has a corresponding `types.d.ts` for request/response interfaces

### Real-time (SignalR)
- Singleton service in `src/services/signalRService.ts`
- Used for **delivery location tracking**
- Delivery partner's location broadcast to admin and customers in real-time

### Routing
- `createBrowserRouter` from React Router DOM v6
- Role-based protection via `ProtectedRoute` wrapper component
- `RedirectIfUserExists` component redirects authenticated users to role-specific dashboard
- Three layouts: `UserLayout`, `AdminLayout`, `DeliveryLayout`

### Styling
- **TailwindCSS v4** with CSS-based configuration (no JS config file)
- `@theme` directive for design tokens (colors, fonts, radius)
- **shadcn/ui** components with CSS variables for light/dark mode
- Fonts: **Poppins** (titles), **Inter** (body)
- `cn()` utility combining `clsx` + `tailwind-merge` for conditional classes

### i18n
- Two locales: **English** (`en.json`) and **Burmese/Myanmar** (`mm.json`)
- Initialized in `src/configs/locale.ts` via i18next

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL (e.g., `https://your-api.com/api/`) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID |

---

## Key Scripts

```bash
pnpm install    # Install dependencies
pnpm dev        # Start development server (http://localhost:5173)
pnpm build      # Production build
pnpm lint       # Run ESLint
```

---

## Build Configuration Notes

- **Path aliases**: `@/` maps to `./src/`
- **Polyfills**: `stream` → `stream-browserify`, `url` → `url-browserify`
- **Global shim**: `globalThis` defined for legacy dependencies
- **PostCSS**: Uses `@tailwindcss/postcss` (TailwindCSS v4 plugin)
- **Manual chunks**: Disabled in Rollup output
- **ESBuild**: `global` defined as `globalThis` for optimized deps

---

## Dependencies

### Production (44 packages)

| Package | Version |
|---------|---------|
| @microsoft/signalr | ^10.0.0 |
| @radix-ui/react-avatar | ^1.1.10 |
| @radix-ui/react-dialog | ^1.1.6 |
| @radix-ui/react-dropdown-menu | ^2.1.16 |
| @radix-ui/react-icons | ^1.3.0 |
| @radix-ui/react-separator | ^1.1.7 |
| @radix-ui/react-slot | ^1.1.0 |
| @radix-ui/react-tabs | ^1.1.13 |
| @radix-ui/react-tooltip | ^1.2.8 |
| @react-oauth/google | ^0.12.2 |
| @reduxjs/toolkit | ^2.9.0 |
| @tanstack/react-query | ^5.59.16 |
| @types/leaflet | ^1.9.21 |
| axios | ^1.7.7 |
| chart.js | ^4.5.1 |
| class-variance-authority | ^0.7.0 |
| clsx | ^2.1.1 |
| i18next | ^23.16.3 |
| leaflet | ^1.9.4 |
| lucide-react | ^0.452.0 |
| next-themes | ^0.4.6 |
| react | ^19.0.0 |
| react-chartjs-2 | ^5.3.1 |
| react-dom | ^19.0.0 |
| react-i18next | ^15.1.0 |
| react-leaflet | ^5.0.0 |
| react-redux | ^9.2.0 |
| react-router-dom | ^6.27.0 |
| sonner | ^2.0.3 |
| tailwind-merge | ^2.5.3 |
| tailwindcss-animate | ^1.0.7 |

### Dev (14 packages)

| Package | Version |
|---------|---------|
| @eslint/js | ^9.11.1 |
| @tailwindcss/postcss | ^4.0.9 |
| @types/node | ^22.7.5 |
| @types/react | ^19.0.0 |
| @types/react-dom | ^19.0.0 |
| @vitejs/plugin-react-swc | ^3.5.0 |
| eslint | ^9.11.1 |
| eslint-plugin-react-hooks | ^5.1.0-rc.0 |
| eslint-plugin-react-refresh | ^0.4.12 |
| globals | ^15.9.0 |
| postcss | ^8.4.47 |
| stream-browserify | ^3.0.0 |
| tailwindcss | ^4.0.9 |
| typescript | ^5.5.3 |
| typescript-eslint | ^8.7.0 |
| url-browserify | ^2.0.0 |
| vite | ^5.4.8 |
