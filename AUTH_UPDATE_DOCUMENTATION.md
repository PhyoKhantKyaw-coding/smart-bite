# Smart Bite Authentication System - Update Documentation

## Overview
This document describes the comprehensive authentication system update for Smart Bite, including JWT token management, Google OAuth integration, and a modernized login/signup UI.

## Changes Summary

### 1. API Structure (`src/api/auth/`)

#### `type.d.ts` - Type Definitions
- **APIStatus Enum**: Success, Error, SystemError status codes
- **ResponseDTO**: Generic response wrapper with status, message, and data
- **LoginDTO**: Email and password credentials
- **AddUserDTO**: Complete user registration data including:
  - Basic info: UserName, UserEmail, UserPassword, UserPhNo
  - Profile: UserProfileFile (image upload)
  - OAuth: GoogleTokenId
  - Location: Latitude, Longitude (auto-captured)
  - Device: DeviceToken (auto-generated)
- **LoginResponseDTO**: JWT token with user info
- **DecodedToken**: Parsed JWT claims (userId, role, userName, exp)

#### `index.ts` - API Functions
Three main mutations using React Query:

1. **loginUser**: Standard email/password authentication
2. **googleLogin**: Google OAuth token validation
3. **registerUser**: New user signup with FormData support

### 2. Authentication Hook (`src/hooks/UseAuth.tsx`)

#### Key Features
- **JWT Token Management**: Stores and validates tokens
- **Token Decoding**: Extracts claims from JWT:
  - `nameidentifier` → userId
  - `role` → user role (admin/user/delivery)
  - `name` → userName
- **Auto-expiration**: Checks token validity on mount
- **Role-based Routing**: Redirects to appropriate dashboard

#### Functions
- `setAuthUser(token, userName, roleName)`: Process login response
- `logout()`: Clear session and redirect
- `isTokenValid()`: Check token expiration

### 3. Device Utilities (`src/lib/deviceUtils.ts`)

#### getUserLocation()
- Uses browser Geolocation API
- Returns `{ latitude, longitude }`
- Fallback to `{0, 0}` if permission denied

#### getDeviceToken()
- Generates unique device identifier
- Based on: userAgent, platform, language, timestamp
- Persists in localStorage
- 32-character alphanumeric token

### 4. Login View (`src/modules/auth/LoginView.tsx`)

#### UI Features
- **HeroSection Background**: Animated food delivery map
- **Two-Panel Layout**: 
  - Left: Brand messaging (desktop only)
  - Right: Auth forms
- **Tab System**: Switch between Login and Sign Up
- **Google Sign-In Button**: One-click OAuth

#### Login Tab
- Email and password fields
- Standard login button with loading state
- Google Sign-In button with brand icon
- Error handling and display

#### Sign Up Tab
- Full Name
- Email
- Phone Number
- Password
- Confirm Password
- Profile Picture (optional file upload)
- Auto-captures location and device token on submit
- Password match validation

#### Animations
- Falling food icons
- Delivery route visualization
- Smooth transitions between tabs

### 5. Google Sign-In Integration

#### Setup (index.html)
```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

#### Client Configuration
- Client ID: `758570961714-gbt9gun7g7dm1kfbm5b8oe8ujl9ti5te.apps.googleusercontent.com`
- Callback: Sends credential token to backend
- Uses Google Identity Services (GSI)

## API Endpoints Expected

### POST `/login`
**Request:**
```json
{
  "UserEmail": "user@example.com",
  "Password": "password123"
}
```

**Response:**
```json
{
  "Status": 0,
  "Message": "Successful!",
  "Data": {
    "Token": "eyJhbGc...",
    "UserName": "John Doe",
    "RoleName": "User"
  }
}
```

### POST `/google-login?idToken={token}`
**Response:** Same as `/login`

### POST `/register`
**Request:** FormData with:
- UserName
- UserEmail
- UserPassword
- UserPhNo
- UserProfileFile (file)
- RoleName: "User"
- Latitude
- Longitude
- DeviceToken

**Response:** Same as `/login` (returns token after registration)

## JWT Token Structure

The backend JWT should contain these claims:

```csharp
Subject = new ClaimsIdentity(new[]
{
    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
    new Claim(ClaimTypes.Role, roleName),
    new Claim(ClaimTypes.Name, user.UserName)
})
```

These map to:
- `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier`
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/role`
- `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name`

