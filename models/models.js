const fs = require('fs/promises');
const { forEach } = require('lodash');

exports.fetchRecipes = (exclude_ingredients) => {
  console.log(exclude_ingredients);
  return fs
    .readFile('./data/data.json', 'utf8')
    .then((data) => {
      const parsedData = JSON.parse(data);

      // if there are no ingredients to exclude, return the full dataset
      if (!exclude_ingredients) {
        return parsedData;
      }

      // define regex value to check ingredients against
      let regex = new RegExp(exclude_ingredients);

      // if the ingredient to exclude is plural, remove the 's'
      const length = exclude_ingredients.length;
      if (exclude_ingredients[length - 1] === 's') {
        const singularIngredient = exclude_ingredients.slice(0, length - 1);
        regex = new RegExp(singularIngredient);
      }

      // declare an empty array, which will contain recipes without the specified ingredient
      const approvedRecipes = [];

      // for every recipe in the dataset, declare a variable stating whether it's ok to be added or not
      parsedData.forEach((recipe) => {
        let recipeOk = true;
        // for every ingredient in the recipe
        recipe.ingredients.forEach((ingredient) => {
          //if the ingredient name matches the value to be excluded, change recipeOk to false
          if (regex.test(ingredient.name)) {
            recipeOk = false;
          }
        });
        // once a recipe has been checked for a forbidden ingredient, if it's still deemed as ok, then push it to the array of approved recipes
        if (recipeOk) {
          approvedRecipes.push(recipe);
        }
      });
      return approvedRecipes;
    })
    .catch((err) => {
      console.log(err);
    });
};
