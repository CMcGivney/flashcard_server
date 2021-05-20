const { gql } = require("apollo-server");

module.exports = gql`
  type Flashes {
    id: ID!
    category: String!
    question: String!
    answer: String!
    hint1: String!
    hint2: String!
    hint3: String!
    likes: [Like]!
    likeCount: Int!
    createdAt: String!
    username: String!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }
  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Query {
    getFlashCards: [Flashes]
    getFlash(flashId: ID!): Flashes
    getUserFlashCards(username: String!): [Flashes]
    getCardsByCategories: [Flashes]
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createFlash(category: String!, question: String!, answer: String!, hint1: String!, hint2: String!, hint3: String!): Flashes!
    deleteFlash(flashId: ID!): String!
    likeFlash(flashId: ID!): Flashes!
  }
  type Subscription {
    newFlash: Flashes!
  }
`;
