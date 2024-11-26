//
import Form from "./components/Form.js";
import Header from "./components/Header";
import recipeDB from "./apis/recipeDB";
import RecipeList from "./components/RecipeList";
import AddRecipe from "./components/AddRecipe.js";
import React, { Component } from "react";
import {
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Box,
  Button,
  Flex,
} from "@chakra-ui/react";
import { Input, List, ListItem, Text, Stack, IconButton, useToast } from "@chakra-ui/react";
import { MdDelete } from "react-icons/md"; // Importing an icon for remove button
import RecipeLoading from "./components/RecipeLoading.js";
import Nav from "./components/Navbar.js";
import SearchByRecipe from "./components/SearchByRecipe.js";
import Login from "./components/Login.js";
import UserProfile from "./components/UserProfile.js";
import LandingPage from "./components/LandingPage.js";
import BookMarksRecipeList from "./components/BookMarksRecipeList"; // Import BookMarksRecipeList
import UserMealPlan from "./components/UserMealPlan.js";
import ChatStream from "./components/chatbot.js";

// Main component of the project
class App extends Component {
  // Constructor for the App Component
  constructor(props) {
    super(props);

    // Initialize state variables for managing app state
    this.state = {
      cuisine: "",
      //NoIngredients : 0,
      ingredients: new Set(),
      recipeList: [],
      recipeByNameList: [],
      searchName: "",
      email: "",
      flag: false,
      isLoading: false,
      isLoggedIn: false,
      isProfileView: false,
      isMealPlanView: false,
      newGroceryItem: "",
      groceryList: [],
      isChatOpen: false,
      userData: {
        bookmarks: [], // List of user bookmarks
      },
    };
  }
  handleAddToGroceryList = (item) => {
    if (item) {
      this.setState((prevState) => ({
        groceryList: [...prevState.groceryList, item],
        newGroceryItem: "", // Clear input field after adding
      }));
    }
  };

  handleRemoveFromGroceryList = (item) => {
    this.setState((prevState) => ({
      groceryList: prevState.groceryList.filter((groceryItem) => groceryItem !== item),
    }));
  };

  handleToggleChat = () => {
    this.setState((prevState) => ({
      isChatOpen: !prevState.isChatOpen,
    }));
  };

  handleBookMarks = () => {
    this.setState({
      isProfileView: true,
      isMealPlanView: false,
    });
  };

  // Function to handle switching to meal plan view
  handleMealPlan = () => {
    this.setState({
      isProfileView: false,
      isMealPlanView: true,
    });
  };

  // Function to reset profile and meal plan views
  handleProfileView = () => {
    this.setState({
      isProfileView: false,
      isMealPlanView: false,
    });
  };

  // Function to handle user signup
  handleSignup = async (userName, password) => {
    try {
      const response = await recipeDB.post("/recipes/signup", {
        userName,
        password,
      });
      console.log(response.data);
      if (response.data.success) {
        alert("Successfully Signed up!");
        this.setState({
          isLoggedIn: true,
          userData: response.data.user, // Set user data from response
        });
        localStorage.setItem("userName", response.data.user.userName); // Store username in local storage
        console.log(response.data.user);
      } else {
        alert("User already exists"); // Handle case where user already exists
      }
    } catch (err) {
      console.log(err); // Log any errors during signup
    }
  };

  // Function to handle user login
  handleLogin = async (userName, password) => {
    try {
      const response = await recipeDB.get("/recipes/login", {
        params: {
          userName,
          password,
        },
      });

      if (response.data.success) {
        this.setState({
          isLoggedIn: true, // Set logged-in state
          userData: response.data.user, // Set user data from response
        });
        localStorage.setItem("userName", response.data.user.userName); // Store username in local storage
        alert("Successfully logged in!"); // Alert user of successful login
      } else {
        const errorMessage = response.data.message || "An error occurred"; // Get error message
        console.log(errorMessage);
        alert(errorMessage); // Display specific message based on response
      }
    } catch (err) {
      console.log("An error occurred:", err);
      alert(
        "An error occurred while trying to log in. Please try again later."
      ); // Handle errors during login
    }
  };

  // Function to get user input from the Form component on submit action
  handleSubmit = async (formDict) => {
    this.setState({
      isLoading: true, // Set loading state while fetching recipes
    });
    console.log(formDict);
    this.setState({
      ingredients: formDict["ingredient"], // Update ingredients in state
      cuisine: formDict["cuisine"], // Update cuisine in state
      email: formDict["email_id"], // Update email in state
      flag: formDict["flag"], // Update flag in state
    });

    const mail = formDict["email_id"];
    const flag = formDict["flag"];
    const items = Array.from(formDict["ingredient"]); // Convert Set to Array for API call
    const cuis = formDict["cuisine"];
    this.getRecipeDetails(items, cuis, mail, flag); // Fetch recipes based on user input
  };

