import RecipesDAO from "../dao/recipesDAO.js";

export default class RecipesController {
  /* API handler for logging in a user
      Uses the provided userName and password to attempt a login.
      If the provided userName-password pair matches the database information, the user is successfully logged in
  */
  static async apiAuthLogin(req, res) {
    const filters = {
      userName: req.query.userName,
      password: req.query.password,
    };

    const { success, user, message } = await RecipesDAO.getUser({ filters });

    if (success) {
      res.json({ success: true, user });
    } else {
      res.json({ success: false, message });
    }
  }

  /* API handler for signing up a new user
      Uses the provided userName and password to attempt creating a new user.
      If the new user is added to the database, the user has successfully been signed up
  */
  static async apiAuthSignup(req, res) {
    if (req.body) {
      let data = {};
      data.userName = req.body.userName;
      data.password = req.body.password;
      const { success, user } = await RecipesDAO.addUser({
        data,
      });
      res.json({ success, user });
    }
  }

  /* API handler for getting a user's bookmarks.
      Uses the provided userName to attempt retrieving the bookmarks.
      Returns the resulting list of bookmarks from the database.
      If a userName is not provided, a failure message is returned without querying the database
  */
  static async apiGetBookmarks(req, res) {
    try {
      if (req.query.userName) {
        const bookmarks = await RecipesDAO.getBookmarks(req.query.userName);
        res.json({ bookmarks });
      } else {
        res.json("Username not given");
      }
    } catch (e) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: e.message,
      });
    }
  }

  /* API handler for adding a recipe to a user's bookmarks.
      Attempts to add the provided recipe to the specified user's profile (if they exist).
      If it is added, returns a successful response from the database.
      If no userName or recipe is provided, or if the user does not exist, a failure message is returned
  */
  static async apiPostRecipeToProfile(req, res) {

    const { userName, recipe } = req.body;

    if (!userName || !recipe) {
      return res
        .status(400)
        .json({ success: false, message: "Missing userName or recipe" });
    }

    try {
      const result = await RecipesDAO.addRecipeToProfile(userName, recipe);
      res.json(result);
    } catch (e) {
      console.error("Error in apiPostRecipeToProfile:", e);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: e.message,
      });
    }
  }

  /* API handler for removing a recipe from a user's bookmarks
      Attempts to remove the specified recipe from the specified user's profile (if they exist).
      Returns a 200 status and successful response if it is removed, or a 500 status with an error message if not
  */
  static async apiRemoveRecipeFromProfile(req, res) {
    const { userName, recipeId } = req.body;
    try {
      const result = await RecipesDAO.removeBookmark(userName, recipeId);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }

  /* API handler for searching for a recipe by name
      Creates a filter if a recipeName is specified, and attempts to find any recipes that match the filter
      Returns a list of all recipes matching the filter
  */
  static async apiGetRecipeByName(req, res) {
    let filters = {};
    //Checking the query to find the required results
    if (req.query.recipeName) {
      filters.recipeName = req.query.recipeName;
    }

    const { recipesList } = await RecipesDAO.getRecipeByName({
      filters,
    });

    let response = {
      recipes: recipesList,
    };
    res.json(response);
  }

  /* API handler for searching for a recipe by various filters.
      Filters on specified Ingredients and Cuisine (also tracks if an email should be sent).
      Returns a list of all recipes matching the filter.
  */
  static async apiGetRecipes(req, res, next) {
    const recipesPerPage = req.query.recipesPerPage
      ? parseInt(req.query.recipesPerPage, 10)
      : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    let filters = {};
    //Checking the query to find the required results

    if (req.query.CleanedIngredients) {
      filters.CleanedIngredients = req.query.CleanedIngredients;
      filters.Cuisine = req.query.Cuisine;
      filters.Email = req.query.Email;
      filters.Flag = req.query.Flag;
    }

    const { recipesList, totalNumRecipes } = await RecipesDAO.getRecipes({
      filters,
      page,
      recipesPerPage,
    });

    let response = {
      recipes: recipesList,
      page: page,
      filters: filters,
      entries_per_page: recipesPerPage,
      total_results: totalNumRecipes,
    };
    res.json(response);
  }

  /* API handler for retrieving all cuisine types.
      Retrieves all the types of cuisines from recipes in the database.
      Returns a list of all distinct cuisine types
  */
  static async apiGetRecipeCuisines(req, res, next) {
    try {
      let cuisines = await RecipesDAO.getCuisines();
      res.json(cuisines);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  /* API handler for adding a recipe.
      Expects all recipe information to be in req.body.
      Attempts to add the recipe to the database, returning the successful response if it is added
  */
  static async apiPostRecipe(req, res, next) {
    try {
      let response = await RecipesDAO.addRecipe(req.body);
      res.json(response);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  /* API handler for rating an existing recipe.
      Expects all rating information to be in req.body.
      Attempts to update the rating information about the specified recipe, returning the successful response if it is
      Returns a 500 status and an error message if any errors occurr
  */
  static async apiPatchRecipeRating(req, res, next) {
    try {
      let response = await RecipesDAO.rateRecipe(req.body);
      res.json(response);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  /* API handler for retrieving all ingredients.
      Retrieves and returns a list of distinct ingredients from the database.
  */
  static async apiGetIngredients(req, res, next) {
    try {
      let ingredients = await RecipesDAO.getIngredients();
      res.json(ingredients);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }

  /* API handler for adding a recipe to a user's meal plan.
      Attempts to add a specified recipe to the specified day of the specified user's meal plan.
      Returns a successful response if the recipe is added, or a 500 status and error message if any errors occurred
  */
  static async apiAddtoPlan(req, res, next) {
    try {
      let response = await RecipesDAO.addRecipeToMealPlan(
        req.body.userName,
        req.body.recipeID,
        req.body.weekDay
      );
      res.json(response);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }

  /* API handler for retrieving a user's meal plan.
      Attempts to retrieve the meal plan of a specified user, and returns it if the user exists.
  */
  static async apiGetMealPlan(req, res, next) {
    try {
      let response = await RecipesDAO.getMealPlan(req.query.userName);
      res.json(response);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }

  static async apiGetRecipeById(req, res, next) {
    try {
      const recipeId = req.params.id;
  
      const recipe = await RecipesDAO.getRecipeById(recipeId);
      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }
  
      res.json(recipe);
    } catch (error) {
      console.error(`Error fetching recipe by ID: ${error.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  /* API handler for updating a recipe.
      Attempts to update a specified recipe with the update data in req.body.
  */
  static async apiUpdateRecipe(req, res, next) {
    try {
      console.log("Received Recipe ID:", req.params.id);
      console.log("Received Update Data:", req.body);
      const recipeId = req.params.id; // Get the recipe ID from the request params
      const updateData = req.body; // Get the updated recipe data from the request body

      // Call the DAO method to update the recipe
      const updateResponse = await RecipesDAO.updateRecipe(
        recipeId,
        updateData
      );

      if (updateResponse.modifiedCount === 0) {
        return res
          .status(404)
          .json({ error: "Recipe not found or no updates made" });
      }

      res.json({ status: "success", data: updateResponse });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  /* For testing purposes only.  API handler for initializing the DB.
      Ensures that the database connection and collections have been set up
  */
  static async apiInitDB(req, res) {
    try {
      let response = await RecipesDAO.initDB();
      res.json(response);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }
}
