import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Box,
  Button,
  Input,
  List,
  ListItem,
  Text,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";
import recipeDB from "./apis/recipeDB";
import RecipeLoading from "./components/RecipeLoading.js";
import Nav from "./components/Navbar.js";
import SearchByRecipe from "./components/SearchByRecipe.js";
import Login from "./components/Login.js";
import UserProfile from "./components/UserProfile.js";
import LandingPage from "./components/LandingPage.js";
import BookMarksRecipeList from "./components/BookMarksRecipeList";
import UserMealPlan from "./components/UserMealPlan.js";
import ChatStream from "./components/chatbot.js"; // Import ChatStream
import RecipeList from "./components/RecipeList.js";
import AddRecipe from "./components/AddRecipe.js";
import RecipeDetails from "./components/RecipeDetails.js";
import Form from "./components/Form.js";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cuisine: "",
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
      isChatOpen: false, // State to track chatbot visibility
      groceryList: [],
      newGroceryItem: "",
      userData: {
        bookmarks: [],
      },
    };
  }

  handleAddToGroceryList = (item) => {
    if (item) {
      this.setState((prevState) => ({
        groceryList: [...prevState.groceryList, item],
        newGroceryItem: "",
      }));
    }
  };

  handleRemoveFromGroceryList = (item) => {
    this.setState((prevState) => ({
      groceryList: prevState.groceryList.filter(
        (groceryItem) => groceryItem !== item
      ),
    }));
  };

  handleToggleChat = () => {
    this.setState((prevState) => ({
      isChatOpen: !prevState.isChatOpen, // Toggle chatbot visibility
    }));
  };

  handleBookMarks = async () => {
    const userName = localStorage.getItem("userName");
    try {
      const response = await recipeDB.get("/recipes/getBookmarks", {
        params: { userName },
      });
      this.setState({
        isProfileView: true,
        userData: {
          ...this.state.userData,
          bookmarks: response.data.recipes,
        },
      });
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    }
  };

  handleMealPlan = () => {
    this.setState({
      isProfileView: false,
      isMealPlanView: true,
    });
  };

  handleProfileView = () => {
    this.setState({
      isProfileView: false,
      isMealPlanView: false,
    });
  };

  handleSignup = async (userName, password) => {
    try {
      const response = await recipeDB.post("/recipes/signup", {
        userName,
        password,
      });
      if (response.data.success) {
        alert("Successfully Signed up!");
        this.setState({
          isLoggedIn: true,
          userData: response.data.user,
        });
        localStorage.setItem("userName", response.data.user.userName);
      } else {
        alert("User already exists");
      }
    } catch (err) {
      console.log(err);
    }
  };

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
          isLoggedIn: true,
          userData: response.data.user,
        });
        localStorage.setItem("userName", response.data.user.userName);
        alert("Successfully logged in!");
      } else {
        alert(response.data.message || "An error occurred");
      }
    } catch (err) {
      console.log("An error occurred:", err);
      alert("Login failed. Please try again.");
    }
  };

  handleSubmit = async (formDict) => {
    this.setState({ isLoading: true });
    this.setState({
      ingredients: formDict["ingredient"],
      cuisine: formDict["cuisine"],
      email: formDict["email_id"],
      flag: formDict["flag"],
    });
    const items = Array.from(formDict["ingredient"]);
    this.getRecipeDetails(items, formDict["cuisine"], formDict["email_id"], formDict["flag"]);
  };

  handleRecipesByName = (recipeName) => {
    this.setState({ isLoading: true, searchName: recipeName });
    recipeDB
      .get("/recipes/getRecipeByName", {
        params: { recipeName },
      })
      .then((res) => {
        this.setState({
          recipeByNameList: res.data.recipes,
          isLoading: false,
        });
      });
  };

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
        recipeList: response.data.recipes,
        isLoading: false,
      });
    } catch (err) {
      console.log(err);
    }
  };

  editRecipe = async (recipeId, updatedData) => {
    try {
      const response = await recipeDB.put(
        `/recipes/updateRecipe/${recipeId}`,
        updatedData
      );
      if (response.status === 200) {
        alert("Recipe updated successfully!");
        this.setState((prevState) => ({
          recipeList: prevState.recipeList.map((recipe) =>
            recipe._id === recipeId ? { ...recipe, ...updatedData } : recipe
          ),
          recipeByNameList: prevState.recipeByNameList.map((recipe) =>
            recipe._id === recipeId ? { ...recipe, ...updatedData } : recipe
          ),
        }));
      }
    } catch (error) {
      console.error("Failed to update recipe:", error);
      alert("Error updating the recipe. Please try again.");
    }
  };

  render() {
    return (
      <Router>
        <Nav
          handleLogout={() => this.setState({ isLoggedIn: false, userData: {} })}
          handleBookMarks={this.handleBookMarks}
          handleMealPlan={this.handleMealPlan}
          user={this.state.isLoggedIn ? this.state.userData : null}
        />
        <Routes>
          <Route
            path="/recipe/:id"
            element={<RecipeDetails />}
          />
          <Route
            path="/login"
            element={
              <Login
                handleSignup={this.handleSignup}
                handleLogin={this.handleLogin}
              />
            }
          />
          <Route
            path="/"
            element={
              this.state.isLoggedIn ? (
                this.state.isProfileView ? (
                  <UserProfile
                    handleProfileView={this.handleProfileView}
                    user={this.state.userData}
                  >
                    <BookMarksRecipeList
                      recipes={this.state.userData.bookmarks}
                    />
                  </UserProfile>
                ) : this.state.isMealPlanView ? (
                  <UserMealPlan
                    handleProfileView={this.handleProfileView}
                    user={this.state.userData}
                  />
                ) : (
                  <Tabs variant="soft-rounded" colorScheme="green">
                    <TabList>
                      <Tab>Search Recipe</Tab>
                      <Tab>Add Recipe</Tab>
                      <Tab>Search Recipe By Name</Tab>
                      <Tab>Recipe Bot</Tab>
                      <Tab>Grocery List</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                        <Box display="flex">
                          <Form sendFormData={this.handleSubmit} />
                          {this.state.isLoading ? (
                            <RecipeLoading />
                          ) : (
                            <RecipeList
                              recipes={this.state.recipeList}
                              editRecipe={this.editRecipe}
                            />
                          )}
                        </Box>
                      </TabPanel>
                      <TabPanel>
                        <AddRecipe />
                      </TabPanel>
                      <TabPanel>
                        <SearchByRecipe
                          sendRecipeData={this.handleRecipesByName}
                        />
                        {this.state.isLoading ? (
                          <RecipeLoading />
                        ) : (
                          <RecipeList
                            recipes={this.state.recipeByNameList}
                            refresh={this.handleRecipesByName}
                            searchName={this.state.searchName}
                          />
                        )}
                      </TabPanel>
                      <TabPanel>
                        <Button
                          onClick={this.handleToggleChat}
                          colorScheme={this.state.isChatOpen ? "blue" : "green"}
                          variant="solid"
                          size="lg"
                          borderRadius="md"
                          boxShadow="md"
                          _hover={{
                            bg: this.state.isChatOpen
                              ? "blue.600"
                              : "green.600",
                            transform: "scale(1.05)",
                          }}
                          _active={{
                            bg: this.state.isChatOpen
                              ? "blue.700"
                              : "green.700",
                            transform: "scale(0.95)",
                          }}
                        >
                          {this.state.isChatOpen
                            ? "Close existing chat window"
                            : "Start a new chat"}
                        </Button>
                        {this.state.isChatOpen && <ChatStream />}
                      </TabPanel>
                      <TabPanel>
                        <Box
                          p={8}
                          bg="gray.50"
                          borderRadius="xl"
                          boxShadow="lg"
                          maxWidth="500px"
                          mx="auto"
                        >
                          <Text
                            fontSize="3xl"
                            fontWeight="bold"
                            mb={6}
                            textAlign="center"
                            color="teal.600"
                          >
                            Grocery List
                          </Text>
                          <Flex direction="column" mb={6}>
                            <Input
                              value={this.state.newGroceryItem}
                              onChange={(e) =>
                                this.setState({ newGroceryItem: e.target.value })
                              }
                              placeholder="Add an item to the grocery list"
                              size="lg"
                              borderColor="teal.300"
                              focusBorderColor="teal.500"
                              mb={4}
                            />
                            <Button
                              colorScheme="teal"
                              size="lg"
                              onClick={() =>
                                this.handleAddToGroceryList(
                                  this.state.newGroceryItem
                                )
                              }
                              isDisabled={!this.state.newGroceryItem.trim()}
                            >
                              Add to List
                            </Button>
                          </Flex>
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
                                <Text
                                  fontSize="lg"
                                  fontWeight="semibold"
                                  color="gray.700"
                                >
                                  {item}
                                </Text>
                                <IconButton
                                  aria-label="Remove from grocery list"
                                  icon={<MdDelete />}
                                  colorScheme="red"
                                  size="sm"
                                  onClick={() =>
                                    this.handleRemoveFromGroceryList(item)
                                  }
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
                )
              ) : (
                <LandingPage
                  onGetStarted={() => this.setState({ isLoggedIn: true })}
                />
              )
            }
          />
        </Routes>
      </Router>
    );
  }
}

export default App;
