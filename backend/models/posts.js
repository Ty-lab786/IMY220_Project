const { getDb } = require('../db');
const { oid } = require('../utils');

const col = () => getDb().collection('posts');

const joinOwner = [
    { $lookup: { from: 'users', localField: 'owner', foreignField: '_id', as: 'o' } },
    { $unwind: '$o' },
    { $lookup: { from: 'comments', localField: '_id', foreignField: 'postId', as: 'c' } },
    {
        $lookup: {
            from: 'albums', localField: '_id', foreignField: 'posts', as: 'albums',
            pipeline: [{ $project: { name: 1 } }]
        }
    },
    {
        $addFields: {
            ownerName: '$o.username',
            ownerDisplay: { $ifNull: ['$o.name', '$o.username'] },
            ownerAvatar: '$o.avatar',
            commentCount: { $size: '$c' },
        }
    },
    { $project: { o: 0, c: 0 } },
];

exports.create = async (data) => {
    const doc = { ...data, likes: [], views: 0, createdAt: new Date() };
    const r = await col().insertOne(doc);
    return { ...doc, _id: r.insertedId };
};
exports.list = (filter = {}) =>
    col().aggregate([{ $match: filter }, { $sort: { createdAt: -1 } }, ...joinOwner]).toArray();
exports.get = async (id) => {
    const r = await col().aggregate([{ $match: { _id: oid(id) } }, ...joinOwner]).toArray();
    return r[0] || null;
};
exports.addView = (id) => col().updateOne({ _id: oid(id) }, { $inc: { views: 1 } });
exports.getRaw = (id) => col().findOne({ _id: oid(id) });
exports.update = (id, fields) =>
    col().findOneAndUpdate({ _id: oid(id) }, { $set: fields }, { returnDocument: 'after' });
exports.toggleLike = async (id, userId) => {
    const post = await col().findOne({ _id: oid(id) });
    const u = oid(userId);
    if (!Array.isArray(post.likes)) {
        // repair old data where likes was a number
        await col().updateOne({ _id: post._id }, { $set: { likes: [] } });
        post.likes = [];
    }
    const liked = post.likes.some((l) => String(l) === String(u));
    await col().updateOne({ _id: post._id }, liked ? { $pull: { likes: u } } : { $addToSet: { likes: u } });
    return !liked;
};
exports.remove = async (id) => {
    const _id = oid(id);
    const db = getDb();
    await db.collection('comments').deleteMany({ postId: _id });
    await db.collection('reports').deleteMany({ postId: _id });
    await db.collection('albums').updateMany({}, { $pull: { posts: _id } });
    return col().deleteOne({ _id });
};
exports.removeByOwner = async (ownerId) => {
    const posts = await col().find({ owner: oid(ownerId) }).toArray();
    for (const p of posts) await exports.remove(p._id.toString());
};