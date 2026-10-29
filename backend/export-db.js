require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

(async () => {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db(process.env.DB_NAME || 'pictureme');
        const outDir = path.join(__dirname, '..', 'database');
        fs.mkdirSync(outDir, { recursive: true });

        for (const { name } of await db.listCollections().toArray()) {
            const docs = await db.collection(name).find().toArray();
            fs.writeFileSync(path.join(outDir, `${name}.json`), JSON.stringify(docs, null, 2));
            console.log(`Exported ${docs.length} docs from ${name}`);
        }
        console.log(`Done. Files are in ${outDir}`);
    } catch (err) {
        console.error('Export failed:', err.message);
    } finally {
        await client.close();
    }
})();