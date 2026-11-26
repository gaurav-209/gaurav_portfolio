import { MongoClient } from "mongodb";

// One MongoDB connection, reused across requests (and across hot reloads in dev). Server code only:
// it is imported by the sendMessage server action, never by a client component.
//
// Setup (server environment, e.g. .env.local or the host's env settings):
//   MONGODB_URI  required  connection string from MongoDB Atlas → Connect → Drivers
//   MONGODB_DB   optional  database name (default "portfolio")
//
// Returns null when MONGODB_URI isn't set, so callers can carry on without a database.
export function getDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  globalThis._mongoClient ??= new MongoClient(uri, { serverSelectionTimeoutMS: 5000 /* a down database delays the form by at most this */ }).connect();
  return globalThis._mongoClient.then((client) => client.db(process.env.MONGODB_DB || "portfolio"));
}
