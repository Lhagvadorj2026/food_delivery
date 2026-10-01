import { Context } from "hono";
import { connectDb } from "../lib/mongodb.js";
import { OrderModel } from "../model/order.model.js";

export const createOrder = async (c: Context) => {
    await connectDb();
    try {
        const input = await c.req.json();
        const order = await OrderModel.create({
            user: input.user,
            customer: input.customer,
            email: input.email,
            items: input.items,
            total: input.total,
            address: input.address,
            status: input.status || "Pending",
        });
        return c.json({ message: "Захиалга амжилттай үүслээ", order }, 201);
    } catch (error: any) {
        return c.json({ message: "Захиалга үүсгэхэд алдаа гарлаа", error: error.message }, 500);
    }
};

export const getOrders = async (c: Context) => {
    await connectDb();
    try {
        const orders = await OrderModel.find().sort({ createdAt: -1 });
        return c.json({ message: "amjilttai", orders });
    } catch (error: any) {
        return c.json({ message: "Захиалгуудыг татахад алдаа гарлаа", error: error.message }, 500);
    }
};

export const updateOrderStatus = async (c: Context) => {
    await connectDb();
    try {
        const id = c.req.param("id");
        const { status } = await c.req.json();

        if (!["Pending", "Delivered", "Cancelled"].includes(status)) {
            return c.json({ message: "Төлөв буруу байна" }, 400);
        }

        const order = await OrderModel.findByIdAndUpdate(id, { status }, { new: true });
        if (!order) {
            return c.json({ message: "Тухайн id-тай захиалга олдсонгүй" }, 404);
        }
        return c.json({ message: "Төлөв шинэчлэгдлээ", order });
    } catch (error: any) {
        return c.json({ message: "Серверийн алдаа гарлаа", error: error.message }, 500);
    }
};

export const bulkUpdateOrderStatus = async (c: Context) => {
    await connectDb();
    try {
        const { ids, status } = await c.req.json();

        if (!Array.isArray(ids) || ids.length === 0) {
            return c.json({ message: "Захиалгын id-үүд шаардлагатай" }, 400);
        }
        if (!["Pending", "Delivered", "Cancelled"].includes(status)) {
            return c.json({ message: "Төлөв буруу байна" }, 400);
        }

        await OrderModel.updateMany({ _id: { $in: ids } }, { status });
        return c.json({ message: "Төлөвүүд шинэчлэгдлээ" });
    } catch (error: any) {
        return c.json({ message: "Серверийн алдаа гарлаа", error: error.message }, 500);
    }
};

export const deleteOrder = async (c: Context) => {
    await connectDb();
    try {
        const id = c.req.param("id");
        const deleted = await OrderModel.findByIdAndDelete(id);
        if (!deleted) {
            return c.json({ message: "Тухайн id-тай захиалга олдсонгүй" }, 404);
        }
        return c.json({ message: "Захиалга устгагдлаа", id });
    } catch (error: any) {
        return c.json({ message: "Серверийн алдаа гарлаа", error: error.message }, 500);
    }
};
