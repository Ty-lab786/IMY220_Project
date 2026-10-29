const router = require('express').Router();
const Albums = require('../models/albums');
const Posts = require('../models/posts');
const auth = require('../middleware/auth');
const { oid, asyncH, httpError, parseTags } = require('../utils');

router.use(auth);

router.get('/', asyncH(async (req, res) => {
    const filter = req.query.owner ? { owner: oid(req.query.owner) } : {};
    res.json(await Albums.list(filter));
}));

router.post('/', asyncH(async (req, res) => {
    const name = (req.body.name || '').trim();
    if (!name) throw httpError(400, 'Album name is required');
    const album = await Albums.create({
        owner: oid(req.userId),
        name,
        description: (req.body.description || '').trim(),
        hashtags: parseTags(req.body.hashtags),
    });
    res.status(201).json(album);
}));

router.get('/:id', asyncH(async (req, res) => {
    const album = await Albums.get(req.params.id);
    if (!album) throw httpError(404, 'Album not found');
    const posts = album.posts.length ? await Posts.list({ _id: { $in: album.posts } }) : [];
    res.json({ ...album, posts });
}));

const requireOwner = async (req) => {
    const album = await Albums.get(req.params.id);
    if (!album) throw httpError(404, 'Album not found');
    if (album.owner.toString() !== req.userId && req.role !== 'admin') throw httpError(403, 'Not allowed');
    return album;
};

router.put('/:id', asyncH(async (req, res) => {
    await requireOwner(req);
    const fields = {};
    if (req.body.name !== undefined) {
        if (!req.body.name.trim()) throw httpError(400, 'Album name cannot be empty');
        fields.name = req.body.name.trim();
    }
    if (req.body.description !== undefined) fields.description = req.body.description.trim();
    if (req.body.hashtags !== undefined) fields.hashtags = parseTags(req.body.hashtags);
    res.json(await Albums.update(req.params.id, fields));
}));

router.delete('/:id', asyncH(async (req, res) => {
    await requireOwner(req);
    await Albums.remove(req.params.id);
    res.json({ message: 'Album deleted' });
}));

router.post('/:id/posts/:postId', asyncH(async (req, res) => {
    await requireOwner(req);
    if (!(await Posts.getRaw(req.params.postId))) throw httpError(404, 'Post not found');
    await Albums.addPost(req.params.id, req.params.postId);
    res.json({ message: 'Post added to album' });
}));

router.delete('/:id/posts/:postId', asyncH(async (req, res) => {
    await requireOwner(req);
    await Albums.removePost(req.params.id, req.params.postId);
    res.json({ message: 'Post removed from album' });
}));

module.exports = router;