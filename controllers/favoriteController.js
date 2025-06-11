import Favorite from "../models/Favorite.js";

const favoriteControllers =  {
    getFavorite: async (req, res) => {
        const {userId} = req?.params;
        const result = await Favorite.find({userId});
        res.status(200).json(result);
    },
    addFavorite: async (req, res) => {
        const {userId, recipeId, image, title} = req?.body;
        if(!userId || !recipeId || !image || !title) return res.status(400).json({"message": "Every field is required!"});
        const result = await Favorite.create({userId, recipeId, image, title});
        res.status(201).json({"message": "Successfully saved!"});
    },
    deleteFavorite: async (req, res) => {
        const { id } = req?.params;
        if(!id) return res.status(400).json({"message": "Recipe Id is required!"});
        const result = await Favorite.deleteOne({_id:id}).exec();
        if(result.acknowledged) res.json({"message": `Successfully deleted ${id}`}); 
    }
}

export default favoriteControllers