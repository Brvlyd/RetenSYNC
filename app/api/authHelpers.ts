// Example usage of the new auth API
import { setAuthToken, fetchUserProfile, logoutUser } from '@/app/api/authApi';

// Example: Login function (you would implement this in your login component)
export const handleLogin = async (token: string) => {
  try {
    // Set the token
    setAuthToken(token);
    
    // Fetch user profile to validate token and get user data
    const userProfile = await fetchUserProfile();
    
    console.log('Login successful:', userProfile);
    
    // User data is automatically stored in localStorage
    // and the userDataUpdated event is dispatched
    
    return userProfile;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Example: Logout function
export const handleLogout = async () => {
  try {
    await logoutUser();
    console.log('Logout successful');
    
    // User data is automatically cleared from localStorage
    // Redirect to login page would be handled by the calling component
    
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};

// Example: Check authentication status
export const checkAuthStatus = () => {
  const token = localStorage.getItem('auth_token');
  const user = localStorage.getItem('user');
  
  return {
    isAuthenticated: !!(token && user),
    user: user ? JSON.parse(user) : null,
    token: token
  };
};
