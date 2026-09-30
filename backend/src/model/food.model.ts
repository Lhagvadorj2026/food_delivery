import { Schema, model } from "mongoose"
const foodSchema = new Schema({
    foodname: String,
    price: Number,
    image: String,
    ingredients: String,
    category: {
        type: Schema.Types.ObjectId,
        ref: "foodCategory",
    },
});
export const foodModel = model("food", foodSchema)