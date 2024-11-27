import app from "./server.js";
import * as mongodb from "mongodb";
import dotenv from "dotenv";
import recipesDAO from "./dao/recipesDAO.js";

// Load environment variables
dotenv.config();

const MongoClient = mongodb.MongoClient;

// Get port from environment or default to 8000
const port = process.env.PORT || 8000;

// Ensure RECIPES_DB_URI is defined
if (!process.env.RECIPES_DB_URI) {
  console.error("Error: RECIPES_DB_URI is not defined in the environment variables.");
  process.exit(1);
}

// MongoDB connection and server initialization
MongoClient.connect(process.env.RECIPES_DB_URI, {
  maxPoolSize: 50, // Max connections in the pool
  wtimeoutMS: 2500, // Timeout after 2.5 seconds
})
  .then(async (client) => {
    // Inject database client into DAO
    await recipesDAO.injectDB(client);
    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.stack);
    process.exit(1); // Exit the process on failure
  });