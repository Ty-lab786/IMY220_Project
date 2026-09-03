

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'PictureMe backend is running' });
});


app.post('/api/auth/signup', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'username, email and password are required',
        });
    }

    const dummyUser = {
        id: 'user_' + Date.now(),
        username,
        email,
        profileImage: null,
        friends: [],
        posts: [],
        createdAt: new Date().toISOString(),
    };

    return res.status(201).json({
        success: true,
        message: 'Account created successfully (stubbed - not persisted)',
        user: dummyUser,
        token: 'dummy-jwt-token-' + Date.now(),
    });
});


app.post('/api/auth/signin', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'email and password are required',
        });
    }

    const dummyUser = {
        id: 'user_12345',
        username: 'Tauhir September',
        email,
        profileImage: null,
        bio: 'Photographer based in Cape Town.',
        friends: ['user_1', 'user_2', 'user_3'],
        posts: ['post_1', 'post_2', 'post_3'],
    };

    return res.status(200).json({
        success: true,
        message: 'Signed in successfully (stubbed)',
        user: dummyUser,
        token: 'dummy-jwt-token-' + Date.now(),
    });
});

app.listen(PORT, () => {
    console.log(`PictureMe backend listening on port ${PORT}`);
});