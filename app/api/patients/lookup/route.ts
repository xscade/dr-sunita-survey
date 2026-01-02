import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { mobileNumber } = await request.json();
    
    if (!mobileNumber || typeof mobileNumber !== 'string') {
      return NextResponse.json(
        { error: 'Mobile number is required' },
        { status: 400 }
      );
    }

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
    
    // Search for patient by mobile number (normalize phone number for search)
    const normalizedPhone = mobileNumber.replace(/\D/g, '');
    
    // Find the most recent patient with this phone number
    const patient = await collection.findOne(
      { mobileNumber: normalizedPhone },
      { sort: { submittedAt: -1 } }
    );
    
    if (patient) {
      // Return patient name if found
      return NextResponse.json({
        found: true,
        fullName: patient.fullName,
        mobileNumber: patient.mobileNumber
      });
    } else {
      // Not found
      return NextResponse.json({
        found: false
      });
    }
  } catch (e: any) {
    console.error("Lookup Error:", e);
    return NextResponse.json(
      { error: 'Internal Server Error', details: e.message },
      { status: 500 }
    );
  }
}

