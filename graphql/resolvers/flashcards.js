const { AuthenticationError, UserInputError } = require("apollo-server");

const Flashes = require("../../models/FlashCard.js");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    async getFlashCards() {
      try {
        const flashcards = await Flashes.find().sort({ createdAt: -1 });
        return flashcards;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getFlash(_, { flashId }) {
      try {
        const Flash = await Flashes.findById(flashId);
        if (Flash) {
          return Flash;
        } else {
          throw new Error("Flashcard not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getUserFlashCards(_, { username }, context ) {
      const user = checkAuth(context)

      try { 
        const userFlash = await Flashes.find({username})
        if (username) {
          return userFlash
        } else {
          return "Sorry, you don't have any FlashCards.";
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getCardsByCategories() {
      try {
        const flashByCategory = await Flashes.find();
        if (flashByCategory) {
          return flashByCategory;
        } else {
          return "Sorry something went wrong";
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createFlash(
      _,
      { category, question, answer, hint1, hint2, hint3 },
      context
    ) {
      const user = checkAuth(context);

      if (
        category.trim() === "" ||
        question.trim() === "" ||
        answer.trim() === ""
      ) {
        throw new Error("Flashcard Question and answer must not be empty");
      }

      const newFlash = new Flashes({
        category,
        question,
        answer,
        hint1,
        hint2,
        hint3,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const flash = await newFlash.save();

      context.pubsub.publish("NEW_FLASH", {
        newFlash: flash,
      });

      return flash;
    },
    async deleteFlash(_, { flashId }, context) {
      const user = checkAuth(context);

      try {
        const flash = await Flashes.findById(flashId);
        if (user.username === flash.username) {
          await flash.delete();
          return "Flashcard deleted successfully";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async likeFlash(_, { flashId }, context) {
      const { username } = checkAuth(context);

      const flash = await Flashes.findById(flashId);
      if (flash) {
        if (flash.likes.find((like) => like.username === username)) {
          // flash already likes, unlike it
          flash.likes = flash.likes.filter(
            (like) => like.username !== username
          );
        } else {
          // Not liked, like flash
          flash.likes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }

        await flash.save();
        return flash;
      } else throw new UserInputError("flashcard not found");
    },
  },
  Subscription: {
    newFlash: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("NEW_FLASH"),
    },
  },
};
