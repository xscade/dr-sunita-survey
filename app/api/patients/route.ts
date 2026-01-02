import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    // Connect to MongoDB
    let client;
    try {
      client = await clientPromise;
    } catch (connectionError: any) {
      console.error("MongoDB Connection Error:", connectionError);
      return NextResponse.json(
        { error: 'Database connection failed', details: connectionError.message },
        { status: 500 }
      );
    }

    const db = client.db('dr_sunita_db');
    const collection = db.collection('patients');
    
    // Fetch ALL patients from database - no fallbacks, no defaults
    const patients = await collection.find({}).sort({ submittedAt: -1 }).toArray();
    
    console.log(`✅ Fetched ${patients.length} patients from database`);
    return NextResponse.json(patients);
  } catch (e: any) {
    console.error("Database Error:", e);
    console.error("Error details:", {
      message: e.message,
      stack: e.stack,
      name: e.name
    });
    return NextResponse.json(
      { error: 'Internal Server Error', details: e.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db('dr_sunita_db');
    const collection = db.collection('patients');
    
    // Check for duplicate submission (same name, mobile, reason within last 5 seconds)
    const fiveSecondsAgo = new Date(Date.now() - 5000);
    const duplicate = await collection.findOne({
      fullName: data.fullName,
      mobileNumber: data.mobileNumber,
      reason: data.reason,
      selectedCategory: data.selectedCategory,
      submittedAt: { $gte: fiveSecondsAgo }
    });

    if (duplicate) {
      console.log("Duplicate submission detected, skipping save");
      return NextResponse.json({ 
        success: true, 
        id: duplicate._id,
        duplicate: true 
      });
    }
    
    const doc = {
      ...data,
      submittedAt: new Date(),
      source: 'nextjs-dr-sunita-app',
      userAgent: request.headers.get('user-agent') || 'unknown'
    };

    const result = await collection.insertOne(doc);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (e: any) {
    console.error("Database Error:", e);
    return NextResponse.json(
      { error: 'Internal Server Error', details: e.message },
      { status: 500 }
    );
  }
}

