import * as mongodb from "mongodb";
import nodemailer from "nodemailer";
import password from "./mail_param.js";

const pass = password.password;
const GMAIL = process.env.GMAIL;

const ObjectId = mongodb.ObjectId;
let recipes;
let ingredients;
let users;

export default class RecipesDAO {
  // Initialize database collections
  static async injectDB(conn) {
    if (recipes) {
      return;
    }
    try {
      recipes = await conn.db(process.env.RECIPES_NS).collection("recipe");
      ingredients = await conn
        .db(process.env.RECIPES_NS)
        .collection("ingredient_list");
      users = await conn.db(process.env.RECIPES_NS).collection("user");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in recipesDAO: ${e}`
      );
    }
  }

  // Fetch user with username and password
  static async getUser({ filters = null } = {}) {
    if (!filters || !filters.userName)
      return { success: false, message: "User does not exist" };

    const user = await users.findOne({ userName: filters.userName });

    if (!user) {
      return { success: false, message: "User does not exist" };
    } else if (user.password !== filters.password) {
      return { success: false, message: "Incorrect password" };
    }

    return { success: true, user };
  }

  // Add a new user to the database
  static async addUser({ data = null } = {}) {
    try {
      const query = { userName: data.userName };
      const existingUser = await users.findOne(query);

      if (existingUser || !data.password) {
        return { success: false };
      }

      await users.insertOne(data);
      return { success: true };
    } catch (e) {
      console.error(`Error adding user: ${e}`);
      return { success: false };
    }
  }

  // Retrieve bookmarks for a user
  static async getBookmarks(userName) {
    try {
      const user = await users.findOne({ userName });
      if (!user) {
        throw new Error(`Cannot find user with name ${userName}`);
      }
      return user.bookmarks || [];
    } catch (e) {
      console.error(`Error retrieving bookmarks: ${e}`);
      throw e;
    }
  }

  // Retrieve recipes by name
  static async getRecipeByName({ filters = null } = {}) {
    try {
      if (filters?.recipeName) {
        const words = filters.recipeName.split(" ");
        const regexPattern = words.map((word) => `(?=.*\\b${word}\\b)`).join("");
        const regex = new RegExp(regexPattern, "i");

        const recipesList = await recipes
          .find({ TranslatedRecipeName: { $regex: regex } })
          .collation({ locale: "en", strength: 2 })
          .toArray();

        return { recipesList };
      }
      return { recipesList: [], totalNumRecipess: 0 };
    } catch (e) {
      console.error(`Error retrieving recipe by name: ${e}`);
      return { recipesList: [], totalNumRecipess: 0 };
    }
  }

  // Get recipes with filters
  static async getRecipes({
    filters = null,
    page = 0,
    recipesPerPage = 10,
  } = {}) {
    try {
      let query = {};
      if (filters?.CleanedIngredients) {
        const regex = filters.CleanedIngredients.map(
          (ing) => `(?=.*${ing})`
        ).join("");
        query["Cleaned-Ingredients"] = { $regex: regex, $options: "i" };
      }

      const cursor = recipes.find(query).collation({ locale: "en", strength: 2 });
      const recipesList = await cursor
        .skip(page * recipesPerPage)
        .limit(recipesPerPage)
        .toArray();

      const totalNumRecipes = await recipes.countDocuments(query);
      return { recipesList, totalNumRecipes };
    } catch (e) {
      console.error(`Error retrieving recipes: ${e}`);
      return { recipesList: [], totalNumRecipes: 0 };
    }
  }

  // Add a new recipe
  static async addRecipe(recipe) {
    try {
      const inputRecipe = {
        TranslatedRecipeName: recipe.recipeName,
        TotalTimeInMins: recipe.cookingTime,
        "Diet-type": recipe.dietType,
        "Recipe-rating": recipe.recipeRating,
        "Times-rated": 1,
        Cuisine: recipe.cuisine,
        "image-url": recipe.imageURL,
        URL: recipe.recipeURL,
        TranslatedInstructions: recipe.instructions,
        "Cleaned-Ingredients": recipe.ingredients.join("%"),
        Restaurant: recipe.restaurants.join("%"),
        "Restaurant-Location": recipe.locations.join("%"),
      };

      return await recipes.insertOne(inputRecipe);
    } catch (e) {
      console.error(`Error adding recipe: ${e}`);
      throw e;
    }
  }

  static async getRecipeById(id) {
    try {
      const recipe = await recipes.findOne({ _id: new ObjectId(id) });
      return recipe;
    } catch (e) {
      console.error(`Unable to fetch recipe: ${e}`);
      throw e;
    }
  }

  // Update an existing recipe
  static async updateRecipe(id, updateData) {

    try {
      console.log("Update Query:", { id, updateData });
      const updateResponse = await recipes.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (updateResponse.modifiedCount === 0) {
        return { error: "Recipe not found or no updates made" };
      }

      return updateResponse;
    } catch (error) {
      console.error(`Error updating recipe: ${error}`);
      throw error;
    }
  }

  // Rate a recipe
  static async rateRecipe(ratingBody) {
    try {
      const recipe = await recipes.findOne({
        _id: new ObjectId(ratingBody.recipeID),
      });

      if (!recipe) {
        throw new Error("Recipe not found");
      }

      const timesRated = recipe["Times-rated"] || 0;
      const currentRating = recipe["Recipe-rating"] || 0;
      const newRating =
        (currentRating * timesRated + ratingBody.rating) / (timesRated + 1);

      await recipes.updateOne(
        { _id: new ObjectId(ratingBody.recipeID) },
        {
          $set: {
            "Times-rated": timesRated + 1,
            "Recipe-rating": parseFloat(newRating.toFixed(2)),
          },
        }
      );
    } catch (e) {
      console.error(`Error rating recipe: ${e}`);
      throw e;
    }
  }

  // Retrieve all distinct cuisines
  static async getCuisines() {
    try {
      return await recipes.distinct("Cuisine");
    } catch (e) {
      console.error(`Error getting cuisines: ${e}`);
      return [];
    }
  }

  // Retrieve a user's meal plan
  static async getMealPlan(userName) {
    try {
      const user = await users.findOne({ userName });
      if (!user) {
        throw new Error(`Cannot find user with name ${userName}`);
      }

      const mealPlan = user["meal-plan"] || {};
      const response = {};

      for (const day in mealPlan) {
        if (mealPlan[day]) {
          response[day] = await recipes.findOne({
            _id: new ObjectId(mealPlan[day]),
          });
        }
      }

      return response;
    } catch (e) {
      console.error(`Error getting meal plan: ${e}`);
      throw e;
    }
  }
}