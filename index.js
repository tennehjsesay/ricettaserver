import express from "express";
import cors from "cors";
import { corsOptions } from "./config/corsOptions.js";
import cookieParser from "cookie-parser";
import authRouter from "./routers/authRouter.js";
import { configDotenv } from "dotenv";
import dbConn from "./config/dbConn.js";
import mongoose from "mongoose";
import verifyRouter from "./routers/verifyRouter.js";
import verifyJWT from "./middleware/verifyJWT.js";
import refreshRouter from "./routers/refreshRouter.js";
import logoutRouter from "./routers/logoutRouter.js";
import usersRouter from "./routers/usersRouter.js";
import signUpRouter from "./routers/signUpRouter.js";
import favoriteRouter from "./routers/favoriteRouter.js";
import axios from "axios";

configDotenv();
dbConn();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRouter);
app.use('/signup', signUpRouter);
app.use('/verify', verifyRouter);
app.use('/refresh', refreshRouter);
app.get('/recipes/random', async (req, res) => {
  try {
    const response = await axios.get(`https://api.spoonacular.com/recipes/random`, {
      params: {
        apiKey: process.env.RECIPE_API_KEY,
        number: 9
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.use(verifyJWT);
app.use('/signout', logoutRouter);
app.use('/users', usersRouter);
app.use('/favorite', favoriteRouter);
app.get('/recipes/complexSearch/:offset', async (req, res) => {
    const {offset} = req.params
  try {
    const response = await axios.get(`https://api.spoonacular.com/recipes/random`, {
      params: {
        apiKey: process.env.RECIPE_API_KEY,
        number: 20,
        offset
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});
app.get('/recipes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information`, {
      params: {
        apiKey: process.env.RECIPE_API_KEY
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

mongoose.connection.once('open', () => {
    console.log("Successfully Connected to MongoDB!");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})

