const renameKeys = require('deep-rename-keys');

const renameFieldsMap = {
  _id: 'id',
};
const renameFieldsPredicate = key => renameFieldsMap[key] || key;

exports.renameFields = (
  obj,
  { stringify = true, predicate = renameFieldsPredicate } = {}
) => {
  // ? Stringify is required if obj has ObjectId field
  // ? Because ObjectId consists of object, not a string with id
  // ? Which will cause renameKeys to rename fields we don't want to rename
  if (stringify) {
    obj = JSON.parse(JSON.stringify(obj));
  }
  return renameKeys(obj, predicate);
};

exports.makeResponse = (obj, options) => {
  return exports.renameFields(obj, options);
};
