import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const OrderItemSchema = new Schema(
    {
        food: { type: Schema.Types.ObjectId, ref: "food" },
        foodname: String,
        price: Number,
        quantity: Number,
        image: String,
    },
    { _id: false }
);

const OrderSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "user" },
        customer: { type: String, required: true },
        email: { type: String, required: true },
        items: { type: [OrderItemSchema], default: [] },
        total: { type: Number, required: true },
        address: { type: String, default: "" },
        status: {
            type: String,
            enum: ["Pending", "Delivered", "Cancelled"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

export const OrderModel = models.order || model("order", OrderSchema);
