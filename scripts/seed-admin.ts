/**
 * Script to seed the database with admin credentials
 * Run with: npx tsx scripts/seed-admin.ts
 * Or: npm run seed
 */

import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://xscade_db_user:ydoxfNns9mOifLcM@survey.adnsnd7.mongodb.net/?appName=survey";

async function seedAdmin() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('dr_sunita_db');
    const admins = db.collection('admins');

    // Check if admin already exists
    const existingAdmin = await admins.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists:');
      console.log(`   Username: ${existingAdmin.username}`);
      console.log(`   Created: ${existingAdmin.createdAt}`);
      return;
    }

    // Create admin user
    const result = await admins.insertOne({ 
      username: 'admin', 
      password: 'password', 
      createdAt: new Date(),
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('   Username: admin');
    console.log('   Password: password');
    console.log(`\n   Admin ID: ${result.insertedId}`);
    
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n✅ Database connection closed');
  }
}

seedAdmin();

