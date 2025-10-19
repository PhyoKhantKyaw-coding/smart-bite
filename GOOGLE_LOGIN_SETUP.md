# Google Login Setup and Troubleshooting

## Changes Made

### 1. Frontend Updates

#### `src/modules/auth/LoginView.tsx`
- ✅ Added Google Sign-In initialization on component mount
- ✅ Improved error handling with detailed console logs
- ✅ Auto-retry logic if Google library not loaded immediately
- ✅ Proper callback handling for Google credentials

#### `src/api/auth/index.ts`
- ✅ Google login mutation correctly sends `idToken` as query parameter
- ✅ Endpoint: `POST /api/User/google-login?idToken={token}`

#### `index.html`
- ✅ Google Sign-In script already loaded: `<script src="https://accounts.google.com/gsi/client" async defer></script>`

### 2. Backend Requirements

Your C# backend method looks correct. Make sure:

```csharp
[HttpPost("google-login")]
public async Task<IActionResult> GoogleLogin([FromQuery] string idToken)
{
    var result = await _userService.GoogleLoginAsync(idToken);
    
    if (result == null)
        return Unauthorized(new ResponseDTO
        {
            Status = APIStatus.Failed,
            Message = "Invalid Google token",
            Data = null
        });

    return Ok(new ResponseDTO
    {
        Status = APIStatus.Successful,
        Message = Messages.LoginSuccessful,
        Data = result
    });
}
```

### 3. Required NuGet Package

Make sure you have this package installed:
```
Google.Apis.Auth (version 1.60.0 or later)
```

### 4. Google Cloud Console Setup

1. Go to https://console.cloud.google.com/
2. Select your project or create a new one
3. Enable "Google+ API" or "Google Identity Services"
4. Go to "Credentials" → "OAuth 2.0 Client IDs"
5. Make sure your Client ID is: `758570961714-gbt9gun7g7dm1kfbm5b8oe8ujl9ti5te.apps.googleusercontent.com`
6. Add authorized origins:
   - `http://localhost:5173` (for Vite dev server)
   - `http://localhost:3000` (if using different port)
   - Your production domain

7. Add authorized redirect URIs (if needed):
   - `http://localhost:5173/login`
   - Your production login page

## How It Works

1. When LoginView mounts, it initializes Google Sign-In with your Client ID
2. When user clicks "Sign in with Google", it triggers the One Tap prompt
3. User selects their Google account
4. Google returns a JWT token (idToken)
5. Frontend sends this token to: `POST /api/User/google-login?idToken={token}`
6. Backend validates the token with Google's servers
7. Backend checks if user exists, creates if needed
8. Backend returns JWT token for your app
9. Frontend stores token and logs user in

## Testing

1. Open browser console (F12)
2. Go to login page
3. Click "Sign in with Google"
4. Watch for these console logs:
   - Google Sign-In initialization
   - Token received from Google
   - API request to backend
   - Response from backend

## Common Issues

### Issue 1: "Google Sign-In is loading"
**Solution**: Wait 1-2 seconds and try again. The script loads asynchronously.

### Issue 2: 401 Unauthorized
**Causes**:
- Invalid Client ID in Google Console
- Token validation failing on backend
- Missing Google.Apis.Auth NuGet package

**Check**: Console logs will show the error details

### Issue 3: Popup Blocked
**Solution**: Make sure popups are enabled for localhost in browser settings

### Issue 4: CORS Error
**Solution**: Add CORS policy in your C# Startup/Program.cs:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// After app is built
app.UseCors("AllowAll");
```

## Debugging Steps

1. **Check if Google library loaded**:
   Open console and type: `google`
   Should show: `{accounts: {...}}`

2. **Check network tab**:
   - Should see POST request to `/api/User/google-login`
   - Check request payload has `idToken` parameter
   - Check response status and body

3. **Backend logs**:
   - Add logging in `GoogleLoginAsync` method
   - Log the email from payload
   - Log any exceptions

4. **Token inspection**:
   You can decode the JWT at https://jwt.io to see user details

## Success Indicators

✅ No errors in browser console
✅ Google One Tap prompt appears
✅ Network request shows 200 OK
✅ User is redirected to home page
✅ User info appears in header/navigation

## Contact

If issues persist, check:
1. Google Cloud Console credentials
2. Backend API logs
3. Browser console errors
4. Network tab for failed requests
