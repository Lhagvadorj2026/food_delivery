import { Hono } from "hono";
import {
    bulkUpdateOrderStatus,
    createOrder,
    deleteOrder,
    getOrders,
    updateOrderStatus,
} from "../controllers/order.controllers.js";

const orderRoute = new Hono();

orderRoute.post("/", createOrder);
orderRoute.get("/", getOrders);
orderRoute.patch("/bulk-status", bulkUpdateOrderStatus);
orderRoute.patch("/:id/status", updateOrderStatus);
orderRoute.delete("/:id", deleteOrder);

export default orderRoute;
