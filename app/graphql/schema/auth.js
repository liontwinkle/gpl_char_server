module.exports = `
  type Mutation {
    registerUser(user: RegisterUserInput!): UserWithToken!
    loginUser(credentials: Credentials!): UserWithToken!
  }

  type UserWithoutPassword {
    id: ID!
    name: String!
    email: String!
  }
  
  input RegisterUserInput {
    name: String!
    email: String!
    password: String!
  }
  
  type UserWithToken {
    user: UserWithoutPassword!
    token: String!
  }

  input Credentials {
    email: String!
    password: String!
  }
`;