import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;
const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, "Email заавал шаардлагатай"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Password заавал шаардлагатай"],
        },
        phoneNumber: {
            type: String,
            default: "",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        address: {
            type: String,
            default: "",
        },
        role: {
            type: String,
            enum: ["ADMIN", "USER"],
            default: "USER",
        },
    },
    { timestamps: true }
);

export const UserModel = models.user || model("user", UserSchema);

// import { Schema, model } from "mongoose";
// import { blob } from "stream/consumers";
// const UserSchema = new Schema({
//     email: String,
//     password: String,
//     phoneNumber: String,
//     isVerified: Boolean,
//     address: String,
//     role: {
//         type: String,
//         enum: ["ADMIN", "USER"],
//         default: "USER",


//     },

// },
//     { timestamps: true }
// );
// export const UserModel = model("user", UserSchema);
