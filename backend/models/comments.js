const { getDb } = require('../db');
const { oid } = require('../utils');

const col = () => getDb().collection('comments');

exports.create = async (postId, userId, text) => {
    const doc = { postId: oid(postId), user: oid(userId), text, createdAt: new Date() };
    const r = await col().insertOne(doc);
    return { ...doc, _id: r.insertedId };
};
exports.listForPost = (postId) =>
    col()
        .aggregate([
            { $match: { postId: oid(postId) } },
            { $sort: { createdAt: 1 } },
            { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'u' } },
            { $unwind: '$u' },
            { $addFields: { username: '$u.username', avatar: '$u.avatar' } },
            { $project: { u: 0 } },
        ])
        .toArray();
exports.get = (id) => col().findOne({ _id: oid(id) });
exports.remove = (id) => col().deleteOne({ _id: oid(id) });
exports.removeByUser = (userId) => col().deleteMany({ user: oid(userId) });