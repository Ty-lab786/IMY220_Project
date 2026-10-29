const router = require('express').Router();
const Users = require('../models/users');
const Posts = require('../models/posts');
const Albums = require('../models/albums');
const Comments = require('../models/comments');
const auth = require('../middleware/auth');
const { oid, asyncH, httpError } = require('../utils');

router.use(auth);

// GET /api/users/me  -> logged-in user (with stats)
router.get('/me', asyncH(async (req, res) => {
  const me = await Users.findById(req.userId);
  if (!me) throw httpError(404, 'User not found');
  res.json(await Users.withStats(me));
}));

// GET /api/users?q=  -> search users
router.get('/', asyncH(async (req, res) => {
  res.json(await Users.search((req.query.q || '').trim()));
}));

// GET /api/users/suggestions -> people who are not me and not my friends
router.get('/suggestions', asyncH(async (req, res) => {
  const me = await Users.findById(req.userId);
  if (!me) throw httpError(404, 'User not found');
  const exclude = [me._id, ...(me.friends || [])];
  const all = await Users.search('');
  res.json(all.filter((u) => !exclude.some((id) => id.equals(u._id))).slice(0, 5));
}));

// GET /api/users/:id -> profile with stats
router.get('/:id', asyncH(async (req, res) => {
  const user = await Users.findById(req.params.id);
  if (!user) throw httpError(404, 'User not found');
  res.json(await Users.withStats(user));
}));

// GET /api/users/:id/friends
router.get('/:id/friends', asyncH(async (req, res) => {
  const user = await Users.findById(req.params.id);
  if (!user) throw httpError(404, 'User not found');
  res.json(await Users.findMany(user.friends || []));
}));

// PUT /api/users/:id -> edit own profile
router.put('/:id', asyncH(async (req, res) => {
  if (req.params.id !== req.userId && req.role !== 'admin') throw httpError(403, 'Not allowed to edit this profile');
  const fields = {};
  for (const k of ['name', 'bio', 'location', 'avatar']) {
    if (req.body[k] !== undefined) fields[k] = String(req.body[k]).trim();
  }
  if (req.body.username !== undefined) {
    const username = String(req.body.username).trim();
    if (!username) throw httpError(400, 'Username cannot be empty');
    fields.username = username;
  }
  if (!Object.keys(fields).length) throw httpError(400, 'Nothing to update');
  res.json(await Users.update(req.params.id, fields));
}));

// DELETE /api/users/:id -> delete account + everything they own
router.delete('/:id', asyncH(async (req, res) => {
  if (req.params.id !== req.userId && req.role !== 'admin') throw httpError(403, 'Not allowed to delete this user');
  oid(req.params.id);
  await Posts.removeByOwner(req.params.id);
  await Albums.removeByOwner(req.params.id);
  await Comments.removeByUser(req.params.id);
  await Users.remove(req.params.id);
  if (req.params.id === req.userId) res.clearCookie('token');
  res.json({ message: 'Account deleted successfully' });
}));

// ---- friends ----
router.post('/:id/request', asyncH(async (req, res) => {
  if (req.params.id === req.userId) throw httpError(400, 'You cannot friend yourself');
  if (!(await Users.findById(req.params.id))) throw httpError(404, 'User not found');
  await Users.sendRequest(req.userId, req.params.id);
  res.json({ message: 'Friend request sent' });
}));

router.post('/:id/accept', asyncH(async (req, res) => {
  await Users.acceptRequest(req.userId, req.params.id);
  res.json({ message: 'Friend request accepted' });
}));

router.post('/:id/decline', asyncH(async (req, res) => {
  await Users.declineRequest(req.userId, req.params.id);
  res.json({ message: 'Friend request declined' });
}));

router.delete('/:id/friend', asyncH(async (req, res) => {
  await Users.unfriend(req.userId, req.params.id);
  res.json({ message: 'Friend removed' });
}));

module.exports = router;