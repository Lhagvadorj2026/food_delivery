import { Context } from "hono";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserModel } from "../model/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "food-delivery-secret";

const createToken = (user: { _id: string; email: string; role?: string }) =>
    jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role || "USER",
        },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

export const getAllUsers = async (c: Context) => {
    try {
        const users = await UserModel.find({}).select("-password");
        return c.json({ users });
    } catch (error: any) {
        return c.json({ message: "Хэрэглэгчдийг татахад алдаа гарлаа", error: error.message }, 500);
    }
};

export const signUp = async (c: Context) => {
    try {
        const { email, password } = await c.req.json();

        if (!email || !email.trim()) {
            return c.json({ message: "Email-ээ оруулна уу" }, 400);
        }

        if (!password || password.length < 6) {
            return c.json({ message: "Нууц үг хамгийн багадаа 6 тэмдэгт байна" }, 400);
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            return c.json({ message: "Зөв имэйл хаяг оруулна уу" }, 400);
        }

        const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return c.json({ message: "Имэйл хаяг бүртгэлтэй байна" }, 400);
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = await UserModel.create({
            email: email.toLowerCase(),
            password: hashedPassword,
            isVerified: false,
            role: "USER",
        });

        const verificationToken = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "1d" });

        return c.json(
            {
                message: "Амжилттай хэрэглэгч бүртгэгдлээ. Имэйл баталгаажуулалт шаардлагатай.",
                verificationToken,
                user: {
                    _id: newUser._id,
                    email: newUser.email,
                    role: newUser.role,
                },
            },
            201
        );
    } catch (error: any) {
        console.error("SignUp Error:", error);
        return c.json({ message: "Сервер дээр алдаа гарлаа", error: error.message }, 500);
    }
};

export const verifyEmail = async (c: Context) => {
    try {
        const { token } = await c.req.json();

        if (!token) {
            return c.json({ message: "Verification token шаардлагатай" }, 400);
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        const user = await UserModel.findById(decoded.id);

        if (!user) {
            return c.json({ message: "Хэрэглэгч олдсонгүй" }, 404);
        }

        user.isVerified = true;
        await user.save();

        return c.json({
            message: "Имэйл амжилттай баталгаажлаа",
            user: {
                _id: user._id,
                email: user.email,
                isVerified: user.isVerified,
            },
        });
    } catch (error: any) {
        return c.json({ message: "Verification token буруу эсвэл хугацаа дууссан байна", error: error.message }, 400);
    }
};

export const signIn = async (c: Context) => {
    try {
        const { email, password } = await c.req.json();

        if (!email || !password) {
            return c.json({ message: "Email эсвэл нууц үгээ бөглөнө үү" }, 400);
        }

        const user = await UserModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            return c.json({ message: "Имэйл эсвэл нууц үг буруу байна" }, 401);
        }

        if (!user.isVerified) {
            return c.json({ message: "Имэйлээ эхлээд баталгаажуулна уу" }, 401);
        }

        const isCorrect = await bcrypt.compare(password, user.password);
        if (!isCorrect) {
            return c.json({ message: "Имэйл эсвэл нууц үг буруу байна" }, 401);
        }

        const token = createToken(user);

        return c.json(
            {
                message: "Амжилттай нэвтэрлээ",
                token,
                user: {
                    _id: user._id,
                    email: user.email,
                    role: user.role,
                },
            },
            200
        );
    } catch (error: any) {
        console.error("SignIn Error:", error);
        return c.json({ message: "Сервер дээр алдаа гарлаа", error: error.message }, 500);
    }
};

export const forgotPassword = async (c: Context) => {
    try {
        const { email } = await c.req.json();

        if (!email) {
            return c.json({ message: "Имэйл хаяг шаардлагатай" }, 400);
        }

        const user = await UserModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            return c.json({ message: "Тухайн имэйлээр хэрэглэгч олдсонгүй" }, 404);
        }

        const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

        return c.json({
            message: "Нууц үг сэргээх холбоос үүсгэгдлээ",
            resetToken,
        });
    } catch (error: any) {
        return c.json({ message: "Сервер дээр алдаа гарлаа", error: error.message }, 500);
    }
};

export const resetPassword = async (c: Context) => {
    try {
        const { token, password } = await c.req.json();

        if (!token || !password || password.length < 6) {
            return c.json({ message: "Reset token болон шинэ нууц үг шаардлагатай" }, 400);
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        const user = await UserModel.findById(decoded.id);

        if (!user) {
            return c.json({ message: "Хэрэглэгч олдсонгүй" }, 404);
        }

        user.password = bcrypt.hashSync(password, 10);
        await user.save();

        return c.json({ message: "Нууц үг амжилттай шинэчлэгдлээ" });
    } catch (error: any) {
        return c.json({ message: "Token буруу эсвэл хугацаа дууссан байна", error: error.message }, 400);
    }
};

