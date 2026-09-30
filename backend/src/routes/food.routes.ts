import { Hono } from "hono";
import { createfood, deletefood, getfood } from "../controllers/food.controllers.js";


const foodRoute = new Hono();
foodRoute.post("/", createfood);
foodRoute.get("/", getfood)
foodRoute.delete("/:id", deletefood)
export default foodRoute