  // Function to search for recipes by name
  handleRecipesByName = (recipeName) => {
    this.setState({
      isLoading: true, // Set loading state while fetching recipes
      searchName: recipeName, // Update search name in state
    });
    recipeDB
      .get("/recipes/getRecipeByName", {
        params: {
          recipeName: recipeName,
        },
      })
      .then((res) => {
        console.log(res.data);
        this.setState({
          recipeByNameList: res.data.recipes, // Update recipes found by name in state
          isLoading: false, // Set loading state to false
        });
      });
  };

  // Function to get recipes based on ingredients, cuisine, email, and flag
  getRecipeDetails = async (ingredient, cuis, mail, flag) => {
    try {
      const response = await recipeDB.get("/recipes", {
        params: {
          CleanedIngredients: ingredient,
          Cuisine: cuis,
          Email: mail,
          Flag: flag,
        },
      });
      this.setState({
        recipeList: response.data.recipes, // Update recipe list with fetched data
        isLoading: false, // Set loading state to false
      });
    } catch (err) {
      console.log(err); // Log any errors during recipe fetching
    }
  };

  // Function to handle user logout
  handleLogout = () => {
    console.log("logged out");
    this.setState({
      isLoggedIn: false, // Reset logged-in state
      userData: {}, // Clear user data
    });
  };

  // Function to handle fetching bookmarks when navigating to profile view
  handleBookMarks = async () => {
    const userName = localStorage.getItem("userName"); // Get username from local storage
    try {
      const response = await recipeDB.get("/recipes/getBookmarks", {
        params: { userName },
      });
      this.setState({
        isProfileView: true, // Set profile view to true
        userData: {
          ...this.state.userData,
          bookmarks: response.data.recipes, // Set fetched bookmarks to state
        },
      });
    } catch (err) {
      console.error("Error fetching bookmarks", err); // Log errors fetching bookmarks
    }
  };

  // Function to remove a bookmark
  handleRemoveBookmark = async (recipeId) => {
    const userName = localStorage.getItem("userName"); // Get username from local storage

    try {
      const response = await recipeDB.post("/recipes/removeBookmark", {
        userName,
        recipeId,
      });

      if (response.data.success) {
        this.setState((prevState) => ({
          userData: {
            ...prevState.userData,
            bookmarks: prevState.userData.bookmarks.filter(
              (recipe) => (recipe.id || recipe._id) !== recipeId // Remove based on recipeId
            ),
          },
        }));
      } else {
        throw new Error(response.data.message || "Failed to remove bookmark");
      }
    } catch (error) {
      console.error("Failed to remove bookmark:", error); // Log errors during bookmark removal
    }
  };

  // Function to edit a recipe
  editRecipe = async (recipeId, updatedData) => {
    try {
      const response = await recipeDB.put(
        `/recipes/updateRecipe/${recipeId}`,
        updatedData
      );
      if (response.status === 200) {
        alert("Recipe updated successfully!"); // Alert user on successful update
        // Refresh the recipes list or a specific recipe if needed
        this.setState((prevState) => ({
          recipeList: prevState.recipeList.map(
            (recipe) =>
              recipe._id === recipeId ? { ...recipe, ...updatedData } : recipe // Update recipe data in state
          ),
          recipeByNameList: prevState.recipeByNameList.map(
            (recipe) =>
              recipe._id === recipeId ? { ...recipe, ...updatedData } : recipe // Update recipe data in state
          ),
        }));
      }
    } catch (error) {
      console.error("Failed to update recipe:", error); // Log errors during recipe update
      alert("Error updating the recipe. Please try again."); // Alert user on error
    }
  };

  // Function to reset profile and meal plan views
  handleProfileView = () => {
    this.setState({
      isProfileView: false,
      isMealPlanView: false,
    });
  };

