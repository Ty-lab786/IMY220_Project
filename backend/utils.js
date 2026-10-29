const { ObjectId } = require('mongodb');

const oid = (id) => {
  if (!ObjectId.isValid(id)) throw httpError(400, 'Invalid id');
  return new ObjectId(id);
};

const httpError = (status, message) => {
  const e = new Error(message);
  e.status = status;
  return e;
};

const asyncH = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const parseTags = (input) => {
  if (!input) return [];
  const arr = Array.isArray(input) ? input : String(input).split(/[\s,]+/);
  return [...new Set(arr.map((t) => t.replace(/^#/, '').trim().toLowerCase()).filter(Boolean))];
};

const escapeRx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = { oid, httpError, asyncH, parseTags, escapeRx };