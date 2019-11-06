const { gql } = require('apollo-server-express');

module.exports = gql`
  type Subscription {
    messageSent: MessageSentRes!
  }

  type Mutation {
    sendMessage(message: String!): Boolean
  }

  type MessageSentRes {
    message: String!
    id: String!
  }
`;
