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
import { Input, List, ListItem, Text, Stack, IconButton, useToast } from "@chakra-ui/react";
import { MdDelete } from "react-icons/md"; // Importing an icon for remove button
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

export default App;
