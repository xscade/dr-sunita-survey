import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Missing credentials' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('dr_sunita_db');
    const admins = db.collection('admins');

    // Check if admin exists, if not create default for setup
    const existingAdmin = await admins.findOne({ username: 'admin' });
    if (!existingAdmin) {
      await admins.insertOne({ 
        username: 'admin', 
        password: 'password', 
        createdAt: new Date(),
        role: 'admin'
      });
      console.log("✅ Seeded default admin user (username: admin, password: password)");
    }

    // Authenticate
    const user = await admins.findOne({ username });

    if (user && user.password === password) {
      return NextResponse.json({ success: true, token: 'session_valid' });
    } else {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
  } catch (e: any) {
    console.error("Auth Error:", e);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

