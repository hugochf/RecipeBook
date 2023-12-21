const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Categorie, validate } = require("../models/categorie");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const categorie = await Categorie.find().sort("name");
  res.send(categorie);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let categorie = new Categorie({ name: req.body.name });
  categories = await categorie.save();

  res.send(categorie);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const categorie = await Categorie.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!categorie)
    return res
      .status(404)
      .send("The categorie with the given ID is not exist.");

  res.send(categorie);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const categorie = await Categorie.findByIdAndDelete(req.params.id);

  if (!categorie)
    return res
      .status(404)
      .send("The categorie with the given ID is not exist.");

  res.send(categorie);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const categorie = await Categorie.findById(req.params.id);

  if (!categorie)
    return res
      .status(404)
      .send("The categorie with the given ID is not exist.");

  res.send(categorie);
});

module.exports = router;
