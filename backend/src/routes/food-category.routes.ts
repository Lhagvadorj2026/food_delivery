import { Hono } from "hono";
import { createFoodCategory, deletfootcategories, getfoodCategories } from "../controllers/food-category.controllers.js";

const foodCategoryRoute = new Hono();
foodCategoryRoute.post("/", createFoodCategory);
foodCategoryRoute.get("/", getfoodCategories);
foodCategoryRoute.delete("/:id", deletfootcategories)
export default foodCategoryRoute;
