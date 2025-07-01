import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const payload = {
    username: body.username,
    email: body.email,
    first_name: body.first_name,
    last_name: body.last_name,
    password: body.password,
    password_confirm: body.password_confirm
  };

  try {
    const apiRes = await fetch('https://turnover-api-hd7ze.ondigitalocean.app/api/auth/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return NextResponse.json({ error: data }, { status: apiRes.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reach external registration API' }, { status: 500 });
  }
}