"use client";

import { Categoryadd } from "@/components/ui/admin/Categoryadd";
import { Foodbutton } from "@/components/ui/admin/foodbutton";
import { UserContext } from "@/context/UserContext";
import { API_BASE_URL } from "@/lib/api";
import axios from "axios";
import { LayoutGrid, Truck, Utensils, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

interface TypeFood {
    _id: string;
    foodname: string;
    price: number;
    ingredients: string;
    image: string;
    category: string | { _id: string };
}

interface TypeCategory {
    _id: string;
    categoryName: string;
}

const Menu = () => {
    const [category, setCategory] = useState<TypeCategory[]>([]);
    const [foodmenu, setFoodmenu] = useState<TypeFood[]>([]);
    const [activeCategory, setActiveCategory] = useState("all");
    const context = useContext(UserContext);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/category`);
            setCategory(response.data.foodCategories || []);
        } catch (error) {
            console.error("Category татахад алдаа гарлаа:", error);
        }
    };

    const foodFunction = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/food`);
            setFoodmenu(response.data.foods || []);
        } catch (error) {
            console.error("Food татахад алдаа гарлаа:", error);
        }
    };

    useEffect(() => {
        void fetchData();
        void foodFunction();
    }, []);

    const getFoods = (categoryId: string) => foodmenu.filter((food) => {
        const foodCategoryId = typeof food.category === "string" ? food.category : food.category?._id;
        return foodCategoryId === categoryId;
    });

    const visibleCategories = activeCategory === "all"
        ? category
        : category.filter((item) => item._id === activeCategory);

    return (
        <main className="flex min-h-screen bg-[#f3f3f4] text-[#171719]">
            <aside className="sticky top-0 flex h-screen w-[140px] shrink-0 flex-col border-r border-[#ededee] bg-white px-2 py-7 max-sm:w-[68px] max-sm:px-1">
                <Link href="/admin/menu" className="mb-8 flex items-center gap-2 px-1 max-sm:justify-center">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff494d] text-sm text-white">N</span>
                    <span className="max-sm:hidden">
                        <span className="block text-sm font-bold leading-none">NomNom</span>
                        <span className="mt-1 block text-[9px] text-[#85858b]">Swift delivery</span>
                    </span>
                </Link>

                <nav className="space-y-2" aria-label="Admin navigation">
                    <Link href="/admin/menu" className="flex h-9 items-center gap-2 rounded-full bg-[#19191b] px-3 text-[11px] font-medium text-white max-sm:justify-center max-sm:px-0" aria-current="page">
                        <LayoutGrid size={15} />
                        <span className="max-sm:hidden">Food menu</span>
                    </Link>
                    <Link href="/admin/orders" className="flex h-9 items-center gap-2 rounded-full px-3 text-[11px] font-medium text-[#333338] hover:bg-[#f4f4f5] max-sm:justify-center max-sm:px-0">
                        <Truck size={15} />
                        <span className="max-sm:hidden">Orders</span>
                    </Link>
                </nav>
            </aside>

            <div className="min-w-0 flex-1 px-[17px] pb-8 max-sm:px-3">
                <header className="flex h-[58px] items-center justify-end">
                    <button type="button" aria-label="Admin profile" className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ffd9d5] text-[#ec494c]">
                        {context?.user?.email ? <UserRound size={15} /> : <Utensils size={14} />}
                    </button>
                </header>

                <section className="rounded-[10px] bg-white px-4 py-[17px]">
                    <h1 className="mb-3 text-[14px] font-bold">Dishes category</h1>
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveCategory("all")}
                            className={`flex h-[27px] items-center gap-2 rounded-full border px-3 text-[10px] transition ${activeCategory === "all" ? "border-[#ff4b50]" : "border-[#e7e7e9] hover:border-[#ff4b50]"}`}
                        >
                            All Dishes <span className="rounded-full bg-[#f0f0f2] px-[7px] py-[2px] text-[9px] font-semibold text-[#171719]">{foodmenu.length}</span>
                        </button>
                        {category.map((item) => (
                            <button
                                type="button"
                                key={item._id}
                                onClick={() => setActiveCategory(item._id)}
                                className={`flex h-[27px] items-center gap-2 rounded-full border px-3 text-[10px] transition ${activeCategory === item._id ? "border-[#ff4b50]" : "border-[#e7e7e9] hover:border-[#ff4b50]"}`}
                            >
                                {item.categoryName}<span className="rounded-full bg-[#f0f0f2] px-[7px] py-[2px] text-[9px] font-semibold text-[#171719]">{getFoods(item._id).length}</span>
                            </button>
                        ))}
                        <Categoryadd fetchdata={fetchData} />
                    </div>
                </section>

                <div className="mt-1 space-y-4">
                    {visibleCategories.map((item) => {
                        const foods = getFoods(item._id);
                        return (
                            <section key={item._id} className="rounded-[10px] bg-white px-[14px] pb-[14px] pt-[13px]">
                                <h2 className="mb-[10px] text-[14px] font-bold">{item.categoryName} <span className="ml-1">({foods.length})</span></h2>
                                <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
                                    <Foodbutton foodfunction={foodFunction} categoryId={item._id} categoryName={item.categoryName} />
                                    {foods.map((food) => (
                                        <article key={food._id} className="min-w-0 overflow-hidden rounded-[14px] border border-[#e9e9eb] bg-white p-[10px]">
                                            <div className="relative h-[92px] overflow-hidden rounded-[10px] bg-[#f2f1ef]">
                                                <Image
                                                    src={food.image || "/image/salad.png"}
                                                    alt={food.foodname}
                                                    fill
                                                    sizes="(max-width: 640px) 100vw, 220px"
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            </div>
                                            <div className="mt-3 flex items-start justify-between gap-2">
                                                <h3 className="min-w-0 truncate text-[10px] font-medium text-[#fa474b]">{food.foodname}</h3>
                                                <span className="shrink-0 text-[9px]">${Number(food.price).toFixed(2)}</span>
                                            </div>
                                            <p className="mt-1 line-clamp-2 text-[9px] leading-[1.45] text-[#626268]">{food.ingredients || "Fresh ingredients, chef-crafted taste."}</p>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                    {category.length === 0 && (
                        <section className="rounded-[10px] bg-white p-6 text-sm text-[#77777d]">
                            Ангилал одоогоор алга. Дээрх + товчоор эхний ангиллаа нэмнэ үү.
                        </section>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Menu;



// "use client"
// import { Categoryadd } from "@/components/ui/admin/Categoryadd"
// import { Badge } from "@/components/ui/badge"
// import axios from "axios"
// import { useContext, useEffect, useState } from "react"
// import { Foodcard } from "@/components/ui/admin/foodcard"
// import { Foodbutton } from "@/components/ui/admin/foodbutton"
// import { UserContext } from "@/context/Usercontext"

// interface typefood {
//     foodname: string
//     price: number
//     ingredients: string
//     image: string
//     _id: string

// }
// interface typecategory {
//     categoryName: string
//     _id: string

// }

// const Menu = () => {
//     const [category, setCategory] = useState<typecategory[]>([]);
//     const [foodmenu, setFoodmenu] = useState<typefood[]>([]);
//     const context = useContext(UserContext)
//     const fetchdata = async () => {
//         const response = await axios.get("http://localhost:3001/category");
//         console.log("response.data", response.data.foodCategories)
//         setCategory(response.data.foodCategories)

//     }

//     const foodfunction = async () => {
//         const response = await axios.get("http://localhost:3001/food");
//         console.log("reponse.data", response.data)
//         setFoodmenu(response.data.foods)
//     }

//     useEffect(() => {
//         fetchdata()
//         foodfunction()

//     }, [])


//     return <div className="">
//         <h3 className="text-xl font-semibold text-[28px]">Dishes category</h3>
//         <div className=" flex items-center gap-10 w-[1123px] h-[84px] border">
//             {category.map((cate) => {
//                 return <div key={cate._id} className="flex items-center py-4 px-2 text-sm transition">
//                     <Badge >
//                         {cate.categoryName}
//                     </Badge>

//                 </div>
//             })}
//             <Categoryadd fetchdata={fetchdata} />

//         </div>
//         <p className="text-2xl">{context?.user?.email}</p>
//         <div  >
//             {/* <div>
//                 {foodmenu?.map((food: any) => {
//                     return < div key={food._id}>

//                         <div className="flex  w-[365px] justify-between  ">
//                             <div>{food.foodname}</div>
//                             <div> {food.price}</div>

//                         </div>

//                         <p>{food.ingredients}</p>

//                     </div>
//                 })}
//             </div> */}
//             <div>

//                 {category?.map((cate) => {

//                     return <div key={cate._id} className="w-full border bg-white py-4 mt-4">
//                         <Foodcard categoryName={cate.categoryName} categoryId={cate._id} foods={foodmenu} image={cate.image} foodfunction={foodfunction} />
//                         <div>
//                             <Foodbutton foodfunction={foodfunction} categoryId={cate._id} />

//                         </div>

//                     </div>
//                 })}
//             </div>

//         </div>


//     </div >
// }
// export default Menu
