# Authentication API Integration

This document describes the integration of the new authentication APIs into the RetenSYNC application.

## New APIs Integrated

### 1. GET User Profile

- **URL**: `https://turnover-api-hd7ze.ondigitalocean.app/api/profile/`
- **Method**: GET
- **Headers**: `Authorization: Token <your-token>`
- **Response**: Returns complete user profile information including personal details, role, department, etc.

### 2. POST Logout

- **URL**: `https://turnover-api-hd7ze.ondigitalocean.app/api/logout/`
- **Method**: POST
- **Headers**: `Authorization: Token <your-token>`
- **Response**: Logs out the user and invalidates the token

## Implementation Details

### New Files Created

1. **`app/api/authApi.ts`** - Main authentication API service
2. **`app/api/authHelpers.ts`** - Helper functions for auth operations
3. **`components/AuthInitializer.tsx`** - Component to initialize auth on app startup

### Modified Files

1. **`components/layout-admin/header.tsx`** - Added user profile dropdown with refresh and logout
2. **`components/layout-user/header.tsx`** - Enhanced user menu with profile management
3. **`components/TokenManager.tsx`** - Added token validation functionality
4. **`app/layout.tsx`** - Added auth initializer
5. **`app/api/usersApi.ts`** - Updated to use new auth token system

### Key Features

- **Token Management**: Secure token storage and validation
- **User Profile Fetching**: Automatic profile data retrieval and caching
- **Logout Functionality**: Proper cleanup of user data and tokens
- **Profile Refresh**: Manual profile data refresh capability
- **Event-Driven Updates**: Components automatically update when user data changes

## Usage Examples

### Setting Up Authentication

```javascript
import { setAuthToken, fetchUserProfile } from '@/app/api/authApi';

// Set token and fetch user profile
setAuthToken('your-auth-token');
const userProfile = await fetchUserProfile();
```

### Logging Out

```javascript
import { logoutUser } from '@/app/api/authApi';

// Logout user and clear all data
await logoutUser();
```

### Checking Authentication Status

```javascript
import { isAuthenticated, getCurrentUser } from '@/app/api/authApi';

// Check if user is authenticated
const authenticated = isAuthenticated();

// Get current user data
const user = getCurrentUser();
```

## User Interface Changes

### Admin Header

- Enhanced user profile dropdown with:
  - User information display
  - Profile refresh button
  - Logout functionality
  - User details (department, role, status)

### User Header

- Similar enhancements to admin header
- Profile refresh capability
- Improved user information display

### Token Manager

- Added token validation
- Real-time feedback on token status
- Integration with profile API for validation

## Data Flow

1. **Authentication**: User provides token via TokenManager
2. **Validation**: Token is validated by calling the profile API
3. **Storage**: Valid token and user data are stored in localStorage
4. **Updates**: Components listen for user data changes
5. **Logout**: Token and user data are cleared from storage and server

## Error Handling

- Invalid tokens are rejected with appropriate error messages
- Network failures are handled gracefully
- Authentication errors trigger automatic logout
- User feedback is provided for all operations

## Security Considerations

- Tokens are stored securely in localStorage
- API calls include proper authorization headers
- Token validation ensures authenticity
- Logout properly clears all sensitive data

## Future Enhancements

- Token refresh functionality
- Session timeout handling
- Multi-factor authentication support
- Role-based access control improvements
