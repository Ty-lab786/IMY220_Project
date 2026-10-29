// Run with: npm run seed   (WIPES and refills the database in DB_NAME)
require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const client = new MongoClient(process.env.MONGO_URI);

const img = (id) => `https://images.unsplash.com/${id}?w=800`;

async function seedDatabase() {
    try {
        await client.connect();
        // SAME database name as db.js
        const db = client.db(process.env.DB_NAME || 'pictureme');
        console.log(`Seeding database "${db.databaseName}"...`);

        for (const c of ['users', 'posts', 'albums', 'comments', 'reports', 'reportReasons']) {
            await db.collection(c).deleteMany({});
        }

        const password = await bcrypt.hash('test1234', 10);
        const base = { password, role: 'user', location: '', friends: [], requestsReceived: [], requestsSent: [] };
        const people = [
            ['marker_test', 'test@test.com', 'Marker Test', 'Official Marker Test Account', 'photo-1534528741775-53994a69daeb'],
            ['alex_gold', 'alex@example.com', 'Alex Gold', 'Photography enthusiast and visual storyteller.', 'photo-1507003211169-0a1dd7228f2d'],
            ['sophia_vibe', 'sophia@example.com', 'Sophia Vibe', 'Capturing urban architecture & dark aesthetics.', 'photo-1494790108377-be9c29b29330'],
            ['dev_chris', 'chris@example.com', 'Chris Dev', 'Fullstack developer & night owl.', 'photo-1500648767791-00dcc994a43e'],
            ['linda_art', 'linda@example.com', 'Linda Art', 'Digital artist focusing on gold highlights.', 'photo-1517841905240-472988babdf9'],
            ['marco_shoots', 'marco@example.com', 'Marco Shoots', 'Traveler & sunset chaser.', 'photo-1522075469751-3a6694fb2f61'],
        ];
        const usersData = people.map(([username, email, name, bio, av], i) => ({
            ...base, username, email, name, bio,
            avatar: `https://images.unsplash.com/${av}?w=150`,
            role: i === 0 ? 'admin' : 'user',
            createdAt: new Date(),
        }));
        const { insertedIds: u } = await db.collection('users').insertMany(usersData);

        // friendships (both directions) + one pending request
        await db.collection('users').updateOne({ _id: u[0] }, { $set: { friends: [u[1], u[2]], requestsReceived: [u[3]] } });
        await db.collection('users').updateOne({ _id: u[1] }, { $set: { friends: [u[0]] } });
        await db.collection('users').updateOne({ _id: u[2] }, { $set: { friends: [u[0]] } });
        await db.collection('users').updateOne({ _id: u[3] }, { $set: { requestsSent: [u[0]] } });

        const p = (owner, description, hashtags, image, minsAgo) => ({
            owner, description, hashtags, image, likes: [], views: 0,
            createdAt: new Date(Date.now() - minsAgo * 60000),
        });
        const postsData = [
            p(u[0], 'Golden sunset over the horizon.', ['gold', 'sunset'], img('photo-1507525428034-b723cf961d3e'), 10),
            p(u[1], 'Exploring modern architecture with metallic highlights.', ['architecture'], img('photo-1513694203232-719a280e022f'), 60),
            p(u[2], 'City lights reflecting on rainy asphalt.', ['streetphotography', 'night'], img('photo-1509198397868-475647b2a1e5'), 120),
            p(u[3], 'Dark mode setup with custom ambient lighting.', ['ambient', 'setup'], img('photo-1518770660439-4636190af475'), 240),
            p(u[4], 'Nature showcasing its own metallic gold shades.', ['gold', 'autumn'], img('photo-1507272931001-fc06c17e4f43'), 600),
            p(u[5], 'Close-up of gold craftsmanship.', ['luxury', 'style'], img('photo-1523275335684-37898b6baf30'), 1200),
            p(u[1], 'Calm ocean waves meeting the shore.', ['coastal'], img('photo-1507525428034-b723cf961d3e'), 2000),
            p(u[2], 'Late night creative sessions.', ['vibes', 'night'], img('photo-1541701494587-cb58502866ab'), 3000),
        ];
        const { insertedIds: ps } = await db.collection('posts').insertMany(postsData);

        await db.collection('albums').insertMany([
            { owner: u[0], name: 'Marker Test Showcase', description: 'Test album for marking.', hashtags: ['test'], posts: [ps[0]], createdAt: new Date() },
            { owner: u[1], name: 'Golden Aesthetic', description: 'High-contrast black and gold.', hashtags: ['gold'], posts: [ps[1], ps[6]], createdAt: new Date() },
            { owner: u[2], name: 'Urban Chronicles', description: 'Late night street photography.', hashtags: ['street'], posts: [ps[2], ps[7]], createdAt: new Date() },
        ]);

        await db.collection('comments').insertMany([
            { postId: ps[0], user: u[1], text: 'This light is unreal!', createdAt: new Date() },
            { postId: ps[0], user: u[2], text: 'Great composition.', createdAt: new Date() },
            { postId: ps[1], user: u[0], text: 'Love the lines in this one.', createdAt: new Date() },
        ]);

        await db.collection('reportReasons').insertMany(
            ['Spam', 'Inappropriate content', 'Copyright violation', 'Harassment', 'Other'].map((label) => ({ label }))
        );

        console.log('Seeding complete. Log in with test@test.com / test1234');
    } catch (err) {
        console.error('Seeding error:', err);
    } finally {
        await client.close();
        process.exit(0);
    }
}

seedDatabase();