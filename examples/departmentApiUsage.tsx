// Example usage of Department API integration
// You can add this to your existing admin/departments/page.tsx

import { useDepartments } from '@/hooks/useDepartments';
import { getDepartments, createDepartment, getDepartmentEmployees } from '@/app/api/departmentsApi';

// Simple component showing how to integrate the API
export function DepartmentAPIExample() {
  const {
    departments,
    loading,
    error,
    createNewDepartment,
    deleteExistingDepartment,
    refreshDepartments
  } = useDepartments();

  const handleCreateDepartment = async () => {
    const newDept = await createNewDepartment({
      name: 'New Department',
      description: 'Department created via API'
    });
    
    if (newDept) {
      console.log('Created department:', newDept);
    }
  };

  const handleDeleteDepartment = async (id: number) => {
    const success = await deleteExistingDepartment(id);
    if (success) {
      console.log('Department deleted successfully');
    }
  };

  if (loading) return <div>Loading departments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Real API Departments</h2>
      <button onClick={handleCreateDepartment}>Create Test Department</button>
      <button onClick={refreshDepartments}>Refresh</button>
      
      <div>
        {departments.map(dept => (
          <div key={dept.id} className="border p-4 m-2">
            <h3>{dept.name}</h3>
            <p>{dept.description}</p>
            <button onClick={() => handleDeleteDepartment(dept.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Standalone function examples for direct API usage
export async function exampleDirectAPIUsage() {
  try {
    // 1. List all departments
    console.log('Fetching departments...');
    const departmentsList = await getDepartments(1, 10);
    console.log('Departments:', departmentsList);

    // 2. Create a new department
    console.log('Creating department...');
    const newDepartment = await createDepartment({
      name: 'Research & Development',
      description: 'Innovation and product research division'
    });
    console.log('Created department:', newDepartment);

    // 3. Get employees in department
    if (newDepartment) {
      console.log('Fetching department employees...');
      const employees = await getDepartmentEmployees(newDepartment.id);
      console.log('Department employees:', employees);
    }

  } catch (error) {
    console.error('API Error:', error);
  }
}
