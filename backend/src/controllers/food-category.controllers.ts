import { Context } from "hono";
import { connectDb } from "../lib/mongodb.js";
import { FoodCategoryModel } from "../model/foot-category.model.js";

export const createFoodCategory = async (c: Context) => {
    await connectDb();
    const input = await c.req.json();
    await FoodCategoryModel.create({
        categoryName: input.categoryName,
    });
    return c.json({
        message: "Successfully created food category",
    });
}
export const getfoodCategories = async (c: Context) => {
    await connectDb();
    const foodCategories = await FoodCategoryModel.find();
    return c.json({
        message: "category",
        foodCategories,
    })
}
export const deletfootcategories = async (c: Context) => {
    await connectDb();
    const id = c.req.param("id")
    await FoodCategoryModel.findByIdAndDelete(id)
    return c.json({
        message: "amjilttai ustlaa"
    })
}
