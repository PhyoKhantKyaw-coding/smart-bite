# Smart Bite - Project Information

## 1. Project Overview

**Project Name:** Smart Bite  
**Project Type:** Food Delivery Web Application  
**Description:** A comprehensive food delivery platform connecting customers, restaurants, and delivery partners with real-time tracking capabilities.

## 2. Technology Stack

| Category | Technology |
|----------|------------|
| Frontend | React 19, TypeScript, Vite |
| Styling | TailwindCSS 4, Shadcn/UI |
| State Management | Redux Toolkit, TanStack Query |
| Maps & Location | Leaflet, React-Leaflet |
| Real-time | Microsoft SignalR |
| Authentication | JWT, Google OAuth |
| Package Manager | pnpm |

## 3. User Roles

### 3.1 Customer (User)
- Browse restaurants and food items
- Add items to cart
- Place orders
- Track order status in real-time
- Apply vouchers/discounts
- View order history
- Manage profile

### 3.2 Delivery Partner
- View assigned delivery orders
- Accept/reject delivery requests
- Update delivery status
- Track delivery location
- View delivery history and earnings

### 3.3 Admin
- Dashboard with analytics and charts
- Manage food items (CRUD)
- Manage restaurants/stores
- Manage users (customers, delivery partners)
- Manage delivery assignments
- Order management and monitoring

## 4. Key Features

### Authentication
- Email/password login
- Google OAuth integration
- JWT token-based session management
- Role-based route protection

### Food & Restaurant Management
- Food listing with categories
- Restaurant/store management
- Food search and filtering
- Product detail views

### Order Management
- Cart functionality
- Order placement
- Order status tracking
- Order history

### Real-time Features
- Live order tracking
- Real-time delivery location updates
- SignalR-based notifications

### Maps & Location
- Interactive map for delivery tracking
- Location selection for delivery address
- Delivery partner location tracking

## 5. API Integration

The frontend connects to a backend API with these key endpoints:
- Authentication: `/login`, `/register`, `/google-login`
- Food: `/foods`, `/foods/{id}`
- Orders: `/orders`, `/orders/{id}`
- Stores: `/stores`, `/stores/{id}`
- Users: `/users`, `/users/{id}`
- Delivery: `/deliveries`

## 6. Project Structure

```
smart-bite/
├── src/
│   ├── api/              # API service modules
│   ├── components/       # Shared UI components
│   ├── configs/          # Configuration files
│   ├── hooks/            # Custom React hooks
│   ├── layouts/          # Layout components (Admin, User, Delivery)
│   ├── modules/          # Page views by feature
│   ├── router/           # React Router configuration
│   ├── services/         # SignalR service
│   ├── store/            # Redux store
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
├── package.json          # Dependencies
├── vite.config.ts        # Vite configuration
└── tsconfig.json         # TypeScript configuration
```

## 7. Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run linting
pnpm lint
```

## 8. Environment Variables

Create `.env` file:
- `VITE_API_BASE_URL` - Backend API base URL
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth Client ID