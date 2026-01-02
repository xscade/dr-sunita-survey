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

    // Connect to MongoDB with error handling
    let client;
    try {
      client = await clientPromise;
    } catch (connectionError: any) {
      console.error("MongoDB Connection Error:", connectionError);
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 500 }
      );
    }

    const db = client.db('dr_sunita_db');
    const admins = db.collection('admins');

    // Check if admin exists, if not create default for setup
    try {
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
    } catch (seedError: any) {
      console.error("Error seeding admin:", seedError);
      // Continue with authentication even if seeding fails
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
    // Log more details for debugging
    console.error("Error details:", {
      message: e.message,
      stack: e.stack,
      name: e.name
    });
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? e.message : undefined
      },
      { status: 500 }
    );
  }
}

