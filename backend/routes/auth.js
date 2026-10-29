const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/users');
const { asyncH, httpError } = require('../utils');
const { JWT_SECRET } = require('../middleware/auth');

const COOKIE = { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 };

const sign = (user) =>
    jwt.sign({ id: user._id.toString(), username: user.username, role: user.role || 'user' }, JWT_SECRET, {
        expiresIn: '7d',
    });

const publicUser = (u) => ({
    _id: u._id,
    username: u.username,
    email: u.email,
    name: u.name || '',
    bio: u.bio || '',
    avatar: u.avatar || '',
    role: u.role || 'user',
});

// POST /api/auth/register
router.post('/register', asyncH(async (req, res) => {
    const username = (req.body.username || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';

    if (!username || !email || !password) throw httpError(400, 'Please fill in all fields');
    if (!/^\S+@\S+\.\S+$/.test(email)) throw httpError(400, 'Please enter a valid email');
    if (password.length < 6) throw httpError(400, 'Password must be at least 6 characters');
    if (await Users.findByEmail(email)) throw httpError(409, 'Email already registered');
    if (await Users.findByUsername(username)) throw httpError(409, 'Username already taken');

    const id = await Users.create({ username, email, name: username, password: await bcrypt.hash(password, 10) });
    const user = await Users.findById(id.toString());
    const token = sign(user);
    res.cookie('token', token, COOKIE);
    res.status(201).json({ token, user: publicUser(user) });
}));

// POST /api/auth/login
router.post('/login', asyncH(async (req, res) => {
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';
    if (!email || !password) throw httpError(400, 'Please enter email and password');

    const user = await Users.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) throw httpError(400, 'Invalid email or password');

    const token = sign(user);
    res.cookie('token', token, COOKIE);
    res.json({ token, user: publicUser(user) });
}));

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;