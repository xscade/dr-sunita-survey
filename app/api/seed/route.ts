import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db('dr_sunita_db');
    const admins = db.collection('admins');

    // Check if admin already exists
    const existingAdmin = await admins.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      return NextResponse.json({ 
        message: 'Admin user already exists',
        username: 'admin'
      });
    }

    // Create admin user
    await admins.insertOne({ 
      username: 'admin', 
      password: 'password', 
      createdAt: new Date(),
      role: 'admin'
    });

    return NextResponse.json({ 
      success: true,
      message: 'Admin user created successfully',
      credentials: {
        username: 'admin',
        password: 'password'
      }
    });
  } catch (e: any) {
    console.error("Seed Error:", e);
    return NextResponse.json(
      { error: 'Internal Server Error', details: e.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('dr_sunita_db');
    const admins = db.collection('admins');

    const admin = await admins.findOne({ username: 'admin' });
    
    if (admin) {
      return NextResponse.json({ 
        exists: true,
        username: admin.username,
        createdAt: admin.createdAt
      });
    }

    return NextResponse.json({ 
      exists: false,
      message: 'Admin user does not exist. Call POST /api/seed to create it.'
    });
  } catch (e: any) {
    console.error("Seed Check Error:", e);
    return NextResponse.json(
      { error: 'Internal Server Error', details: e.message },
      { status: 500 }
    );
  }
}

