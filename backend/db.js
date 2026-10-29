const { MongoClient } = require('mongodb');

let db;

async function connect() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  // ONE database name for the whole app (auth, users, posts, albums, seed)
  db = client.db(process.env.DB_NAME || 'pictureme');
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('users').createIndex({ username: 1 }, { unique: true });
  console.log(`Connected to MongoDB (db: ${db.databaseName})`);
  return db;
}

const getDb = () => {
  if (!db) throw new Error('Database not connected');
  return db;
};

module.exports = { connect, getDb };