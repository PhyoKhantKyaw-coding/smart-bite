# Smart Bite - Use Case Diagram

## Overview
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SMART BITE SYSTEM                                 │
│                        Food Delivery Platform                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Use Case Diagram

```
                        ┌──────────────┐
                        │   CUSTOMER   │
                        └──────┬───────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
         ▼                     ▼                     ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Browse Food   │  │   Place Order  │  │  Track Order   │
│  & Restaurants │  │    (Add Cart)  │  │ (Real-time)    │
└─────────────────┘  └─────────────────┘  └─────────────────┘
         │                     │                     │
         ▼                     ▼                     ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Search/Filter   │  │   Apply Voucher│  │ View Order      │
│    Items        │  │                 │  │   History       │
└─────────────────┘  └─────────────────┘  └─────────────────┘
         │                     │                     │
         ▼                     │                     ▼
┌─────────────────┐           │            ┌─────────────────┐
│  View Product   │           │            │  Manage Profile │
│    Details      │           │            └─────────────────┘
└─────────────────┘           │
         │                    │
         └────────────────────┼────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   FOOD APP       │
                    │   DATABASE       │
                    └────────┬─────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│    ADMIN        │  │  DELIVERY       │  │   RESTAURANT    │
│    MANAGER      │  │    PARTNER      │  │    (External)   │
└────────┬────────┘  └────────┬────────┘  └─────────────────┘
         │                     │
         │    ┌────────────────┴────────────────┐
         │    │                                  │
         ▼    ▼                                  ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Manage Foods   │  │  Accept Order   │  │  Accept Order   │
│  (CRUD)         │  │  Delivery       │  │  Preparation    │
└─────────────────┘  └─────────────────┘  └─────────────────┘
         │                     │                     │
         ▼                     ▼                     ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Manage Stores │  │  Update Status  │  │  Update Status  │
│                │  │  (Picked Up,    │  │  (Preparing,    │
│                │  │   Delivered)    │  │   Ready)        │
└─────────────────┘  └─────────────────┘  └─────────────────┘
         │                     │
         ▼                     ▼
┌─────────────────┐  ┌─────────────────┐
│  Manage Users  │  │  Track Location │
│  (All Roles)   │  │  (Real-time)    │
└─────────────────┘  └─────────────────┘
         │
         ▼
┌─────────────────┐
│  View Dashboard │
│  & Analytics   │
└─────────────────┘
```

## Actor Definitions

### 1. Customer (User)
**Primary Role:** Places orders and receives food deliveries

**Use Cases:**
- Browse restaurants and food items
- Search and filter food items
- View product details
- Add items to cart
- Apply vouchers/discounts
- Place orders
- Track order in real-time
- View order history
- Manage user profile

### 2. Admin
**Primary Role:** System management and oversight

**Use Cases:**
- Manage food items (Create, Read, Update, Delete)
- Manage restaurants/stores
- Manage all users (customers, delivery partners)
- View dashboard with analytics
- Monitor orders
- Manage delivery assignments

### 3. Delivery Partner
**Primary Role:** Fulfill food deliveries

**Use Cases:**
- View available delivery orders
- Accept/reject delivery requests
- Update delivery status (Picked Up, Delivered)
- Track own delivery location (real-time)
- View delivery history

## System Boundaries

```
┌────────────────────────────────────────────────────────────────────┐
│                         SMART BITE PLATFORM                        │
│                                                                    │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐        │
│  │   Frontend   │◄──►│   Backend    │◄──►│  Database    │        │
│  │   (React)    │    │   (API)      │    │              │        │
│  └──────────────┘    └──────────────┘    └──────────────┘        │
│         │                   │                                      │
│         ▼                   ▼                                      │
│  ┌──────────────┐    ┌──────────────┐                            │
│  │  SignalR     │    │  Google OAuth│                            │
│  │  (Real-time) │    │              │                            │
│  └──────────────┘    └──────────────┘                            │
│         │                                                          │
│         ▼                                                          │
│  ┌──────────────┐                                                  │
│  │  Leaflet     │                                                  │
│  │  (Maps)      │                                                  │
│  └──────────────┘                                                  │
└────────────────────────────────────────────────────────────────────┘
```

## Key Interactions

### 1. Order Placement Flow
```
Customer → Browse Food → Add to Cart → Place Order → Order Created
                                                          │
                                                          ▼
                                              Order Sent to Restaurant
                                              & Delivery Partner
```

### 2. Real-time Tracking Flow
```
Customer → Track Order → SignalR Connection → Real-time Updates
                                                      │
                                                      ▼
                                          Delivery Location Updated
                                          on Map (Leaflet)
```

### 3. Authentication Flow
```
User → Login/Register → Validate Credentials → JWT Token Issued
                                                   │
                                                   ▼
                                        Role-based Redirect
                                        (User/Admin/Delivery)
```