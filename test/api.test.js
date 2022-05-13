const supertest = require('supertest');
const server = require('../server');

const request = supertest(server);

// seed file would need to be created to reseed the database before each test, e.g. so testing for the length of a response doesn't change after a post request.

describe('GET requests', () => {
  describe('/api', () => {
    test('/api', async () => {
      const { body } = await request.get('/api').expect(200);
      expect(body.message).toBe('ok');
    });
  });
  describe('/api/recipes', () => {
    it("responds with status 200 and a list of recipes that's the correct length", () => {
      const numOfRecipes = 100;
      return request
        .get('/api/recipes')
        .expect(200)
        .then(({ body: { recipes } }) => {
          expect(recipes.length).toBe(numOfRecipes);
        });
    });
    it('each recipe in the list contains the expected keys and value types', () => {
      return request
        .get('/api/recipes')
        .expect(200)
        .then(({ body: { recipes } }) => {
          recipes.forEach((recipe) => {
            expect(recipe).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                imageUrl: expect.any(String),
                instructions: expect.any(String),
                ingredients: expect.any(Array),
              })
            );
          });
        });
    });
    it("responds with '404 - path not found' when an incorrect path is requested", () => {
      return request
        .get('/api/bad-path')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('path not found');
        });
    });
    it('accepts a query to exlude recipes containing a specified ingredient', () => {
      return request
        .get('/api/recipes?exclude_ingredients=apples')
        .expect(200)
        .then(({ body: { recipes } }) => {
          // checks every ingredient in every recipe doesn't contain the word 'apple'
          recipes.forEach((recipe) => {
            recipe.ingredients.forEach((ingredient) => {
              expect(/apple/.test(ingredient.name)).not.toBe(true);
            });
          });
        });
    });
    it('accepts a query containing a list of ingredients to exclude', () => {
      return request
        .get('/api/recipes?exclude_ingredients=apples,bananas,carrots')
        .expect(200)
        .then(({ body: recipes }) => {
          recipes.forEach((recipe) => {
            recipe.ingredients.forEach((ingredient) => {
              expect(/apple/.test(ingredient.name)).not.toBe(true);
              expect(/banana/.test(ingredient.name)).not.toBe(true);
              expect(/carrot/.test(ingredient.name)).not.toBe(true);
            });
          });
        });
    });
    // next test: returns '400 - bad request' if the exclude_ingredients query doesn't contain a valid ingredient? Or just ignore it? There's no risk of interfering with the JSON database like there would be using SQL.
  });
});
