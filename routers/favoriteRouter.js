import { Router } from "express";
import favoriteControllers from "../controllers/favoriteController.js";
const favoriteRouter = Router();

favoriteRouter.route("/")
    .post(favoriteControllers.addFavorite)

favoriteRouter.get("/:userId", favoriteControllers.getFavorite)    
favoriteRouter.delete("/:id", favoriteControllers.deleteFavorite)    
export default favoriteRouter;