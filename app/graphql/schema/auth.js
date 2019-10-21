const { gql } = require('apollo-server-express');

module.exports = gql`
  type Query {
    loginUser(credentials: Credentials!): UserWithToken!
    verifyUser(token: String!): UserWithoutPasswordRes!
    updateUserToken(token: String!): TokenRes!
  }

  type Mutation {
    registerUser(user: RegisterUserInput!): UserWithToken!
  }

  type UserWithoutPassword {
    id: ID!
    name: String!
    email: String!
  }
    
  type UserWithToken {
    user: UserWithoutPassword!
    token: String!
  }

  type TokenRes {
    token: String
  }

  type UserWithoutPasswordRes {
    user: UserWithoutPassword!
  }

  input RegisterUserInput {
    name: String!
    email: String!
    password: String!
  }

  input Credentials {
    email: String!
    password: String!
  }
`;