const { getDb } = require('../db');
const { oid, escapeRx } = require('../utils');

const col = () => getDb().collection('users');
const SAFE = { projection: { password: 0 } };

exports.create = async (data) => {
    const r = await col().insertOne({
        ...data,
        role: 'user',
        bio: '',
        avatar: '',
        location: '',
        friends: [],
        requestsReceived: [],
        requestsSent: [],
        createdAt: new Date(),
    });
    return r.insertedId;
};
exports.findByEmail = (email) => col().findOne({ email });
exports.findByUsername = (username) => col().findOne({ username });
exports.findById = (id) => col().findOne({ _id: oid(id) }, SAFE);
exports.search = (q) => {
    const filter = q
        ? { $or: ['username', 'name', 'surname'].map((f) => ({ [f]: new RegExp(escapeRx(q), 'i') })) }
        : {};
    return col().find(filter, SAFE).limit(50).toArray();
};
exports.findMany = (ids) => col().find({ _id: { $in: ids } }, SAFE).toArray();
exports.update = (id, fields) =>
    col().findOneAndUpdate({ _id: oid(id) }, { $set: fields }, { returnDocument: 'after', ...SAFE });
exports.remove = async (id) => {
    const _id = oid(id);
    await col().updateMany({}, { $pull: { friends: _id, requestsReceived: _id, requestsSent: _id } });
    return col().deleteOne({ _id });
};

// ---- friends ----
exports.sendRequest = async (from, to) => {
    await col().updateOne({ _id: oid(to) }, { $addToSet: { requestsReceived: oid(from) } });
    await col().updateOne({ _id: oid(from) }, { $addToSet: { requestsSent: oid(to) } });
};
exports.acceptRequest = async (me, from) => {
    const a = oid(me), b = oid(from);
    await col().updateOne({ _id: a }, { $pull: { requestsReceived: b }, $addToSet: { friends: b } });
    await col().updateOne({ _id: b }, { $pull: { requestsSent: a }, $addToSet: { friends: a } });
};
exports.declineRequest = async (me, from) => {
    const a = oid(me), b = oid(from);
    await col().updateOne({ _id: a }, { $pull: { requestsReceived: b } });
    await col().updateOne({ _id: b }, { $pull: { requestsSent: a } });
};
exports.unfriend = async (me, other) => {
    const a = oid(me), b = oid(other);
    await col().updateOne({ _id: a }, { $pull: { friends: b } });
    await col().updateOne({ _id: b }, { $pull: { friends: a } });
};

exports.withStats = async (user) => {
    if (!user) return user;
    const db = getDb();
    return {
        ...user,
        stats: {
            posts: await db.collection('posts').countDocuments({ owner: user._id }),
            albums: await db.collection('albums').countDocuments({ owner: user._id }),
            friends: user.friends.length,
        },
    };
};