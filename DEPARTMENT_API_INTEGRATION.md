# Department Management API Integration

This document explains how to use the Department Management API integration in your Next.js/React project.

## Files Created

1. **`app/api/departmentsApi.ts`** - Core API utility functions
2. **`hooks/useDepartments.ts`** - React hooks for state management
3. **`components/DepartmentsManager.tsx`** - Complete UI component
4. **`examples/departmentApiUsage.tsx`** - Usage examples

## API Functions

### Core API Functions (`app/api/departmentsApi.ts`)

```typescript
// List all departments (paginated)
const departments = await getDepartments(page?, pageSize?);

// Get specific department
const department = await getDepartmentById(id);

// Create new department (Admin only)
const newDept = await createDepartment({ name, description });

// Update department (Admin only)
const updatedDept = await updateDepartment(id, { name, description });

// Delete department (Admin only)
await deleteDepartment(id);

// Get department employees
const employees = await getDepartmentEmployees(id);
```

### Authentication

The API functions automatically use the token from `localStorage.getItem('authToken')`. Make sure your login process stores the token there:

```typescript
// After successful login
localStorage.setItem('authToken', userToken);
```

## React Hooks

### `useDepartments()` Hook

```typescript
import { useDepartments } from '@/hooks/useDepartments';

function MyComponent() {
  const {
    departments, // Array of departments
    loading, // Loading state
    error, // Error message
    pagination, // Pagination info
    fetchDepartments, // Fetch specific page
    refreshDepartments, // Refresh current page
    createNewDepartment, // Create department
    updateExistingDepartment, // Update department
    deleteExistingDepartment, // Delete department
    clearError, // Clear error state
  } = useDepartments();

  // Auto-loads departments on mount
  // Use the functions to perform CRUD operations
}
```

### `useDepartment(id)` Hook

```typescript
import { useDepartment } from '@/hooks/useDepartments';

function DepartmentDetails({ departmentId }) {
  const {
    department, // Department details
    employees, // Department employees
    loading, // Loading department
    employeesLoading, // Loading employees
    error, // Error message
    fetchDepartment, // Refresh department
    fetchDepartmentEmployees, // Refresh employees
    clearError, // Clear errors
  } = useDepartment(departmentId);

  // Auto-loads when departmentId changes
}
```

## Usage Examples

### 1. Basic Department List

```typescript
import { useDepartments } from '@/hooks/useDepartments';

function DepartmentList() {
  const { departments, loading, error } = useDepartments();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {departments.map(dept => (
        <div key={dept.id}>
          <h3>{dept.name}</h3>
          <p>{dept.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### 2. Create Department Form

```typescript
import { useDepartments } from '@/hooks/useDepartments';

function CreateDepartment() {
  const { createNewDepartment, loading } = useDepartments();
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createNewDepartment(formData);
    if (result) {
      console.log('Department created:', result);
      setFormData({ name: '', description: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Department Name"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        required
      />
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Department'}
      </button>
    </form>
  );
}
```

### 3. Department with Employees

```typescript
import { useDepartment } from '@/hooks/useDepartments';

function DepartmentDetail({ departmentId }) {
  const { department, employees, loading, employeesLoading } = useDepartment(departmentId);

  if (loading) return <div>Loading department...</div>;

  return (
    <div>
      <h2>{department?.name}</h2>
      <p>{department?.description}</p>

      <h3>Employees</h3>
      {employeesLoading ? (
        <div>Loading employees...</div>
      ) : (
        <ul>
          {employees.map(emp => (
            <li key={emp.id}>
              {emp.first_name} {emp.last_name} - {emp.position}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### 4. Direct API Usage

```typescript
import { getDepartments, createDepartment } from '@/app/api/departmentsApi';

async function handleDirectAPI() {
  try {
    // Get departments
    const { results, count } = await getDepartments(1, 10);
    console.log(`Found ${count} departments:`, results);

    // Create department
    const newDept = await createDepartment({
      name: 'Marketing',
      description: 'Marketing and communications team',
    });
    console.log('Created:', newDept);
  } catch (error) {
    console.error('API Error:', error.message);

    // Handle specific errors
    if (error.status === 401) {
      console.log('Authentication required');
    } else if (error.status === 403) {
      console.log('Admin access required');
    }
  }
}
```

## Complete UI Component

Use the `DepartmentsManager` component for a full-featured department management interface:

```typescript
import DepartmentsManager from '@/components/DepartmentsManager';

function AdminDepartmentsPage() {
  return (
    <div>
      <h1>Department Management</h1>
      <DepartmentsManager />
    </div>
  );
}
```

This component includes:

- Department listing with search
- Create/Edit/Delete modals
- Employee viewing
- Pagination
- Error handling
- Loading states
- Responsive design

## TypeScript Types

```typescript
interface Department {
  id: number;
  name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
  employee_count?: number;
}

interface Employee {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  position?: string;
  hire_date?: string;
  department?: number;
  role?: string;
  status?: string;
}

interface DepartmentListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Department[];
}
```

## Error Handling

All API functions throw structured errors:

```typescript
interface ApiError {
  message: string;
  status: number;
  details?: any;
}

try {
  await createDepartment(data);
} catch (error: ApiError) {
  if (error.status === 401) {
    // Redirect to login
  } else if (error.status === 403) {
    // Show "Access denied" message
  } else {
    // Show generic error
    console.log(error.message);
  }
}
```

## Integration with Existing Code

To integrate with your existing departments page:

1. **Replace mock data** with real API calls
2. **Add the hooks** to your existing components
3. **Handle loading/error states** appropriately
4. **Ensure authentication** token is properly stored

Example integration:

```typescript
// In your existing admin/departments/page.tsx
import { useDepartments } from '@/hooks/useDepartments';

export default function DepartmentsPage() {
  // Replace static data with:
  const { departments, loading, error } = useDepartments();

  // Keep your existing UI, just use real data
  // Add error handling and loading states
}
```

This integration provides a complete, production-ready department management system with proper error handling, loading states, and TypeScript support.
