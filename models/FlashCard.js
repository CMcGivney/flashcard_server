const { model, Schema } = require("mongoose");

const flashcardSchema = new Schema({
  category: String,
  question: String,
  answer: String,
  hint1: String,
  hint2: String,
  hint3: String,
  username: String,
  createdAt: String,
  likes: [
    {
      username: String,
      createdAt: String,
    },
  ],
  user: 
    {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
});

module.exports = model("Flashcard", flashcardSchema);
