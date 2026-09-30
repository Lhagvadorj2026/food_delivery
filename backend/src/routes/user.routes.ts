import { Hono } from "hono";
import {
    forgotPassword,
    getAllUsers,
    resetPassword,
    signIn,
    signUp,
    verifyEmail,
} from "../controllers/user.controllers.js";

const userRoute = new Hono();

userRoute.get("/", getAllUsers);
userRoute.post("/signup", signUp);
userRoute.post("/signin", signIn);
userRoute.post("/verify-email", verifyEmail);
userRoute.post("/forgot-password", forgotPassword);
userRoute.post("/reset-password", resetPassword);

export default userRoute;
