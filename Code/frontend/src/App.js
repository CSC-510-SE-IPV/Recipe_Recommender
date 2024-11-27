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
  useToast,
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
import ChatStream from "./components/chatbot.js";
import RecipeList from "./components/RecipeList.js";
import AddRecipe from "./components/AddRecipe.js";
import RecipeDetails from "./components/RecipeDetails.js";
import Form from "./components/Form.js"; // Import Form

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
      newGroceryItem: "",
      groceryList: [],
      isChatOpen: false,
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
      isChatOpen: !prevState.isChatOpen,
    }));
  };

  handleBookMarks = () => {
    this.setState({
      isProfileView: true,
      isMealPlanView: false,
    });
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

  handleSubmit = async (formDict) => {
    this.setState({
      isLoading: true,
    });

    this.setState({
      ingredients: formDict["ingredient"],
      cuisine: formDict["cuisine"],
      email: formDict["email_id"],
      flag: formDict["flag"],
    });

    const items = Array.from(formDict["ingredient"]);
    this.getRecipeDetails(
      items,
      formDict["cuisine"],
      formDict["email_id"],
      formDict["flag"]
    );
  };

  handleRecipesByName = (recipeName) => {
    this.setState({
      isLoading: true,
      searchName: recipeName,
    });
    recipeDB
      .get("/recipes/getRecipeByName", {
        params: {
          recipeName: recipeName,
        },
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

  render() {
    const { toastInstance } = this.props; // Access toast instance from props

    return (
      <Router>
        <Nav
          handleLogout={this.handleLogout}
          handleBookMarks={this.handleBookMarks}
          handleMealPlan={this.handleMealPlan}
          user={this.state.isLoggedIn ? this.state.userData : null}
          onLoginClick={() => this.setState({ isLoggedIn: false })}
        />
        <Routes>
          <Route
            path="/recipe/:id"
            element={
              <RecipeDetails
                showToast={(message) => {
                  toastInstance({
                    title: message,
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                  });
                }}
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
                    <TabList ml={10}>
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
                              showToast={(message) => {
                                toastInstance({
                                  title: message,
                                  status: "success",
                                  duration: 2000,
                                  isClosable: true,
                                });
                              }}
                            />
                          )}
                        </Box>
                      </TabPanel>
                      {/* Other Panels */}
                    </TabPanels>
                  </Tabs>
                )
              ) : (
                <LandingPage
                  onGetStarted={() => this.setState({ showLogin: true })}
                />
              )
            }
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
        </Routes>
      </Router>
    );
  }
}

export default function AppWrapper() {
  const toast = useToast();

  return <App toastInstance={toast} />;
}
