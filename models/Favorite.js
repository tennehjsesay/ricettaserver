import mongoose from "mongoose";
import { Schema } from "mongoose";

const favoriteSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    recipeId: {
        type: Number,
        required: true
    }
});

export default mongoose.model("Favorite", favoriteSchema);