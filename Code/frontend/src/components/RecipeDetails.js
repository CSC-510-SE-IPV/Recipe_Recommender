import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../apis/recipeDB";
import { Box, Text, Spinner, Avatar, Button, useToast } from "@chakra-ui/react";

const RecipeDetails = () => {
  const { id } = useParams(); // Get recipe ID from the URL
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast(); // Initialize useToast

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`/recipe/${id}`);
        setRecipe(response.data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleShareClick = () => {
    const recipeLink = `${window.location.origin}/recipe/${id}`;
    navigator.clipboard.writeText(recipeLink).then(() => {
      // Show a toast message
      toast({
        title: "Link copied to clipboard.",
        description: "You can share this link with others.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    });
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (!recipe) {
    return <Text>Recipe not found</Text>;
  }

  return (
    <Box p={5} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Text fontSize="2xl" fontWeight="bold">
        {recipe.TranslatedRecipeName}
      </Text>
      <Avatar src={recipe["image-url"]} size="xl" mt={3} />
      <Text mt={3}>Cooking Time: {recipe.TotalTimeInMins} mins</Text>
      <Text mt={3}>Cuisine: {recipe.Cuisine}</Text>
      <Text mt={3}>Diet Type: {recipe["Diet-type"]}</Text>
      <Text mt={3} fontWeight="bold">
        Ingredients:
      </Text>
      <Text>{recipe["Cleaned-Ingredients"].split("%").join(", ")}</Text>
      <Text mt={3} fontWeight="bold">
        Instructions:
      </Text>
      <Text>{recipe.TranslatedInstructions}</Text>
      
      {/* Share Recipe Button */}
      <Button
        mt={5}
        colorScheme="blue"
        onClick={handleShareClick}
      >
        Share Recipe
      </Button>
    </Box>
  );
};

export default RecipeDetails;