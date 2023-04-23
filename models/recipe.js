const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String
  },
  //array of ingredients required for the recipe
  ingredients: {
    type: [String]
  },
  //cooking/preparation instructions
  instructions: {
    type: String,
  },
  calories: {
    type: Number
  }
});
  //exprt model
  module.exports = mongoose.model("Recipe", recipeSchema);
