const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Posts = require('../models/posts');
const Users = require('../models/users');
const Comments = require('../models/comments');
const Reports = require('../models/reports');
const auth = require('../middleware/auth');
const { oid, asyncH, httpError, parseTags, escapeRx } = require('../utils');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
const upload = multer({
    storage: multer.diskStorage({
        destination: UPLOAD_DIR,
        filename: (req, file, cb) =>
            cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${path.extname(file.originalname).toLowerCase()}`),
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) =>
        file.mimetype.startsWith('image/') ? cb(null, true) : cb(httpError(400, 'Only image files are allowed')),
});

router.use(auth);

router.get('/', asyncH(async (req, res) => {
    const { feed = 'global', q, owner } = req.query;
    const filter = {};
    if (owner) filter.owner = oid(owner);
    if (feed === 'local') {
        const me = await Users.findById(req.userId);
        if (!me) throw httpError(401, 'User not found, please log in again');
        filter.owner = { $in: [me._id, ...me.friends] };
    }
    if (q) {
        const rx = new RegExp(escapeRx(q.replace(/^#/, '')), 'i');
        filter.$or = [{ description: rx }, { hashtags: rx }];
    }
    res.json(await Posts.list(filter));
}));

router.post('/', upload.single('image'), asyncH(async (req, res) => {
    if (!req.file) throw httpError(400, 'An image is required');
    const post = await Posts.create({
        owner: oid(req.userId),
        image: `/uploads/${req.file.filename}`,
        description: (req.body.description || '').trim(),
        hashtags: parseTags(req.body.hashtags),
    });
    res.status(201).json(await Posts.get(post._id.toString()));
}));

router.get('/:id', asyncH(async (req, res) => {
    const post = await Posts.get(req.params.id);
    if (!post) throw httpError(404, 'Post not found');
    await Posts.addView(req.params.id);
    res.json({ ...post, views: (post.views || 0) + 1 });
}));

const requireOwner = async (req) => {
    const post = await Posts.getRaw(req.params.id);
    if (!post) throw httpError(404, 'Post not found');
    if (post.owner.toString() !== req.userId && req.role !== 'admin') throw httpError(403, 'Not allowed');
    return post;
};

router.put('/:id', asyncH(async (req, res) => {
    await requireOwner(req);
    const fields = {};
    if (req.body.description !== undefined) fields.description = req.body.description.trim();
    if (req.body.hashtags !== undefined) fields.hashtags = parseTags(req.body.hashtags);
    await Posts.update(req.params.id, fields);
    res.json(await Posts.get(req.params.id));
}));

router.delete('/:id', asyncH(async (req, res) => {
    const post = await requireOwner(req);
    await Posts.remove(req.params.id);
    fs.unlink(path.join(UPLOAD_DIR, path.basename(post.image)), () => { }); // best effort
    res.json({ message: 'Post deleted' });
}));

router.post('/:id/like', asyncH(async (req, res) => {
    if (!(await Posts.getRaw(req.params.id))) throw httpError(404, 'Post not found');
    res.json({ liked: await Posts.toggleLike(req.params.id, req.userId) });
}));

router.get('/:id/comments', asyncH(async (req, res) =>
    res.json(await Comments.listForPost(req.params.id))));

router.post('/:id/comments', asyncH(async (req, res) => {
    const text = (req.body.text || '').trim();
    if (!text) throw httpError(400, 'Comment cannot be empty');
    if (!(await Posts.getRaw(req.params.id))) throw httpError(404, 'Post not found');
    res.status(201).json(await Comments.create(req.params.id, req.userId, text));
}));

router.delete('/:id/comments/:commentId', asyncH(async (req, res) => {
    const c = await Comments.get(req.params.commentId);
    if (!c) throw httpError(404, 'Comment not found');
    const post = await Posts.getRaw(req.params.id);
    const allowed = c.user.toString() === req.userId || post?.owner.toString() === req.userId || req.role === 'admin';
    if (!allowed) throw httpError(403, 'Not allowed');
    await Comments.remove(req.params.commentId);
    res.json({ message: 'Comment deleted' });
}));

router.get('/meta/report-reasons', asyncH(async (req, res) => res.json(await Reports.reasons())));

router.post('/:id/report', asyncH(async (req, res) => {
    const { reason } = req.body;
    if (!reason) throw httpError(400, 'A reason is required');
    if (!(await Posts.getRaw(req.params.id))) throw httpError(404, 'Post not found');
    if (await Reports.exists(req.params.id, req.userId)) throw httpError(409, 'You already reported this post');
    await Reports.create(req.params.id, req.userId, reason);
    res.status(201).json({ message: 'Post reported' });
}));

module.exports = router;