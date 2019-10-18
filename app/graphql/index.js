const { buildSchema } = require('graphql');
const { mergeTypes } = require('merge-graphql-schemas');
const authSchema = require('./schema/auth');
const authResolver = require('./resolvers/auth');

const schemas = [
  `type Query {
    dummy: String
  }`,
  authSchema
];

const rootValue = {
  ...authResolver
};

const schema = buildSchema(mergeTypes(schemas));

module.exports = { schema, rootValue };
