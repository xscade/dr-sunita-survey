import { MongoClient } from 'mongodb';

// Use environment variable if available, otherwise fall back to hardcoded URI
const uri = process.env.MONGODB_URI || "mongodb+srv://xscade_db_user:ydoxfNns9mOifLcM@survey.adnsnd7.mongodb.net/?appName=survey";

if (!uri) {
  throw new Error('Please add your Mongo URI to the environment variables or code');
}

const options: any = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

