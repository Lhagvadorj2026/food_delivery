"use client"

import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useEffect, useState } from "react";

export type Usertype = {
    email: string;
    _id: string;
    role?: string;
}

type UserContextType = {
    user: Usertype | undefined;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<Usertype>();
    const router = useRouter();

    const signIn = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/user/signin`, {
                email,
                password,
            });

            if (response.status === 200 || response.status === 201) {
                const { user, token } = response.data;

                // 1. User болон Token-ийг localStorage-д хадгалах
                setUser(user);
                localStorage.setItem("user", JSON.stringify(user));
                if (token) {
                    localStorage.setItem("token", token);
                }

                // 2. Нэвтэрсний дараа Нүүр хуудас руу шилжих
                router.push("/");
            }
        } catch (error: any) {
            console.error("Нэвтрэхэд алдаа гарлаа:", error);
            const message = error.response?.data?.message || "Имэйл эсвэл нууц үг буруу байна!";
            alert(message);
        }
    };

    const signOut = () => {
        setUser(undefined);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        router.push("/signin");
    };

    const loadUser = () => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Localstorage-оос дата уншихад алдаа гарлаа:", error);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, signIn, signOut }}>
            {children}
        </UserContext.Provider>
    );
};

// "use client"
// import { useToastManager } from "@base-ui/react";
// import { Password } from "@hugeicons/core-free-icons";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// import { createContext, ReactNode, useEffect, useState } from "react";
// type Usertype = {
//     email: string;
//     password: string;
//     _id: string;
// }
// type UserContextType = {
//     user: Usertype | undefined
//     signIn: (_email: string, _password: string) => void;

// }
// export const UserContext = createContext<UserContextType | undefined>(undefined)
// export const UserProvider = ({ children }: { children: ReactNode }) => {
//     const [user, setUser] = useState<Usertype>();
//     const router = useRouter()
//     const signIn = async (email: string, password: string) => {

//         try {
//             const response = await axios.post("http://localhost:3001/user/signin", {
//                 email: email,
//                 password: password,
//             })
//             console.log("RESPONSE", response);

//             if (response.status === 200) {
//                 setUser(response.data.user)
//                 localStorage.setItem("/user", JSON.stringify(response.data.user))
//                 router.push("/")
//             }
//         } catch (error) { }

//     }
//     const loadUser = () => {

//         const user = localStorage.getItem("/user")
//         if (!user) {
//             return;
//         }
//         setUser(JSON.parse(user))
//     };
//     useEffect(() => {
//         loadUser()
//     }, [])


//     return <UserContext.Provider value={{ user, signIn }}>
//         {children}
//     </UserContext.Provider>
// };
