const { getDb } = require('../db');
const { oid } = require('../utils');

const col = () => getDb().collection('albums');

exports.create = async (data) => {
    const doc = { ...data, posts: [], createdAt: new Date() };
    const r = await col().insertOne(doc);
    return { ...doc, _id: r.insertedId };
};
exports.list = (filter = {}) =>
    col()
        .aggregate([
            { $match: filter },
            { $sort: { createdAt: -1 } },
            { $lookup: { from: 'users', localField: 'owner', foreignField: '_id', as: 'o' } },
            { $unwind: '$o' },
            { $addFields: { ownerName: '$o.username' } },
            { $project: { o: 0 } },
        ])
        .toArray();
exports.get = (id) => col().findOne({ _id: oid(id) });
exports.update = (id, fields) =>
    col().findOneAndUpdate({ _id: oid(id) }, { $set: fields }, { returnDocument: 'after' });
exports.addPost = (id, postId) =>
    col().updateOne({ _id: oid(id) }, { $addToSet: { posts: oid(postId) } });
exports.removePost = (id, postId) =>
    col().updateOne({ _id: oid(id) }, { $pull: { posts: oid(postId) } });
exports.remove = (id) => col().deleteOne({ _id: oid(id) });
exports.removeByOwner = (ownerId) => col().deleteMany({ owner: oid(ownerId) });