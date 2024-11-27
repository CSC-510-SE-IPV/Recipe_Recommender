import React, { useState, useEffect } from "react";
import {
  Avatar,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalOverlay,
  ModalHeader,
  ModalFooter,
  ModalContent,
  Box,
  SimpleGrid,
  Text,
  Button,
  Input,
  Textarea,
  useToast, // Import useToast
} from "@chakra-ui/react";
import RecipeCard from "./RecipeCard";
import Rating from "./Rating";
import RateRecipe from "./RateRecipe";
import recipeDB from "../apis/recipeDB"; // API configuration

const RecipeList = ({ refresh, searchName }) => {
  const [recipes, setRecipes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState({});
  const [isChange, setIsChange] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const toast = useToast(); // Initialize useToast

  useEffect(() => {
    fetchRecipes();
  }, [searchName]);

  const fetchRecipes = () => {
    recipeDB
      .get("/recipes")
      .then((response) => {
        setRecipes(response.data.recipes); // Adjust based on API response structure
      })
      .catch((err) => {
        console.error("Error fetching recipes:", err);
      });
  };

  const youtube_videos =
    "https://www.youtube.com/results?search_query=how+to+make+" +
    currentRecipe["TranslatedRecipeName"];

  const handleViewRecipe = (data) => {
    setIsOpen(true);
    setCurrentRecipe({
      ...data,
      Ingredients: data["Cleaned-Ingredients"].split("%"),
    });
    setIsEditing(false);
  };

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleInputChange = (field, value) => {
    setCurrentRecipe((prevRecipe) => ({
      ...prevRecipe,
      [field]: value,
    }));
  };

  const handleSaveEdit = () => {
    if (!currentRecipe.TranslatedRecipeName) {
      alert("Recipe name cannot be empty!");
      return;
    }

    recipeDB
      .put(`/updateRecipe/${currentRecipe._id}`, currentRecipe)
      .then(() => {
        setIsChange(true);
        setIsEditing(false);
        alert("Recipe updated successfully!");
        refresh(searchName); // Reload updated recipes
      })
      .catch((err) => {
        console.error("Error saving recipe:", err);
        alert("Failed to update recipe. Please try again.");
      });
  };

  const handleShareRecipe = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/recipe/${currentRecipe._id}`)
      .then(() => {
        toast({
          title: "Link copied to clipboard.",
          description: "You can share this link with others.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
        toast({
          title: "Failed to copy link.",
          description: "Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const onClose = () => {
    setIsOpen(false);
    setCurrentRecipe({});
    if (isChange) {
      refresh(searchName); // Refresh list if changes are made
    }
  };

  return (
    <>
      <Box
        borderRadius={"lg"}
        border="1px"
        boxShadow="lg"
        borderColor="gray.200"
        fontFamily="sans-serif"
        m={10}
        width={"80%"}
        p={5}
        bg="white"
      >
        <Text fontSize="2xl" fontWeight="bold" mb={5} textAlign="center">
          Recipe Collection
        </Text>
        <SimpleGrid
          spacing={5}
          templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
        >
          {recipes.length !== 0 ? (
            recipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                handler={handleViewRecipe}
                recipe={recipe}
              />
            ))
          ) : (
            <Text data-testid="noResponseText" fontSize={"lg"} color={"gray"}>
              Searching for a recipe?
            </Text>
          )}
        </SimpleGrid>
      </Box>

      <Modal size={"6xl"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent data-testid="recipeModal">
          <ModalHeader fontSize="xl" fontWeight="bold">
            {isEditing ? (
              <Input
                value={currentRecipe.TranslatedRecipeName || ""}
                onChange={(e) =>
                  handleInputChange("TranslatedRecipeName", e.target.value)
                }
              />
            ) : (
              currentRecipe.TranslatedRecipeName || "Recipe Details"
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex align="flex-start" mb={4}>
              <Avatar
                size="2xl"
                mr={4}
                src={currentRecipe["image-url"]}
                borderRadius="md"
              />
              <Box flex="1">
                <Text fontSize="lg" fontWeight="bold" mb={1}>
                  Cooking Time:{" "}
                  {isEditing ? (
                    <Input
                      value={currentRecipe.TotalTimeInMins || ""}
                      onChange={(e) =>
                        handleInputChange("TotalTimeInMins", e.target.value)
                      }
                    />
                  ) : (
                    `${currentRecipe.TotalTimeInMins} mins`
                  )}
                </Text>
                <Flex align="center" mb={2}>
                  <Text fontWeight="bold" mr={2}>
                    Rating:
                  </Text>
                  <Rating rating={currentRecipe["Recipe-rating"]} />
                </Flex>
                <Text mb={2}>
                  <Text as={"b"}>Diet Type:</Text>{" "}
                  {isEditing ? (
                    <Input
                      value={currentRecipe["Diet-type"] || ""}
                      onChange={(e) =>
                        handleInputChange("Diet-type", e.target.value)
                      }
                    />
                  ) : (
                    currentRecipe["Diet-type"]
                  )}
                </Text>
                <Text mb={2}>
                  <Text as={"b"}>Cuisine:</Text>{" "}
                  {isEditing ? (
                    <Input
                      value={currentRecipe["Cuisine"] || ""}
                      onChange={(e) =>
                        handleInputChange("Cuisine", e.target.value)
                      }
                    />
                  ) : (
                    currentRecipe["Cuisine"]
                  )}
                </Text>
                <Text mb={2}>
                  <Text as={"b"}>Ingredients:</Text>{" "}
                  {isEditing ? (
                    <Textarea
                      value={currentRecipe["Ingredients"]?.join(", ") || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "Ingredients",
                          e.target.value.split(", ")
                        )
                      }
                    />
                  ) : (
                    currentRecipe["Ingredients"]?.join(", ")
                  )}
                </Text>
                <Text mb={2}>
                  <Text as={"b"}>Instructions:</Text>{" "}
                  {isEditing ? (
                    <Textarea
                      value={currentRecipe["TranslatedInstructions"] || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "TranslatedInstructions",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    currentRecipe["TranslatedInstructions"]
                  )}
                </Text>
                <Text color="blue.500">
                  <a
                    href={youtube_videos}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Watch on YouTube for more recipes
                  </a>
                </Text>
              </Box>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <RateRecipe recipe={currentRecipe} setChange={setIsChange} />
            {isEditing ? (
              <>
                <Button colorScheme="teal" mr={3} onClick={handleSaveEdit}>
                  Save
                </Button>
                <Button onClick={handleEditToggle}>Cancel</Button>
              </>
            ) : (
              <Button colorScheme="yellow" mr={3} onClick={handleEditToggle}>
                Edit Recipe
              </Button>
            )}
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleShareRecipe} // Use the new share handler
            >
              Share Recipe
            </Button>
            <Button colorScheme="teal" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RecipeList;
