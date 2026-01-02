import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { DEFAULT_REASONS, DEFAULT_SOURCES, ReasonCategory } from '@/types';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('dr_sunita_db');
    const collection = db.collection('form_options');
    
    const options = await collection.findOne({ key: 'global_options' });
    if (!options) {
      return NextResponse.json({
        reasons: DEFAULT_REASONS,
        sources: DEFAULT_SOURCES
      });
    }
    
    // Handle migration: if reasons is a flat array, convert to categorized format
    if (options.reasons && Array.isArray(options.reasons) && options.reasons.length > 0) {
      const firstItem = options.reasons[0];
      if (typeof firstItem === 'string') {
        // Old format - migrate to new format
        options.reasons = [{
          name: 'General',
          items: options.reasons
        }];
      }
    }
    
    // Remove the key field from response
    const { key, ...responseData } = options;
    return NextResponse.json(responseData);
  } catch (e: any) {
    console.error("Options API Error:", e);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { reasons, sources } = await request.json();
    
    // Validate reasons format
    if (!Array.isArray(reasons) || !Array.isArray(sources)) {
      return NextResponse.json(
        { error: 'Invalid format' },
        { status: 400 }
      );
    }

    // Validate that reasons is an array of categories
    const isValidReasons = reasons.every((cat: any) => 
      cat && typeof cat === 'object' && 
      typeof cat.name === 'string' && 
      Array.isArray(cat.items)
    );

    if (!isValidReasons) {
      return NextResponse.json(
        { error: 'Reasons must be an array of categories with name and items' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('dr_sunita_db');
    const collection = db.collection('form_options');

    await collection.updateOne(
      { key: 'global_options' },
      { $set: { key: 'global_options', reasons, sources, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Options API Error:", e);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

