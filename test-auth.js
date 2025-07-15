// Test script to verify authentication with real API
const testCredentials = {
  email: 'testuser@retensync.com',
  password: 'test123',
};

console.log('Testing authentication with real API...');

// Test the updated authApi
import('./app/api/authApi.js').then(async authApi => {
  try {
    console.log('Attempting login with test credentials...');
    const response = await authApi.loginUser(testCredentials);

    if (response.success) {
      console.log('✅ Login successful!');
      console.log('User data:', response.data?.user);
      console.log('Token:', response.data?.user?.token);
    } else {
      console.log('❌ Login failed:', response.message);
    }
  } catch (error) {
    console.error('❌ Login error:', error);
  }
});
