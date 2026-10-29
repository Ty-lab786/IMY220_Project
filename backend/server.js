require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const { connect } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'PictureMe backend is running' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/albums', require('./routes/albums'));

app.use('/api', (req, res) => {
    res.status(404).json({ success: false, error: 'Route not found', message: 'Route not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    let status = err.status || 500;
    let message = status === 500 ? 'Server error' : err.message;
    if (err.code === 11000) { status = 409; message = 'Username or email already in use'; }
    if (err.code === 'LIMIT_FILE_SIZE') { status = 400; message = 'Image must be under 5MB'; }
    if (status === 500) console.error(err);
    res.status(status).json({ success: false, error: message, message });
});

connect()
    .then(() => app.listen(PORT, '0.0.0.0', () => console.log(`PictureMe backend listening on port ${PORT}`)))
    .catch((e) => {
        console.error('Failed to connect to MongoDB:', e.message);
        process.exit(1);
    });