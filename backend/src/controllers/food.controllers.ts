
import { connectDb } from "../lib/mongodb.js"
import { foodModel } from "../model/food.model.js";
import { Context } from "hono";
export const createfood = async (c: Context) => {
    await connectDb();
    const input = await c.req.json();

    console.log("INPUT", input)
    await foodModel.create({
        foodname: input.foodname,
        price: input.price,
        image: input.image,
        category: input.category,
        ingredients: input.ingredients
    });
    return c.json({
        message: "Successfully created food",
    });
}
export const getfood = async (c: Context) => {
    await connectDb();
    const response = await foodModel.find();
    return c.json({
        message: "amjilttai",
        foods: response,
    });

}
export const deletefood = async (c: Context) => {
    await connectDb();
    try {
        const id = c.req.param("id");
        const deleteid = await foodModel.findByIdAndDelete(id);
        if (!deleteid) {
            return c.json({
                message: "tuhain id tai hool olsongvi"
            }, 404)
        }
        return c.json({
            message: "amjilttai ustlaa",
            id: id
        });
    } catch (error) {
        return c.json({
            error: "serveriin aldaa garlaa"
        }, 500)
    }
}