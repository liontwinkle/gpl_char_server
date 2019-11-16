const defaultFieldsParseMap = {
  id: '_id',
};
const defaultParseKeys = key => defaultFieldsParseMap[key] || key;
// ? we're forced to exclude these fields, bcs mongoDB always returns them(e.g. _id field)
const defaultExcludeFields = ['_id'];

exports.getFields = (
  fields,
  {
    excludeFields = [],
    parseFields = defaultParseKeys,
    nestedFields,
    asArray = false,
  } = {}
) => {
  if (!(fields instanceof Object)) return asArray ? [] : '';

  const keys = Object.keys(fields);
  const excludeFieldsSet = new Set(excludeFields);
  let parsedFields = keys
    .map(parseFields)
    .filter(field => !excludeFieldsSet.has(field));

  if (nestedFields) {
    parsedFields = parsedFields.map(field => {
      const nestedFieldData = nestedFields[field];
      if (!nestedFieldData || !nestedFieldData.length) return field;
      return nestedFieldData
        .map(nestedField => `${field}.${nestedField}`)
        .join(' ');
    });
  }

  defaultExcludeFields.forEach(field => {
    if (!parsedFields.includes(field)) {
      parsedFields.push(`-${field}`);
    }
  });

  return asArray ? parsedFields : parsedFields.join(' ');
};
