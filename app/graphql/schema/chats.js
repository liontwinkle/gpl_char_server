const { gql } = require('apollo-server-express');

module.exports = gql`
  type Subscription {
    messageSent: MessageSentRes!
    chatList: ChatListRes!
  }

  type Mutation {
    createChat(chatSettings: CreateChatInput!): ChatRes!
    deleteChat(chatId: String!): Boolean!
    sendMessage(data: SendMessageInput!): Boolean!
  }

  type Query {
    chats(chatId: String): ChatsQueryRes!
  }

  enum ChatActions {
    ADDED
    DELETED
  }

  union ChatsQueryRes = ChatsRes | ChatRes

  type ChatsRes {
    list: [ChatRes!]!
  }

  union ChatListRes = ChatListChatAdded | ChatListChatDeleted

  type ChatListChatAdded {
    type: ChatActions!
    chat: ChatRes!
  }

  type ChatListChatDeleted {
    type: ChatActions!
    chatId: String!
  }

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
    createdAt: String!
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
