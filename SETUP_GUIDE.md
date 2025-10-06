# Quick Start Guide - Authentication Setup

## 🚀 Getting Started

### 1. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Update the `.env` file with your backend API URL:
```env
VITE_API_BASE_URL=https://your-backend-api.com/api/
VITE_GOOGLE_CLIENT_ID=758570961714-gbt9gun7g7dm1kfbm5b8oe8ujl9ti5te.apps.googleusercontent.com
```

### 2. Install Dependencies

If not already installed:
```bash
pnpm install
```

### 3. Backend Requirements

Your backend must have these endpoints:

#### POST `/login`
```json
Request: { "UserEmail": "user@email.com", "Password": "pass123" }
Response: {
  "Status": 0,
  "Message": "Successful!",
  "Data": {
    "Token": "jwt-token-here",
    "UserName": "John Doe",
    "RoleName": "User"
  }
}
```

#### POST `/google-login?idToken={token}`
```json
Response: Same as /login
```

#### POST `/register` (multipart/form-data)
```
FormData fields:
- UserName
- UserEmail
- UserPassword
- UserPhNo
- UserProfileFile (optional)
- RoleName: "User"
- Latitude
- Longitude
- DeviceToken

Response: Same as /login
```

### 4. JWT Token Claims

Your backend JWT must include:
```csharp
new Claim(ClaimTypes.NameIdentifier, userId)
new Claim(ClaimTypes.Role, roleName)
new Claim(ClaimTypes.Name, userName)
```

### 5. CORS Configuration

Enable CORS for your frontend domain:
```csharp
// In your backend Startup.cs or Program.cs
services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder => builder
            .WithOrigins("http://localhost:5173", "https://yourdomain.com")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});
```

### 6. Run the Application

```bash
pnpm dev
```

Navigate to `http://localhost:5173/login`

## 🧪 Testing

### Test Login
1. Go to `/login`
2. Switch to Login tab
3. Enter credentials
4. Click "Login"

### Test Google Login
1. Click "Sign in with Google"
2. Select Google account
3. Authorize the app

### Test Signup
1. Switch to Sign Up tab
2. Fill all required fields
3. Optionally upload a profile picture
4. Click "Sign Up"
5. Allow location access when prompted

## 📱 Features

✅ **Login Tab**
- Email/password authentication
- Google Sign-In integration
- Error handling
- Loading states

✅ **Sign Up Tab**
- User registration form
- Profile picture upload
- Auto-capture location
- Auto-generate device token
- Password confirmation

✅ **UI/UX**
- HeroSection animated background
- Responsive design
- Smooth tab transitions
- Loading indicators
- Error messages

✅ **Security**
- JWT token management
- Token expiration checking
- Secure storage
- Role-based routing

## 🔧 Customization

### Change Google Client ID
Update in `src/modules/auth/LoginView.tsx`:
```typescript
client_id: 'YOUR_GOOGLE_CLIENT_ID'
```

### Modify Role Redirects
Update in `src/hooks/UseAuth.tsx`:
```typescript
if (userData.role === "admin") navigate("/admin");
else if (userData.role === "delivery") navigate("/delivery");
else navigate("/user");
```

### Add More Form Fields
Add to `signupData` state in `LoginView.tsx` and update the form.

## 🐛 Troubleshooting

### API Errors
- Check axios baseURL in `src/configs/axios.ts`
- Verify backend is running
- Check network tab in DevTools

### Google Sign-In Issues
- Ensure script is loaded (check console)
- Verify client ID in Google Console
- Check domain authorization

### Location Permission Denied
- App will use default values (0, 0)
- Enable location in browser settings
- Must use HTTPS (or localhost)

## 📚 Documentation

See `AUTH_UPDATE_DOCUMENTATION.md` for complete details.

## 🎯 Next Steps

1. Connect to your backend API
2. Test all authentication flows
3. Add forgot password feature
4. Implement token refresh
5. Add form validation library (Zod/Yup)
6. Add unit tests

---

**Need Help?** Check the full documentation or contact the development team.
