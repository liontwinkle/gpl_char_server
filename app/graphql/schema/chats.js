const { gql } = require('apollo-server-express');

module.exports = gql`
  type Subscription {
    messageSent: MessageSentRes!
    # chatsChanges: ChatChangesRes!
  }

  type Mutation {
    createChat(chatSettings: CreateChatInput!): ChatRes!
    deleteChat(chatId: String!): Boolean!
    sendMessage(data: SendMessageInput!): Boolean!
  }

  type Query {
    chats: ChatsRes!
  }

  # enum ChatActions {
  #   ADDED
  #   DELETED
  # }

  type ChatsRes {
    chats: [ChatRes!]!
  }

  # type ChatChangesRes {
  #   action: ChatActions!
  #   chat: ChatRes!
  # }

  type MessageSentRes {
    message: String!
    id: String!
  }

  input CreateChatInput {
    name: String!
  }

  type ChatRes {
    id: String!
    name: String!
    creator: ChatCreator!
    messages: [ChatMessage!]!
  }

  type ChatMessage {
    id: String!
    message: String!
    from: ChatMessageFrom!
  }

  type ChatMessageFrom {
    id: String!
    name: String!
  }

  type ChatCreator {
    id: String!
    name: String!
  }

  input SendMessageInput {
    message: String!
    chatId: String!
  }
`;
