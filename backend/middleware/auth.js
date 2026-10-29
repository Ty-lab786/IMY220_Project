const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-secret';

module.exports = function auth(req, res, next) {
  const header = req.header('Authorization') || '';
  const token = req.cookies?.token || (header.startsWith('Bearer ') ? header.slice(7) : null);

  if (!token || token === 'null') {
    return res.status(401).json({ message: 'Not logged in' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    // the routes use these two:
    req.userId = String(decoded.id);
    req.role = decoded.role || 'user';
    next();
  } catch {
    res.status(401).json({ message: 'Session expired, please log in again' });
  }
};

module.exports.JWT_SECRET = JWT_SECRET;