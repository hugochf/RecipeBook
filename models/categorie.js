const mongoose = require("mongoose");
const Joi = require("joi");

const categorieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
});

const Categorie = mongoose.model("Categorie", categorieSchema);

function validateCategorie(catergorie) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
  });

  return schema.validate(catergorie);
}

exports.categorieSchema = categorieSchema;
exports.Categorie = Categorie;
exports.validate = validateCategorie;
