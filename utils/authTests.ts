// Test file to verify authentication integration
import { 
  setAuthToken, 
  getAuthToken, 
  fetchUserProfile, 
  logoutUser, 
  isAuthenticated, 
  getCurrentUser, 
  refreshUserProfile, 
  initializeAuth 
} from '@/app/api/authApi';

// Test authentication flow
export const testAuthFlow = async () => {
  console.log('🧪 Starting Authentication Tests...');
  
  try {
    // Test 1: Check initial state
    console.log('Test 1: Initial state');
    console.log('- Is authenticated:', isAuthenticated());
    console.log('- Current user:', getCurrentUser());
    console.log('- Auth token:', getAuthToken());
    
    // Test 2: Set token and validate
    console.log('\nTest 2: Setting test token');
    const testToken = 'test-token-123';
    setAuthToken(testToken);
    console.log('- Token set successfully');
    console.log('- Is authenticated:', isAuthenticated());
    console.log('- Retrieved token:', getAuthToken());
    
    // Test 3: Try to fetch profile (will likely fail with test token)
    console.log('\nTest 3: Fetching user profile');
    try {
      const profile = await fetchUserProfile();
      console.log('- Profile fetched:', profile);
    } catch (error) {
      console.log('- Profile fetch failed (expected with test token):', error);
    }
    
    // Test 4: Test logout
    console.log('\nTest 4: Testing logout');
    await logoutUser();
    console.log('- Logout completed');
    console.log('- Is authenticated after logout:', isAuthenticated());
    console.log('- Current user after logout:', getCurrentUser());
    
    console.log('\n✅ Authentication tests completed');
    
  } catch (error) {
    console.error('❌ Authentication test failed:', error);
  }
};

// Test user data transformation
export const testUserDataTransformation = () => {
  console.log('🧪 Testing User Data Transformation...');
  
  const mockApiResponse = {
    success: true,
    message: 'Profile retrieved successfully',
    data: {
      id: 1,
      employee_id: 'EMP001',
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
      full_name: 'John Doe',
      phone_number: '+1234567890',
      date_of_birth: '1990-01-01',
      gender: 'M' as const,
      marital_status: 'single',
      education_level: 'bachelor',
      address: '123 Main St',
      position: 'Software Engineer',
      department: 1,
      department_name: 'IT',
      hire_date: '2024-01-01',
      role: 'employee',
      is_admin: false,
      is_manager: false,
      is_hr: false,
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      token: 'test-token-123'
    }
  };
  
  // Simulate the transformation that happens in fetchUserProfile
  const transformedUser = {
    id: mockApiResponse.data.id,
    name: mockApiResponse.data.full_name,
    email: mockApiResponse.data.email,
    employeeId: mockApiResponse.data.employee_id,
    position: mockApiResponse.data.position,
    department: mockApiResponse.data.department_name,
    phone: mockApiResponse.data.phone_number,
    role: mockApiResponse.data.role,
    isAdmin: mockApiResponse.data.is_admin,
    isManager: mockApiResponse.data.is_manager,
    isHr: mockApiResponse.data.is_hr,
    isActive: mockApiResponse.data.is_active,
    hireDate: mockApiResponse.data.hire_date,
    dateOfBirth: mockApiResponse.data.date_of_birth,
    gender: mockApiResponse.data.gender,
    maritalStatus: mockApiResponse.data.marital_status,
    educationLevel: mockApiResponse.data.education_level,
    address: mockApiResponse.data.address,
    createdAt: mockApiResponse.data.created_at
  };
  
  console.log('Original API response:', mockApiResponse);
  console.log('Transformed user data:', transformedUser);
  console.log('✅ User data transformation test completed');
};

// Test error handling
export const testErrorHandling = async () => {
  console.log('🧪 Testing Error Handling...');
  
  try {
    // Test with no token
    console.log('Test 1: No token scenario');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('api_token');
    
    try {
      await fetchUserProfile();
      console.log('❌ Should have thrown error for no token');
    } catch (error) {
      console.log('✅ Correctly threw error for no token:', error);
    }
    
    // Test with invalid token
    console.log('\nTest 2: Invalid token scenario');
    setAuthToken('invalid-token');
    
    try {
      await fetchUserProfile();
      console.log('❌ Should have thrown error for invalid token');
    } catch (error) {
      console.log('✅ Correctly threw error for invalid token:', error);
    }
    
    console.log('\n✅ Error handling tests completed');
    
  } catch (error) {
    console.error('❌ Error handling test failed:', error);
  }
};

// Run all tests
export const runAllTests = async () => {
  console.log('🚀 Running all authentication tests...\n');
  
  testUserDataTransformation();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await testErrorHandling();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await testAuthFlow();
  console.log('\n' + '='.repeat(50) + '\n');
  
  console.log('🎉 All tests completed!');
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).authTests = {
    testAuthFlow,
    testUserDataTransformation,
    testErrorHandling,
    runAllTests
  };
}