## Storage

### localStorage Items
- `authToken`: JWT token string
- `user`: Serialized user object
- `deviceToken`: Unique device identifier

## User Flow

### Login Flow
1. User enters credentials
2. POST to `/login`
3. Receive JWT token
4. Decode token and extract claims
5. Store token and user data
6. Redirect based on role

### Google Login Flow
1. User clicks "Sign in with Google"
2. Google OAuth popup opens
3. User authorizes
4. Receive Google ID token
5. POST to `/google-login`
6. Backend validates with Google
7. Receive JWT token
8. Same as steps 4-6 above

### Signup Flow
1. User fills registration form
2. Get user's location (with permission)
3. Generate device token
4. Create FormData with all fields
5. POST to `/register`
6. Receive JWT token
7. Auto-login with token

## Security Features

- Password confirmation validation
- JWT expiration checking
- Secure token storage
- Device fingerprinting
- Location-based services (with consent)

## Dependencies Required

Make sure these are in `package.json`:
```json
{
  "@tanstack/react-query": "^5.x",
  "axios": "^1.x",
  "react-router-dom": "^6.x",
  "lucide-react": "^0.x"
}
```

## Environment Variables

You may want to add:
```env
VITE_API_BASE_URL=https://your-api.com/api
VITE_GOOGLE_CLIENT_ID=758570961714-gbt9gun7g7dm1kfbm5b8oe8ujl9ti5te.apps.googleusercontent.com
```

## Backend Checklist

Ensure your backend has:
- [ ] `/login` endpoint accepting LoginDTO
- [ ] `/google-login` endpoint accepting idToken
- [ ] `/register` endpoint accepting FormData
- [ ] JWT token generation with proper claims
- [ ] Google token validation
- [ ] CORS configuration for frontend
- [ ] File upload handling for profile pictures

## Testing

### Test Accounts (if using mock)
Update or remove the old hardcoded accounts in UseAuth.tsx

### Testing Google Sign-In
1. Ensure HTTPS or localhost
2. Add test users in Google Cloud Console
3. Verify client ID is correct
4. Check browser console for errors

## Mobile Considerations

- Geolocation requires HTTPS (except localhost)
- Google Sign-In works on mobile browsers
- Form is responsive with Tailwind classes
- Touch-friendly button sizes

## Next Steps

1. **Configure Axios Base URL** in `src/configs/axios.ts`
2. **Test API Integration** with your backend
3. **Add Error Boundaries** for better error handling
4. **Implement Token Refresh** for long sessions
5. **Add "Forgot Password"** functionality
6. **Enhance Form Validation** with Zod/Yup
7. **Add Loading Skeletons** for better UX
8. **Implement Rate Limiting** on backend

## Troubleshooting

### Google Sign-In Not Working
- Check if script is loaded: `console.log(window.google)`
- Verify client ID matches Google Console
- Ensure domain is authorized in Google Console
- Check browser console for errors

### Location Not Captured
- Ensure HTTPS (required for geolocation)
- Check browser permissions
- Fallback values are `{0, 0}`

### Token Decode Fails
- Verify JWT format (header.payload.signature)
- Check claim names match backend
- Ensure token isn't expired

### API Errors
- Check network tab in DevTools
- Verify API base URL in axios config
- Check CORS headers
- Validate request/response formats

## File Structure
```
src/
├── api/
│   └── auth/
│       ├── index.ts          # API mutations
│       └── type.d.ts         # Type definitions
├── hooks/
│   └── UseAuth.tsx           # Auth hook with JWT
├── lib/
│   └── deviceUtils.ts        # Location & device utils
└── modules/
    └── auth/
        └── LoginView.tsx     # Login/Signup UI
```

## Screenshots

The new login view features:
- 🎨 Gradient background with animated food icons
- 📱 Responsive two-column layout
- 🔄 Tab switcher for Login/Signup
- 🎯 Google Sign-In button with brand icon
- ✨ Loading states and animations
- 🚨 Error message displays
- 📸 Profile picture upload
- 📍 Auto location capture

---

**Version:** 1.0.0  
**Last Updated:** October 6, 2025  
**Author:** Smart Bite Development Team
