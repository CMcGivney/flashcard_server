const flashResolvers = require('./flashcards.js');
const usersResolvers = require('./users.js')

module.exports = {
  Flashes: {
    likeCount: (parent) => parent.likes.length
  },
  Query: {
    ...flashResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...flashResolvers.Mutation,
  },
  Subscription: {
    ...flashResolvers.Subscription
  }
}