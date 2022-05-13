const { fetchRecipes } = require('../models/models.js');

exports.getRecipes = (req, res) => {
  const { exclude_ingredients } = req.query;
  fetchRecipes(exclude_ingredients)
    .then((recipes) => {
      res.status(200).send({ recipes });
    })
    .catch((err) => {
      console.log(err);
    });
};