  // Render method to display the component
  render() {
    return (
      <div>
        <Nav
          handleLogout={this.handleLogout} // Logout function passed to Nav
          handleBookMarks={this.handleBookMarks} // Bookmarks function passed to Nav
          handleMealPlan={this.handleMealPlan} // Meal plan function passed to Nav
          user={this.state.isLoggedIn ? this.state.userData : null} // Pass user data if logged in
          onLoginClick={() => this.setState({ isLoggedIn: false })} // Handle login click
        />
        {this.state.isLoggedIn ? ( // Conditional rendering based on login state
          <>
            {this.state.isProfileView ? ( // Render UserProfile if in profile view
              <UserProfile
                handleProfileView={this.handleProfileView}
                user={this.state.userData}
              >
                {}
                <BookMarksRecipeList
                  recipes={this.state.userData.bookmarks} // Pass bookmarks to BookMarksRecipeList
                />
              </UserProfile>
            ) : this.state.isMealPlanView ? ( // Render UserMealPlan if in meal plan view
              <UserMealPlan
                handleProfileView={this.handleProfileView}
                user={this.state.userData}
              ></UserMealPlan>
            ) : (
              // Render tabs for recipe searching and adding
              <Tabs variant='soft-rounded' colorScheme='green'>
                <TabList ml={10}>
                  <Tab>Search Recipe</Tab>
                  <Tab>Add Recipe</Tab>
                  <Tab>Search Recipe By Name</Tab>
                  <Tab>Recipe Bot</Tab>
                  <Tab>Grocery List</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Box display='flex'>
                      <Form sendFormData={this.handleSubmit} />
                      {this.state.isLoading ? ( // Conditional rendering of loading state
                        <RecipeLoading /> // Show loading indicator if loading
                      ) : (
                        <RecipeList
                          recipes={this.state.recipeList} // Pass fetched recipes to RecipeList
                          editRecipe={this.editRecipe} // Pass edit function to RecipeList
                        />
                      )}
                    </Box>
                  </TabPanel>
                  <TabPanel>
                    <AddRecipe />
                  </TabPanel>
                  <TabPanel>
                    <SearchByRecipe sendRecipeData={this.handleRecipesByName} />{" "}
                    {this.state.isLoading ? ( // Conditional rendering of loading state
                      <RecipeLoading /> // Show loading indicator if loading
                    ) : (
                      <RecipeList
                        recipes={this.state.recipeByNameList} // Pass fetched recipes by name to RecipeList
                        refresh={this.handleRecipesByName} // Pass refresh function to RecipeList
                        searchName={this.state.searchName} // Pass search name to RecipeList
                      />
                    )}
                  </TabPanel>
                  <TabPanel>
                    <Button
                      onClick={this.handleToggleChat}
                      colorScheme={this.state.isChatOpen ? "blue" : "green"} // Change color based on state
                      variant='solid'
                      size='lg' // Larger button
                      borderRadius='md' // Rounded corners
                      boxShadow='md' // Add a subtle shadow for depth
                      _hover={{
                        bg: this.state.isChatOpen ? "blue.600" : "green.600", // Darker shade on hover
                        transform: "scale(1.05)", // Slightly enlarge on hover
                      }}
                      _active={{
                        bg: this.state.isChatOpen ? "blue.700" : "green.700", // Darker shade when active
                        transform: "scale(0.95)", // Slightly shrink when clicked
                      }}
                    >
                      {this.state.isChatOpen
                        ? "Close existing chat window"
                        : "Start a new chat"}
                    </Button>
                    {this.state.isChatOpen && <ChatStream />}
                  </TabPanel>
                  <TabPanel>
                  <Box p={8} bg="gray.50" borderRadius="xl" boxShadow="lg" maxWidth="500px" mx="auto">
        <Text fontSize="3xl" fontWeight="bold" mb={6} textAlign="center" color="teal.600">
          Grocery List
        </Text>

        {/* Input field to add new items */}
        <Flex direction="column" mb={6}>
          <Input
            value={this.state.newGroceryItem}
            onChange={(e) => this.setState({ newGroceryItem: e.target.value })}
            placeholder="Add an item to the grocery list"
            size="lg"
            borderColor="teal.300"
            focusBorderColor="teal.500"
            mb={4}
          />
          <Button
            colorScheme="teal"
            size="lg"
            onClick={() => this.handleAddToGroceryList(this.state.newGroceryItem)}
            isDisabled={!this.state.newGroceryItem.trim()}
          >
            Add to List
          </Button>
        </Flex>

        {/* Grocery list */}
        <List spacing={4}>
          {this.state.groceryList.map((item, index) => (
            <ListItem
              key={index}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bg="white"
              boxShadow="sm"
              _hover={{ bg: "teal.50", cursor: "pointer" }}
            >
              <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                {item}
              </Text>
              <IconButton
                aria-label="Remove from grocery list"
                icon={<MdDelete />}
                colorScheme="red"
                size="sm"
                onClick={() => this.handleRemoveFromGroceryList(item)}
                variant="outline"
                _hover={{ bg: "red.100" }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            )}
          </>
        ) : (
          <>
            {this.state.showLogin ? ( // Show Login component if showLogin state is true
              <Login
                handleSignup={this.handleSignup} // Pass signup function to Login
                handleLogin={this.handleLogin} // Pass login function to Login
              />
            ) : (
              <LandingPage
                onGetStarted={() => this.setState({ showLogin: true })} // Show LandingPage and handle getting started
              />
            )}
          </>
        )}
      </div>
    );
  }
}

export default App; // Export the App component as the default export
