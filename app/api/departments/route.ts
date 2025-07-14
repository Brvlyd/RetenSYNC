import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllDepartments, 
  createDepartment, 
  isDepartmentNameTaken 
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

// Helper function to create paginated response
function createPaginatedResponse(data: any[], page: number, pageSize: number) {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const results = data.slice(startIndex, endIndex);
  
  return {
    count: data.length,
    next: endIndex < data.length ? `page=${page + 1}` : null,
    previous: page > 1 ? `page=${page - 1}` : null,
    results
  };
}

// GET /api/departments - List all departments
export async function GET(request: NextRequest) {
  // Check authentication
  if (!checkAuth(request)) {
    return NextResponse.json(
      { message: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('page_size') || '10');

    // Get all departments
    const departments = getAllDepartments();

    // Create paginated response
    const response = createPaginatedResponse(departments, page, pageSize);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/departments - Create new department
export async function POST(request: NextRequest) {
  // Check authentication
  if (!checkAuth(request)) {
    return NextResponse.json(
      { message: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { name, description } = body;

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { message: 'Name and description are required' },
        { status: 400 }
      );
    }

    // Check if department name already exists
    if (isDepartmentNameTaken(name)) {
      return NextResponse.json(
        { message: 'Department with this name already exists' },
        { status: 400 }
      );
    }

    // Create new department
    const newDepartment = createDepartment({ name, description });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json(newDepartment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
