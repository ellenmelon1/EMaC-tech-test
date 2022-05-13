const recipesRouter = require('express').Router();
const { getRecipes } = require('../controllers/controllers');

recipesRouter.get('/', getRecipes).post((req, res) => {
  res.status(200).send('All OK from POST /api/recipes');
});

recipesRouter.get('/:id', (req, res) => {
  res.status(200).send('All OK from /api/recipes/:id');
});

module.exports = recipesRouter;
