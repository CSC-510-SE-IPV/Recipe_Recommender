import * as mongodb from "mongodb";
import nodemailer from "nodemailer";
import password from "./mail_param.js";
const pass = password.password;
const GMAIL = process.env.GMAIL;
import HashAndVerify from "../helpers/auth.js";
import bcrypt from "bcrypt"

const ObjectId = mongodb.ObjectId;
let recipes;
let ingredients;
let users;

export default class RecipesDAO {
  /* Function to connect to DB and initialize references to database collections 
    Params:
      - conn: a MongoDB client connection
  */
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
      //console.log("db started")
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in recipesDAO: ${e}`
      );
    }
  }

  /* Function to retrieve a user with a given userName
    Params: 
      - filters: JSON object defining a 'userName' to search for
    Returns:
      - If the specified user exists, returns the user and a success message in JSON
      - If the specified user does not exist, or some other error occurs, returns a failure message
  */
  static async getUser({ filters = null } = {}) {
    if (!filters || !filters.userName)
      return { success: false, message: "User does not exist" };

    const user = await users.findOne({ userName: filters.userName });

    if (user) {
      const isPasswordValid = await bcrypt.compare(filters.password, user.password);
     
    if (isPasswordValid) {
      return { success: true, user };
      // Password is incorrect
      }
    else{  return { success: false, message: "Incorrect password" };}
    
  }
    else{
       // User does not exist
       return { success: false, message: "User does not exist" };
    }

    // Successful login
  }

  /* Function to add a new user into the database
    Params:
      - data: JSON object defining a 'userName' and 'password' for the new user
    Returns:
      - If all required fields are provided and valid, creates the new user and returns a success message in JSON
      - Otherwise returns a failure message in JSON
  */
  static async addUser({ data = null } = {}) {
    let query;
    let cursor;
    let user;
    query = { userName: data.userName };
    if (data) {
      

      cursor = await users.findOne(query);
      if (cursor !== null || !data.password) {
        return { success: false };
      } else {
        
        const res = await users.insertOne(data);
        return { success: true };
      }
    }
  }

  /* Function to retrieve the bookmarks from a given user
    Params:
      - userName: The name of the user to get bookmarks for
    Returns:
      - If provided userName belongs to an existing user, returns an array of their current bookmarked recipes
      - Otherwise, throws an error
  */
  static async getBookmarks(userName) {
    let query;
    let cursor;
    let user;
    query = { userName: userName };
    try {
      cursor = await users.findOne(query);
      if (!cursor) {
        throw new Error(`Cannot find user with name ${userName}`);
      }
      if (cursor.userName) {
        return cursor.bookmarks;
      } else {
        return { bookmarks: [] };
      }
    } catch (e) {
      console.log(`error: ${e}`);
      throw e;
    }
  }

  /* Function to retrieve recipes by name
    Params:
      - filters: JSON object defining a 'recipeName' to search for recipes by
    Returns:
      - If all required fields are provided and valid, returns an array of all recipes matching the name
  */
  static async getRecipeByName({ filters = null } = {}) {
    let query;
    if (filters) {
      if ("recipeName" in filters) {
        const words = filters["recipeName"].split(" ");
        const regexPattern = words
          .map((word) => `(?=.*\\b${word}\\b)`)
          .join("");
        const regex = new RegExp(regexPattern, "i");
        query = { TranslatedRecipeName: { $regex: regex } };
        // query["Cuisine"] = "Indian";
      }
      let recipesList;
      try {
        recipesList = await recipes
          .find(query)
          .collation({ locale: "en", strength: 2 })
          .toArray();
        return { recipesList };
      } catch (e) {
        console.error(`Unable to issue find command, ${e}`);
        return { recipesList: [], totalNumRecipess: 0 };
      }
    }
  }

  /* Function to get recipes based on provided filters
    Params:
      - filters: JSON object defining a which filters to search for recipes by
    Returns:
      - An array of recipes matching the specified filters
  */
  static async getRecipes({
    filters = null,
    page = 0,
    recipesPerPage = 10,
  } = {}) {
    let query;
    if (filters) {
      if ("CleanedIngredients" in filters) {
        var str = "(?i)";

        for (var i = 0; i < filters["CleanedIngredients"].length; i++) {
          const str1 = filters["CleanedIngredients"][i];
          str += "(?=.*" + str1 + ")";
        }
        query = { "Cleaned-Ingredients": { $regex: str } };
        query["Cuisine"] = filters["Cuisine"];
        var email = filters["Email"];
        var flagger = filters["Flag"];
      }
    }

    let cursor;

    try {
      cursor = await recipes
        .find(query)
        .collation({ locale: "en", strength: 2 });
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { recipesList: [], totalNumRecipess: 0 };
    }

    const displayCursor = cursor.limit(recipesPerPage);
    try {
      const recipesList = await displayCursor.toArray();
      const totalNumRecipes = await recipes.countDocuments(query);

      var str_mail = "";
      for (var j = 1; j <= recipesList.length; j++) {
        str_mail += "\nRecipe " + j + ": \n";
        str_mail += recipesList[j - 1]["TranslatedRecipeName"] + "\n";
        str_mail +=
          "Youtube Link: https://www.youtube.com/results?search_query=" +
          recipesList[j - 1]["TranslatedRecipeName"].replace(/ /g, "+") +
          "\n\n";
      }
      /* Handles sending emails to the user if the option is selected */
      if (flagger == "true") {
        var transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: GMAIL,
            pass: pass,
          },
        });

        var mailOptions = {
          from: GMAIL,
          to: email,
          subject: "Recommended Recipes! Enjoy your meal!!",
          text: str_mail,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      }

      return { recipesList, totalNumRecipes };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { recipesList: [], totalNumRecipes: 0 };
    }
  }

  /* Function to retrieve all distinct cuisine types of recipes in the database
    Returns:
      - An array of all distinct cuisine types, if any exist (No duplicates)
  */
  static async getCuisines() {
    let cuisines = [];
    try {
      cuisines = await recipes.distinct("Cuisine");
      return cuisines;
    } catch (e) {
      console.error(`Unable to get cuisines, ${e}`);
      return cuisines;
    }
  }

  /* Function to add a new recipe into the database
    Params:
      - recipe: JSON object defining the fields for the new recipe; only recipeName is a required field
    Returns:
      - If all required fields are provided and valid, creates the new recipe and returns a successful response
      - Otherwise, throws an error
  */
  static async addRecipe(recipe) {
    let response = {};
    try {
      if (!recipe["recipeName"]) {
        throw new Error("recipeName must be provided");
      }
      let inputRecipe = {};
      inputRecipe["TranslatedRecipeName"] = recipe["recipeName"];
      inputRecipe["TotalTimeInMins"] = recipe["cookingTime"];
      inputRecipe["Diet-type"] = recipe["dietType"];
      inputRecipe["Recipe-rating"] = recipe["recipeRating"];
      inputRecipe["Times-rated"] = 1;
      inputRecipe["Cuisine"] = recipe["cuisine"];
      inputRecipe["image-url"] = recipe["imageURL"];
      inputRecipe["URL"] = recipe["recipeURL"];
      inputRecipe["TranslatedInstructions"] = recipe["instructions"];
      var ingredients = "";
      for (var i = 0; i < recipe["ingredients"].length; i++) {
        ingredients += recipe["ingredients"][i] + "%";
      }
      inputRecipe["Cleaned-Ingredients"] = ingredients;
      var restaurants = "";
      var locations = "";
      for (var j = 0; j < recipe["restaurants"].length; j++) {
        restaurants += recipe["restaurants"][j] + "%";
        locations += recipe["locations"][j] + "%";
      }
      inputRecipe["Restaurant"] = restaurants;
      inputRecipe["Restaurant-Location"] = locations;

      response = await recipes.insertOne(inputRecipe);
      return response;
    } catch (e) {
      console.error(`Unable to add recipe, ${e}`);
      throw e;
    }
  }

  /* Function to rate an existing recipe
    Params:
      - ratingBody: JSON object defining a 'recipeID' to rate and a 'rating' to give that recipe
    Returns:
      - If all required fields are provided and valid, averages the new rating into the existing rating for the specified recipe
  */
  static async rateRecipe(ratingBody) {
    let r = await recipes
      .find({ _id: new ObjectId(ratingBody.recipeID) })
      .collation({ locale: "en", strength: 2 })
      .toArray();

    let recipe = r[0];
    let timesRated = recipe["Times-rated"] ? Number(recipe["Times-rated"]) : 0;
    let currentRating = Number(recipe["Recipe-rating"]) || 0;
    let newRating =
      (currentRating * timesRated + ratingBody.rating) / (timesRated + 1);
    newRating = Math.min(Math.max(newRating, 0), 5);
    timesRated++;
    await recipes.updateOne(
      { _id: new ObjectId(ratingBody.recipeID) },
      {
        $set: {
          "Times-rated": timesRated,
          "Recipe-rating": parseFloat(newRating.toFixed(2)),
        },
      }
    );
  }

  /* Function to add a recipe to the user's bookmarks
    Params:
      - userName: The name of the user to add the recipe to
      - recipe: The recipe to be added to the user's bookmarks
    Returns:
      - If the specified user exists and the recipe is not already in their bookmarks, adds the recipe to their bookmarks and returns a success message in JSON
      - Otherwise, returns a failure message
  */
  static async addRecipeToProfile(userName, recipe) {
    try {
      // First, check if the recipe already exists in the user's bookmarks
      const user = await users.findOne({ userName: userName });
      if (!user) {
        return { success: false, message: "User not found" };
      }

      const existingBookmark = user.bookmarks
        ? user.bookmarks.find(
            (bookmark) => bookmark._id.toString() === recipe._id.toString()
          )
        : null;
      if (existingBookmark) {
        console.log("Recipe already bookmarked");
        return { success: false, message: "Recipe already bookmarked" };
      }

      // If the recipe doesn't exist, add it to the bookmarks
      const updateResult = await users.updateOne(
        { userName: userName },
        { $addToSet: { bookmarks: recipe } }
      );

      if (updateResult.modifiedCount === 0) {
        console.log("No changes made to bookmarks");
        return { success: false, message: "No changes made to bookmarks" };
      }

      return {
        success: true,
        message: "Recipe added to bookmarks successfully",
      };
    } catch (e) {
      console.error(`Error in addRecipeToProfile: ${e}`);
      throw e;
    }
  }

  /* Function to remove a recipe from a user's bookmarks
    Params:
      - userName: The name of the user to remove the recipe from
      - recipe: The recipe to be removed from the user's bookmarks
    Returns:
      - If the specified user exists and the recipe is in their bookmarks, removes the recipe from their bookmarks and returns a success message in JSON
      - Otherwise, returns a failure message
  */
  static async removeBookmark(userName, recipeId) {
    try {
      const updateResponse = await users.updateOne(
        { userName: userName },
        { $pull: { bookmarks: { _id: recipeId } } }
      );

      if (updateResponse.modifiedCount === 1) {
        return { success: true, message: "Bookmark removed successfully" };
      } else if (updateResponse.matchedCount === 0) {
        return { success: false, message: "User not found" };
      } else {
        return {
          success: false,
          message: "Bookmark not found or already removed",
        };
      }
    } catch (e) {
      console.error(`DAO: Unable to remove bookmark:`, e);
      throw e;
    }
  }

  /* Function to add a recipe to the user's meal plan
    Params:
      - userName: The name of the user to add the recipe to
      - recipeID: The id of the recipe to be added to the user's meal plan
      - weekDay: A day of the week ('sunday'-'saturday') to assign the recipe to
    Returns:
      - If the specified user exists and a weekday is given, assigns the provided recipe to the meal plan and returns a successful response
      - Otherwise, throws an error
  */
  static async addRecipeToMealPlan(userName, recipeID, weekDay) {
    let response;
    try {
      if (recipeID === undefined || recipeID === null) {
        throw new Error("recipe id not defined");
      }
      if (!weekDay) {
        throw new Error("weekDay not defined");
      }
      let updateBody = JSON.parse(
        '{ "meal-plan.' + weekDay + '": "' + recipeID + '" }'
      );
      response = await users.updateOne(
        { userName: userName },
        { $set: updateBody }
      );
      return response;
    } catch (e) {
      console.log(`Unable to add recipe to meal plan, ${e}`);
      throw e;
    }
  }

  /* Function to retrieve a user's meal plan
    Params:
      - userName: The name of the user to get the meal plan of
    Returns:
      - If the specified user exists, returns a JSON object with days of the week as keys and the assigned recipe objects as their values
  */
  static async getMealPlan(userName) {
    let cursor;
    let mealPlanResponse = {
      sunday: "",
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
    };
    try {
      cursor = await users.findOne({ userName: userName });
      if (cursor.userName) {
        let plan = cursor["meal-plan"] ? cursor["meal-plan"] : {};
        for (const day in plan) {
          if (plan[day] != "") {
            let recipe = await recipes.findOne({
              _id: new ObjectId(plan[day]),
            });
            let dayPlan = {};
            dayPlan[day] = recipe;
            mealPlanResponse = { ...mealPlanResponse, ...dayPlan };
          }
        }
        return mealPlanResponse;
      } else {
        throw new Error(`Cannot find user with name ${userName}`);
      }
    } catch (e) {
      console.log(`error: ${e}`);
    }
  }

  /* Function to retrieve a list of ingredients
    Returns:
      - An array containing all of the ingredients in the database collection 'ingredients_list'
  */
  static async getIngredients() {
    let response = {};
    try {
      response = await ingredients.distinct("item_name");
      return response;
    } catch (e) {
      console.error(`Unable to get ingredients, ${e}`);
      return response;
    }
  }

  /* Function to update an existing recipe
    Params:
      - id: The ID of the recipe to update
      - updateData: The new data to update the recipe with
    Returns:
      - Updates the recipe in the DB and returns a successful response
      - Or throws an error if someting goes wrong
  */
  static async updateRecipe(id, updateData) {
    try {
      const updateResponse = await recipesCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      return updateResponse;
    } catch (error) {
      console.error(`Unable to update recipe: ${error}`);
      throw error;
    }
  }

  /* Function purely for testing.  Used to ensure that database connection is defined when running tests.
      Initializes the database connection with a new MongoDB client, if the database has not already been initialized
    Returns:
      - A success message if the DB connection is successfully created or has previously been created
  */
  static async initDB() {
    if (recipes) {
      return { success: true };
    }
    try {
      await mongodb.MongoClient.connect(process.env.RECIPES_DB_URI, {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
        useNewUrlParser: true,
      }).then(async (client) => {
        await this.injectDB(client);
        return { success: true };
      });
    } catch (e) {
      console.log(e);
      return { success: false };
    }
  }
}
