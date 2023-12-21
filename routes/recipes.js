const { Recipe, validate } = require("../models/recipe");
const express = require("express");
const { Categorie } = require("../models/categorie");
const router = express.Router();

router.get("/", async (req, res) => {
  const recipe = await Recipe.find().sort("title");
  res.send(recipe);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const categorie = await Categorie.findById(req.body.categorieId);
  if (!categorie) return res.status(400).send("Invalid categorie.");

  const recipe = new Recipe({
    title: req.body.title,
    categorie: {
      _id: categorie._id,
      name: categorie.name,
    },
    ingredients: req.body.ingredients,
    serving: req.body.serving,
    content: req.body.content,
    remarks: req.body.remarks,
  });
  await recipe.save();

  res.send(recipe);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const categorie = await Categorie.findById(req.body.categorieId);
  if (!categorie) return res.status(400).send("Invalid categorie.");

  let repice = await Recipe.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      categorie: {
        _id: categorie._id,
        name: categorie.name,
      },
      ingredients: req.body.ingredients,
      serving: req.body.serving,
      remarks: req.body.remarks,
      content: req.body.content,
      liked: req.body.liked,
    },
    { new: true }
  );

  if (!repice)
    return res.status(404).send("The recipe with the given ID is not exist.");
  recipe = await Recipe.findById(req.params.id);
  res.send(repice);
});

router.delete("/:id", async (req, res) => {
  const repice = await Recipe.findOneAndDelete(req.params.id);

  if (!repice)
    return res.status(400).send("The recipe with the given ID is not exist.");

  res.send(repice);
});

router.get("/:id", async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe)
    return res.status(404).send("The recipe with the given ID is not exist.");

  res.send(recipe);
});

module.exports = router;
