import React, { useEffect, useState } from "react";
import axios from "axios";

function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userName"); // Fetch user ID dynamically

  useEffect(() => {
    axios
      .get(`/api/my-recipes?userId=${userId}`)
      .then((response) => {
        setRecipes(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user recipes:", err);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div>Loading...</div>;

  if (recipes.length === 0) return <div>No recipes found!</div>;

  return (
    <div>
      <h1>My Recipes</h1>
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <div key={recipe._id} className="recipe-card">
            <h3>{recipe.title}</h3>
            <p>{recipe.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyRecipes;
