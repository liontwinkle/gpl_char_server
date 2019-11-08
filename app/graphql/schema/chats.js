const { gql } = require('apollo-server-express');

module.exports = gql`
  type Subscription {
    messageSent: MessageSentRes!
  }

  type Mutation {
    sendMessage(message: String!): Boolean
    createChat(chatSettings: ChatInput!): ChatRes!
    deleteChat(chatId: String!): Boolean!
  }

  type MessageSentRes {
    message: String!
    id: String!
  }

  input ChatInput {
    name: String!
  }

  type ChatRes {
    id: String!
    name: String!
    creator: ChatCreator!
  }

  type ChatCreator {
    id: String!
    name: String!
  }
`;
