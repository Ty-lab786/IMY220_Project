const { getDb } = require('../db');
const { oid } = require('../utils');

const col = () => getDb().collection('reports');

exports.create = async (postId, userId, reason) => {
  const doc = { postId: oid(postId), reporter: oid(userId), reason, createdAt: new Date() };
  const r = await col().insertOne(doc);
  return { ...doc, _id: r.insertedId };
};
exports.exists = (postId, userId) =>
  col().findOne({ postId: oid(postId), reporter: oid(userId) });
exports.reasons = () => getDb().collection('reportReasons').find().toArray();