const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { categorieSchema } = require("./categorie");

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  categorie: {
    type: categorieSchema,
    required: true,
  },
  ingredients: {
    type: mongoose.SchemaTypes.Mixed,
    required: true,
  },
  serving: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
  },
  content: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000,
  },
  remarks: {
    type: String,
    default: "",
    minlength: 0,
    maxlength: 500,
  },
  liked: {
    type: Boolean,
    default: false,
    required: true,
  },
  postDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Recipe = mongoose.model("Recipe", recipeSchema);

function validateRecipe(recipe) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(20).required(),
    categorieId: Joi.objectId().required(),
    ingredients: Joi.object().min(1).max(100).required(),
    serving: Joi.number().min(1).max(100).required(),
    content: Joi.string().min(10).max(1000).required(),
    remarks: Joi.string().min(0).max(500),
    liked: Joi.boolean(),
  });

  return schema.validate(recipe);
}

exports.Recipe = Recipe;
exports.validate = validateRecipe;
