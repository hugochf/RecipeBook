const express = require("express");
const categories = require("../routes/categories");
const recipes = require("../routes/recipes");
const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/categories", categories);
  app.use("/api/recipes", recipes);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use(error);
};
