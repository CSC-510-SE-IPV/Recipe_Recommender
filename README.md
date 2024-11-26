# Enhanced Recipe Recommender: Introducing additional features and addressing issues for an improved user experience.

![](Reciperec.gif)
<br><br>
## Watch how our application works: 
### Click here to watch - [Video](https://drive.google.com/file/d/1kLdyREptrk8A0nui-yENSm4Av3epAtSS/view?usp=sharing) <br>


<br><br>

[![Made With](https://img.shields.io/badge/made%20with-javascript-gree)](https://www.javascript.com/)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.14226076.svg)](https://doi.org/10.5281/zenodo.14226076)
[![GitHub issues open](https://img.shields.io/github/issues/SE-Fall24-RZA/Recipe_Recommender)](https://github.com/SE-Fall24-RZA/Recipe_Recommender/issues)
[![GitHub stars](https://badgen.net/github/stars/SE-Fall24-RZA/Recipe_Recommender)](https://badgen.net/github/stars/SE-Fall24-RZA/Recipe_Recommender)
![Github closes issues](https://img.shields.io/github/issues-closed-raw/SE-Fall24-RZA/Recipe_Recommender)
[![codecov](https://codecov.io/gh/SE-Fall24-RZA/Recipe_Recommender/graph/badge.svg?token=mBl30Hpkf0)](https://codecov.io/gh/SE-Fall24-RZA/Recipe_Recommender)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![GitHub contributors](https://img.shields.io/github/contributors/SE-Fall24-RZA/Recipe_Recommender)
[![Code Formatter](https://github.com/SE-Fall24-RZA/Recipe_Recommender/actions/workflows/codeFormatter.yml/badge.svg)](https://github.com/SE-Fall24-RZA/Recipe_Recommender/actions/workflows/codeFormatter.yml)
[![Syntax Checker](https://github.com/SE-Fall24-RZA/Recipe_Recommender/actions/workflows/Syntax_Check.yml/badge.svg)](https://github.com/SE-Fall24-RZA/Recipe_Recommender/actions/workflows/Syntax_Check.yml)
[![Tests](https://github.com/SE-Fall24-RZA/Recipe_Recommender/actions/workflows/backendTests.yml/badge.svg)](https://github.com/SE-Fall24-RZA/Recipe_Recommender/actions/workflows/backendTests.yml)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/SE-Fall24-RZA/Recipe_Recommender)
![CI/CD](https://img.shields.io/badge/CI/CD-Passing-brightgreen)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<h2> What is Recipe Recommender? </h2>

Meet Recipe Recommender, your ultimate kitchen companion! Say goodbye to the dilemma of deciding what to cook with the ingredients on hand. We've revolutionized the cooking experience with an application that effortlessly suggests delicious recipes based on your kitchen inventory. <br>

Unlock the full potential of your pantry and fridge as our innovative software guides you in selecting perfect dishes tailored to your current ingredients. Cooking is now an exciting adventure rather than a daunting task. Immerse yourself in a realm of limitless culinary possibilities with Recipe Recommender. <br>

We've added <b> numerous entertaining new features and fixes to enhance user-friendliness.</b> <br>

1. Craving enchiladas but unsure how to cook Mexican food? Now, you can search for recipes by names! Just type in "enchiladas," choose a recipe based on its features, and enjoy. <br>

2. Imagine finding interesting recipes during your commute. With another new feature, you can save them on the go. We've also introduced dedicated user profiles. Sign up, log in, and save your favorite recipes under your profile in the "bookmarks" section. When you're ready to cook, everything will be waiting for you. <br>

3. That's not all! We've removed non-functional buttons, technically known as "refactoring the system." <br>
4. Your profile, information, and favorite recipes now have a dedicated space. Secure logins and logouts ensure no duplicate entries or exposed credentials, making the system more secure.

<br> <b> More about our new additions in our next section!</b>

## Feature additions: Enhancements, Upgrades and BugFixes:

## Watch how our application works in detail: 
### Click here to watch the walkthrough - [Video](https://drive.google.com/file/d/1DOolD7SlqlNhsB5FMVuKGv54InO61Hqt/view?usp=sharing) <br>

Presenting our latest additions: Here's a comprehensive list of all our new features, enhancements, and upgrades! <br>

1. User Profile: In our application, users can now establish a profile with a unique username and password, allowing seamless login and logout. This facilitates personalized experiences and customized access to preferences and activities. Further details will be discussed in the following points. Your profile, information, and preferred recipes now inhabit a designated area, simplifying the management of all your belongings in one organized space.
2. Bookmarks: Picture this scenario: You're commuting, scrolling through intriguing recipes in our app. Thanks to a cutting-edge feature, you can now save them instantly. The introduction of dedicated user profiles elevates your experience. Simply sign up, log in, and curate your favorite recipes in the "bookmarks" section under your profile. When the time comes to cook, everything awaits you – seamlessly organized and easily accessible.
3. Search for recipes by name: Previously limited to ingredient-based searches only, our system now boasts an exciting upgrade. You can now search for recipes by name! Ever craved enchiladas without knowing the recipe? Simply input "enchiladas," peruse based on features, and relish the culinary journey.
4. Refactoring the UI: We've eliminated inactive buttons and links, employing a technical process termed "system refactoring" to enhance functionality and optimize the user interface.
5. System security upgrade: We observed some passwords present in the codebase, which is a major security threat. We have ensured to removed this and move it to the DB. Additionally, we have implemented secure logins and logouts ensuring the prevention of duplicate entries and safeguards credentials, fortifying the overall security of the system.
6. The requirements.txt file has been updated to ensure forward compatibility by specifying package versions greater than or equal to the ones explicitly mentioned. This modification allows for the installation of packages with versions that meet or exceed the specified ones, thus accommodating future updates and maintaining compatibility with evolving dependencies.
7. We have enhanced the project by implementing robust login bug fixes, comprehensive form validations, and an expanded suite of test cases.

## Documentation and Project Flow:

![](flow-rr.gif) <br><br>

1. User Registration: Establish a unique username and password; no duplicate usernames allowed, ensuring password confidentiality.
   User Authentication: Log in using the correct username and password for secure access.
2. Search Recipes by Ingredients: Input your available ingredients to discover relevant recipes based on ingredient names.
3. Search Recipes by Dish Name: Locate recipes by specifying the dish name in the search.
4. Add a Recipe: Share details such as ingredients, dish name, time, cuisine, instructions, and optional images to contribute your recipe.
5. Bookmark Favorite Recipes: Save preferred recipes for easy access.
6. View Bookmarked Recipes in User Profile: Access and review all saved recipes conveniently stored under your user profile.
7. Logout: Securely log out to protect your profile information and activities.
8. Meal Planning: Add recipes to your meal plan for specific days, helping you organize your meals in advance.
9. Recipe Rating: Rate recipes based on your experience, allowing other users to benefit from your feedback.
10. Chatbot Assistance: Interact with a chatbot for instant support and recipe suggestions, enhancing user engagement and experience. <br><br>

Source documentation can be found at: [Recipe Recommender Docs](https://github.com/pnprathima/Recipe_Recommender/blob/master/Recipe%20Recommender%20Source%20Documentation.pdf)

## API Documentation

**Get Recipes:**
Retrieve a list of recipes based on specified filters like ingredients, cuisine, and page parameters. Success returns a code of 200 with the recipe list; error returns code 500 with an error message.

**Get Recipe Cuisines:**
Fetches available cuisines, responding with a code of 200 and an array of cuisine strings on success. In case of an error, it returns a code of 500 with an error message.

**Add Recipe:**
Allows users to add a new recipe via the /addRecipe endpoint, responding with a code of 200 and the inserted recipe's ID on success. In case of an error, it returns a code of 500 with an error message.

**Get Ingredients:**
Retrieves a list of distinct ingredients through the /callIngredients endpoint. Success returns a code of 200 with an array of ingredient strings; error returns code 500 with an error message.

**User Signup:**
Enables user registration at the /signup endpoint. Success returns a code of 200 with a success indicator; error returns code 500 with an error message.

**User Login:**
Authenticates a user via the /login endpoint, returning a code of 200 with a success indicator and user object on success. In case of an error, it returns a code of 500 with an error message.

**Get Bookmarks:**
Retrieves bookmarked recipes for a user through the /getBookmarks endpoint. Success returns a code of 200 with an array of bookmarked recipes; error returns code 500 with an error message.

**Add Recipe to User Profile:**
Adds a recipe to a user's profile bookmarks via the /addRecipeToProfile endpoint. Success returns a code of 200 with the count of modified items; error returns code 500 with an error message.

**APIs for New Functionality**

### Add Recipe to User's Meal Plan

- **Endpoint**: `POST /mealplan/add`
- **Description**: Attempts to add a specified recipe to the specified day of the specified user's meal plan.
- **Request Body**:
  ```json
  {
    "userName": "string",
    "recipeID": "string",
    "weekDay": "string"
  }
  ```
- **Response**:

  - **Success**: `{ success: true, message: "Recipe added to meal plan" }`
  - **Failure**: `{ error: "Internal server error" }`

  ### Get User's Meal Plan

- **Endpoint**: `GET /mealplan`
- **Description**: Attempts to retrieve the meal plan of a specified user. If the user exists, the meal plan is returned.
- **Query Parameters**:
  - `userName`: The username of the user whose meal plan is being retrieved.
- **Response**:
  - **Success**:
    - Returns the user's meal plan in the response body.
    ```json
    {
      "mealPlan": [...]
    }
    ```
  - **Failure**:
    - Returns an error message if an internal server error occurs.
    ```json
    {
      "error": "Internal server error"
    }
    ```

### Rate a Recipe

- **Endpoint**: `PATCH /recipes/rate`
- **Description**: Updates the rating information for a specified recipe.
- **Request Body**:
  ```json
  {
    "recipeId": "string",
    "rating": "number"
  }
  ```
- **Response**:
  - **Success**:
    - Returns the updated rating information.
    ```json
    {
      "status": "success",
      "data": {
        "recipeId": "string",
        "rating": "number",
        "message": "Rating updated successfully"
      }
    }
    ```
  - **Failure**:
    - Returns an error message if an internal server error occurs.
    ```json
    {
      "error": "Internal server error"
    }
    ```

<br>Detailed documentation can be found at: [API Docs](https://github.com/pnprathima/Recipe_Recommender/blob/master/API_Documentation.pdf)

## Technology Stack

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![NPM](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![JEST](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

<br>Detailed documentation can be found at: [TechStack Docs](https://github.com/pnprathima/Recipe_Recommender/blob/master/TechStack-Docs)

## Key Software Requirements

- [Node.js v18.17.1](https://nodejs.org/en/download/)
- [NPM v10.1.0](https://nodejs.org/en/download/)

## Project Setup Steps:

### Installation:

Check out our comprehensive YouTube video demonstrating each step for easy guidance. [Project Setup]()
-clone repository using `git clone https://github.com/SE-Fall24-RZA/Recipe_Recommender.git`

- setup for frontend
  open terminal and navigate to the **frontend** folder and execute the following:
  ```
  npm install
  ```
- setup for backend
  open terminal and navigate to the **backend** folder and execute the following:

  ```
  npm install
  ```

- Database Setup

  1. In the **backend** folder, make a copy of the `.env.sample` file, and name it `.env`

  2. Create a free account with MongoDB Atlas at this link: https://www.mongodb.com/products/platform/atlas-database

  3. Create a new free deployment cluster (name it whatever you like).

  4. After the cluster is created, follow along with the setup instructions provided. Make sure to add a user, and store the provided password somewhere.

  5. Press "Choose a connection method" and then select "Drivers"

  6. Copy the connection string and paste it into the 'RECIPES_DB_URI' value in the `.env` file from step 1. If necessary, replace <db_password> with the password from step 3.

  7. Press "Done". On the left side of the screen, click "Database". Then click on the name of your cluster. Click on the "Collections" tab. Create a new database and name it 'recipe_recommender'

  8. Add three collections titled 'user', 'recipe', and 'ingredient_list'. To add additional collections, hover over the database name, 'recipe_recommender' and press the small plus that appears.

  9. Return to the project's .env file. Replace the value in the 'GMAIL' field with the email you used to set up the Atlas account

- Ollama Setup (Optional, for chatbot functionality)

  1. Download Ollama for your machine from this link: https://ollama.com/download

  2. Once Ollama is installed, ensure its path is added to your system environment variables, if necessary

  3. Call `ollama run codeqwen`, and wait for the model to download

  ## Execution Steps

1.  start backend server using:
    ```
    npx nodemon
    ```
2.  start frontend server using:
    ```
    npm start
    ```
3.  Automatically a browser window is opened which shows frontend.
4.  run `npm test` for running the tests [Dependencies: Jest, Chai, Supertest]

## Release Made in this cycle <br>

Release Notes
  - Add Groceries List Feature
  - Included Hashing Of Passwords
  - Meal Plan page allowing users to plan out meals for each day of the week
  - Improved Bookmarks system
  - Ollama chatbot integration


### IDE and Code Formatter

- [Visual Studio Code](https://code.visualstudio.com/) IDE
- [Prettier Formatter for Visual Studio Code](https://github.com/prettier/prettier-vscode/blob/main/README.md)

## :page_facing_up: License <a name="License"></a>

This project is licensed under the terms of the MIT license. Please check [License](https://github.com/SE-Fall24-RZA/Recipe_Recommender/blob/group31-fall24/LICENSE) for more details.

## :pencil2: Contributions <a name="Contributions"></a>

Please see our [CONTRIBUTING.md](https://github.com/SE-Fall24-RZA/Recipe_Recommender/blob/group31-fall24/CONTRIBUTING.md) for instructions on how to contribute to the project by completing some of the issues.

## FUTURE SCOPE

1. Edit an Existing Recipe : Fully implement the functionality for editing a pre-existing recipe.  Whoever created the recipe should be able to make changes to any of the recipe’s details

2. Share Recipe By Link : Create a sharing method allowing a user to send a recipe to someone else via a link or QR Code. Upon opening this link, the recipient should be able to see all details about the recipe.

3. Grocery List : Users should be able to add ingredients from recipes to a separate grocery list tab. 

4. Security Enhancements : Incorporate encryption and hashing into the login functionality.  Passwords should be stored as salted and hashed, not as raw text.  Implement JSON Web Tokens to securely login users and keep track of who is logged in.  This will ensure the safety of any sensitive user data

## Team Members
Ishani Rajput - irajput@ncsu.edu <br>
Poorna Subramanian - psubra3@ncsu.edu <br>
Vaishnav Puram - vpuram@ncsu.edu <br>

## Troubleshooting and Support

Common issues observed and solutions:<br>

1. requirements.txt failing: this issue should no longer be seen, as we have used ~= to ensure your systems pick up versions compatible with the other packages. However, if you happen to see the issue, modify the requirements.txt file to use a more recent version.
2. python was not found: we recommend using python3 as some of the modules are available only on Python3. You may either install Python3 or setup a virtual environment(we suggest the latter if you are currently running other applications on python2)
   Facing other issues with the application? Mail us at any email listed above

<p align="center">Made with ❤️ on GitHub.</p>
