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
} from "@chakra-ui/react";
import Form from "./components/Form.js";
import Header from "./components/Header";
import recipeDB from "./apis/recipeDB";
import RecipeList from "./components/RecipeList";
import AddRecipe from "./components/AddRecipe.js";
import RecipeDetails from "./components/RecipeDetails";
import RecipeLoading from "./components/RecipeLoading.js";
import Nav from "./components/Navbar.js";
import SearchByRecipe from "./components/SearchByRecipe.js";
import Login from "./components/Login.js";
import UserProfile from "./components/UserProfile.js";
import LandingPage from "./components/LandingPage.js";
import BookMarksRecipeList from "./components/BookMarksRecipeList";
import UserMealPlan from "./components/UserMealPlan.js";
import ChatStream from "./components/chatbot.js";

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
      isChatOpen: false,
      userData: {
        bookmarks: [],
      },
    };
  }

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
    this.getRecipeDetails(items, formDict["cuisine"], formDict["email_id"], formDict["flag"]);
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
    return (
      <Router>
        <Nav
          handleLogout={() => this.setState({ isLoggedIn: false })}
          handleBookMarks={this.handleBookMarks}
          handleMealPlan={this.handleMealPlan}
          user={this.state.isLoggedIn ? this.state.userData : null}
        />
        <Routes>
          <Route
            path="/"
            element={
              this.state.isLoggedIn ? (
                <Tabs variant="soft-rounded" colorScheme="green">
                  <TabList ml={10}>
                    <Tab>Search Recipe</Tab>
                    <Tab>Add Recipe</Tab>
                    <Tab>Search Recipe By Name</Tab>
                    <Tab>Recipe Bot</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <Box display="flex">
                        <Form sendFormData={this.handleSubmit} />
                        {this.state.isLoading ? (
                          <RecipeLoading />
                        ) : (
                          <RecipeList recipes={this.state.recipeList} />
                        )}
                      </Box>
                    </TabPanel>
                    <TabPanel>
                      <AddRecipe />
                    </TabPanel>
                    <TabPanel>
                      <SearchByRecipe sendRecipeData={this.handleRecipesByName} />
                      {this.state.isLoading ? (
                        <RecipeLoading />
                      ) : (
                        <RecipeList recipes={this.state.recipeByNameList} />
                      )}
                    </TabPanel>
                    <TabPanel>
                      <Button
                        onClick={this.handleToggleChat}
                        colorScheme={this.state.isChatOpen ? "blue" : "green"}
                      >
                        {this.state.isChatOpen
                          ? "Close existing chat window"
                          : "Start a new chat"}
                      </Button>
                      {this.state.isChatOpen && <ChatStream />}
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              ) : (
                <LandingPage
                  onGetStarted={() => this.setState({ isLoggedIn: true })}
                />
              )
            }
          />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
