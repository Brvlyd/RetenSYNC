import { NextRequest, NextResponse } from 'next/server';
import {
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  departmentExists,
  isDepartmentNameTaken,
  getEmployeesByDepartment,
} from '@/lib/data/departments';

// Helper function to check authentication
function checkAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Token ')) {
    return false;
  }

  const token = authHeader.replace('Token ', '');
  // For demo purposes, accept any token that starts with 'demo-token-'
  return token.startsWith('demo-token-');
}

// GET /api/departments/[id] - Get department by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check authentication
  if (!checkAuth(request)) {
    return NextResponse.json(
      { message: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'Invalid department ID' },
        { status: 400 }
      );
    }

    const department = getDepartmentById(id);

    if (!department) {
      return NextResponse.json(
        { message: 'Department not found' },
        { status: 404 }
      );
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    return NextResponse.json(department);
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/departments/[id] - Update department
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check authentication
  if (!checkAuth(request)) {
    return NextResponse.json(
      { message: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'Invalid department ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, description } = body;

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { message: 'Name and description are required' },
        { status: 400 }
      );
    }

    // Check if department exists
    if (!departmentExists(id)) {
      return NextResponse.json(
        { message: 'Department not found' },
        { status: 404 }
      );
    }

    // Check if name conflicts with another department
    if (isDepartmentNameTaken(name, id)) {
      return NextResponse.json(
        { message: 'Department with this name already exists' },
        { status: 400 }
      );
    }

    // Update department
    const updatedDepartment = updateDepartment(id, { name, description });

    if (!updatedDepartment) {
      return NextResponse.json(
        { message: 'Failed to update department' },
        { status: 500 }
      );
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));

    return NextResponse.json(updatedDepartment);
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/departments/[id] - Delete department
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check authentication
  if (!checkAuth(request)) {
    return NextResponse.json(
      { message: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'Invalid department ID' },
        { status: 400 }
      );
    }

    // Check if department exists
    if (!departmentExists(id)) {
      return NextResponse.json(
        { message: 'Department not found' },
        { status: 404 }
      );
    }

    // Check if department has employees
    const departmentEmployees = getEmployeesByDepartment(id);
    if (departmentEmployees.length > 0) {
      return NextResponse.json(
        {
          message: `Cannot delete department with ${departmentEmployees.length} employees`,
        },
        { status: 400 }
      );
    }

    // Delete department
    const success = deleteDepartment(id);

    if (!success) {
      return NextResponse.json(
        { message: 'Failed to delete department' },
        { status: 500 }
      );
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
