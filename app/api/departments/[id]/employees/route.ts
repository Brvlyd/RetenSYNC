import { NextRequest, NextResponse } from 'next/server';
import {
  getEmployeesByDepartment,
  departmentExists,
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

// GET /api/departments/[id]/employees - Get employees by department
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
    const departmentId = parseInt(params.id);

    if (isNaN(departmentId)) {
      return NextResponse.json(
        { message: 'Invalid department ID' },
        { status: 400 }
      );
    }

    // Check if department exists
    if (!departmentExists(departmentId)) {
      return NextResponse.json(
        { message: 'Department not found' },
        { status: 404 }
      );
    }

    // Get employees for this department
    const departmentEmployees = getEmployeesByDepartment(departmentId);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json(departmentEmployees);
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
