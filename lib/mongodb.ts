import { MongoClient, Db, Collection, Document } from "mongodb";

const FALLBACK_DIRECT_URI =
  "mongodb://Vercel-Admin-oplink:ZC8IPUizyriKw16C@ac-urij7wy-shard-00-00.brbms9d.mongodb.net:27017,ac-urij7wy-shard-00-01.brbms9d.mongodb.net:27017,ac-urij7wy-shard-00-02.brbms9d.mongodb.net:27017/oplink?ssl=true&replicaSet=atlas-pe3gsy-shard-0&authSource=admin&retryWrites=true&w=majority";

const URI = process.env.MONGODB_URI || FALLBACK_DIRECT_URI;
const DB_NAME = process.env.MONGODB_DB || "oplink";

const options = {
  serverSelectionTimeoutMS: 10000,
};

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Reset any prior failed srv client in dev memory
if (global._mongoClientPromise) {
  global._mongoClientPromise = undefined;
}

export function getClientPromise(): Promise<MongoClient> {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(URI, options);
    global._mongoClientPromise = client.connect();
  }
  return global._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(DB_NAME);
}

export async function getCollection<T extends Document = Document>(name: string): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(name);
}

export default getClientPromise;
