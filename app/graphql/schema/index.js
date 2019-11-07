const { mergeTypes } = require('merge-graphql-schemas');
const authSchema = require('./auth');
const chatsSchema = require('./chats');

module.exports = mergeTypes([authSchema, chatsSchema]);
