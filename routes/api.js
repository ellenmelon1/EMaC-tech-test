const apiRouter = require('express').Router();
const recipesRouter = require('./recipes-router.js');

apiRouter.get('/', (_, res) => {
  res.json({ message: 'ok' });
});

apiRouter.use('/recipes', recipesRouter);

apiRouter.all('*', (req, res) => {
  res.status(404).send({ msg: 'path not found' });
});

module.exports = apiRouter;
