"use client";

import { API_BASE_URL } from "@/lib/api";
import { ArrowRight, Minus, Plus, Search, ShoppingBag, Utensils } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Food {
    _id: string;
    foodname: string;
    price: number;
    image?: string;
    ingredients?: string;
    category: string | { _id: string };
}

interface Category {
    _id: string;
    categoryName: string;
}

export default function Home() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [foods, setFoods] = useState<Food[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [checkoutMessage, setCheckoutMessage] = useState("");

    useEffect(() => {
        const loadMenu = async () => {
            try {
                const [categoryResponse, foodResponse] = await Promise.all([
                    fetch(`${API_BASE_URL}/category`),
                    fetch(`${API_BASE_URL}/food`),
                ]);

                if (!categoryResponse.ok || !foodResponse.ok) {
                    throw new Error("Цэсийг татаж чадсангүй. Дахин оролдоно уу.");
                }

                const [categoryData, foodData] = await Promise.all([
                    categoryResponse.json(),
                    foodResponse.json(),
                ]);
                setCategories(categoryData.foodCategories || []);
                setFoods(foodData.foods || []);
            } catch (error) {
                setLoadError(error instanceof Error ? error.message : "Сервертэй холбогдож чадсангүй.");
            } finally {
                setLoading(false);
            }
        };

        void loadMenu();
    }, []);

    const categoryForFood = (food: Food) =>
        typeof food.category === "string" ? food.category : food.category?._id;

    const visibleFoods = foods.filter((food) => {
        const matchesCategory = selectedCategory === "all" || categoryForFood(food) === selectedCategory;
        const matchesSearch = food.foodname.toLowerCase().includes(search.trim().toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const cartFoods = foods.filter((food) => cart[food._id] > 0);
    const itemCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
    const subtotal = cartFoods.reduce((total, food) => total + food.price * cart[food._id], 0);

    const changeQuantity = (foodId: string, difference: number) => {
        setCheckoutMessage("");
        setCart((current) => {
            const nextQuantity = (current[foodId] || 0) + difference;
            if (nextQuantity <= 0) {
                const nextCart = { ...current };
                delete nextCart[foodId];
                return nextCart;
            }
            return { ...current, [foodId]: nextQuantity };
        });
    };

    const money = (amount: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

    return (
        <main className="min-h-screen bg-[#f5f5f3] text-[#20201f]">
            <header className="border-b border-[#e8e8e5] bg-white">
                <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-6 px-5 md:px-8">
                    <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="NomNom home">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f6474c] text-white"><Utensils size={17} /></span>
                        <span>
                            <span className="block text-[17px] font-bold leading-none">NomNom</span>
                            <span className="mt-1 block text-[10px] text-[#898984]">Swift delivery</span>
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-7 text-[13px] md:flex">
                        <a href="#menu" className="font-semibold text-[#f04449]">Menu</a>
                        <Link href="/admin/menu" className="text-[#6d6d68] hover:text-[#222]">Admin</Link>
                    </nav>

                    <div className="flex items-center gap-2.5">
                        <Link href="/signin" className="rounded-md px-3 py-2 text-[12px] font-medium hover:bg-[#f5f5f3]">Sign in</Link>
                        <Link href="/signup" className="rounded-md bg-[#f6474c] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#df3c41]">Sign up</Link>
                    </div>
                </div>
            </header>

            <div className="mx-auto grid max-w-[1440px] gap-5 px-5 py-7 md:px-8 lg:grid-cols-[minmax(0,1fr)_340px]">
                <section id="menu" className="min-w-0">
                    <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <p className="mb-2 text-[11px] font-semibold uppercase text-[#f04449]">Good food, on its way</p>
                            <h1 className="text-[27px] font-bold leading-tight">Find your next favorite</h1>
                            <p className="mt-1 text-[13px] text-[#777771]">Fresh dishes from the NomNom kitchen.</p>
                        </div>
                        <label className="flex h-10 w-full items-center gap-2.5 rounded-md border border-[#e4e4e0] bg-white px-3 sm:max-w-[260px]">
                            <Search size={16} className="shrink-0 text-[#888882]" />
                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search dishes"
                                aria-label="Search dishes"
                                className="min-w-0 flex-1 bg-transparent text-[12px] outline-none placeholder:text-[#a2a29c]"
                            />
                        </label>
                    </div>

                    <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
                        <button
                            type="button"
                            onClick={() => setSelectedCategory("all")}
                            className={`shrink-0 rounded-full border px-4 py-2 text-[11px] font-medium ${selectedCategory === "all" ? "border-[#222] bg-[#222] text-white" : "border-[#e2e2df] bg-white hover:border-[#f6474c]"}`}
                        >All dishes <span className="ml-1 opacity-70">{foods.length}</span></button>
                        {categories.map((category) => {
                            const count = foods.filter((food) => categoryForFood(food) === category._id).length;
                            return (
                                <button
                                    type="button"
                                    key={category._id}
                                    onClick={() => setSelectedCategory(category._id)}
                                    className={`shrink-0 rounded-full border px-4 py-2 text-[11px] font-medium ${selectedCategory === category._id ? "border-[#222] bg-[#222] text-white" : "border-[#e2e2df] bg-white hover:border-[#f6474c]"}`}
                                >{category.categoryName}<span className="ml-1 opacity-70">{count}</span></button>
                            );
                        })}
                    </div>

                    {loadError ? (
                        <div role="alert" className="rounded-lg border border-[#f0c7c7] bg-white p-5 text-[13px] text-[#a83e42]">{loadError}</div>
                    ) : loading ? (
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {Array.from({ length: 6 }, (_, index) => <div key={index} className="h-[260px] animate-pulse rounded-lg bg-white" />)}
                        </div>
                    ) : visibleFoods.length ? (
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {visibleFoods.map((food) => (
                                <article key={food._id} className="overflow-hidden rounded-lg border border-[#e8e8e4] bg-white">
                                    <div className="relative h-[168px] bg-[#ecebe7]">
                                        <Image src={food.image || "/image/salad.png"} alt={food.foodname} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover" unoptimized />
                                    </div>
                                    <div className="p-3.5">
                                        <div className="flex items-start justify-between gap-3">
                                            <h2 className="text-[14px] font-semibold">{food.foodname}</h2>
                                            <span className="shrink-0 text-[12px] font-semibold">{money(food.price)}</span>
                                        </div>
                                        <p className="mt-1.5 line-clamp-2 min-h-8 text-[11px] leading-4 text-[#777771]">{food.ingredients || "Fresh ingredients, chef-crafted taste."}</p>
                                        <button type="button" onClick={() => changeQuantity(food._id, 1)} className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-md bg-[#f6474c] text-[11px] font-semibold text-white transition hover:bg-[#df3c41]">
                                            <Plus size={14} /> Add to order
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg border border-[#e8e8e4] bg-white p-8 text-center text-[13px] text-[#777771]">No dishes found.</div>
                    )}
                </section>

                <aside className="h-fit rounded-lg border border-[#e8e8e4] bg-white p-4 lg:sticky lg:top-5">
                    <div className="mb-4 flex items-center justify-between border-b border-[#eeeeeb] pb-4">
                        <div>
                            <p className="text-[10px] font-semibold uppercase text-[#898984]">Your basket</p>
                            <h2 className="mt-1 text-[19px] font-bold">Order summary</h2>
                        </div>
                        <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-[#f5f5f3] px-2 text-[11px] font-semibold">{itemCount}</span>
                    </div>

                    {cartFoods.length ? (
                        <div className="max-h-[330px] space-y-3 overflow-y-auto">
                            {cartFoods.map((food) => (
                                <div key={food._id} className="flex items-center gap-3">
                                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-[#ecebe7]">
                                        <Image src={food.image || "/image/salad.png"} alt="" fill sizes="48px" className="object-cover" unoptimized />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-[11px] font-semibold">{food.foodname}</p>
                                        <p className="mt-1 text-[10px] text-[#777771]">{money(food.price * cart[food._id])}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button type="button" onClick={() => changeQuantity(food._id, -1)} aria-label={`Remove one ${food.foodname}`} className="flex h-6 w-6 items-center justify-center rounded border border-[#e5e5e1] hover:bg-[#f5f5f3]"><Minus size={12} /></button>
                                        <span className="min-w-3 text-center text-[11px]">{cart[food._id]}</span>
                                        <button type="button" onClick={() => changeQuantity(food._id, 1)} aria-label={`Add one ${food.foodname}`} className="flex h-6 w-6 items-center justify-center rounded border border-[#e5e5e1] hover:bg-[#f5f5f3]"><Plus size={12} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex min-h-[150px] flex-col items-center justify-center text-center">
                            <ShoppingBag size={22} className="text-[#b5b5af]" />
                            <p className="mt-3 text-[12px] font-medium">Your basket is empty</p>
                            <p className="mt-1 text-[10px] text-[#898984]">Add a dish to start an order.</p>
                        </div>
                    )}

                    <div className="mt-4 border-t border-[#eeeeeb] pt-4">
                        <div className="flex justify-between text-[12px] text-[#777771]"><span>Subtotal</span><span>{money(subtotal)}</span></div>
                        <div className="mt-2 flex justify-between text-[12px] text-[#777771]"><span>Delivery</span><span>{itemCount ? money(4.5) : money(0)}</span></div>
                        <div className="mt-3 flex justify-between text-[14px] font-bold"><span>Total</span><span>{money(subtotal + (itemCount ? 4.5 : 0))}</span></div>
                        <button
                            type="button"
                            disabled={!itemCount}
                            onClick={() => setCheckoutMessage("Захиалгыг database-д хадгалах backend endpoint одоогоор алга.")}
                            className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#20201f] text-[11px] font-semibold text-white hover:bg-[#393936] disabled:cursor-not-allowed disabled:opacity-40"
                        >Continue to checkout <ArrowRight size={14} /></button>
                        {checkoutMessage && <p role="status" className="mt-2 text-[10px] leading-4 text-[#a83e42]">{checkoutMessage}</p>}
                    </div>
                </aside>
            </div>
        </main>
    );
}