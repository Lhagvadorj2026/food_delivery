"use client";

import { API_BASE_URL } from "@/lib/api";
import { UserContext } from "@/context/UserContext";
import axios from "axios";
import { ArrowRight, MapPin, Minus, Plus, Search, ShoppingBag, ShoppingCart, Utensils, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

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

interface OrderHistoryItem {
    _id: string;
    items: { foodname: string; quantity: number }[];
    total: number;
    status: string;
    createdAt: string;
}

export default function Home() {
    const userContext = useContext(UserContext);
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [foods, setFoods] = useState<Food[]>([]);
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState<Record<string, number>>({});
    const [cartOpen, setCartOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [address, setAddress] = useState("");
    const [checkoutMessage, setCheckoutMessage] = useState("");
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [cartTab, setCartTab] = useState<"cart" | "order">("cart");
    const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
    const [orderHistoryLoading, setOrderHistoryLoading] = useState(false);

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

    useEffect(() => {
        if (userContext?.loading) return;
        if (!userContext?.user) {
            router.replace("/signin");
        }
    }, [userContext?.loading, userContext?.user, router]);

    const categoryForFood = (food: Food) =>
        typeof food.category === "string" ? food.category : food.category?._id;

    const filteredFoods = foods.filter((food) => food.foodname.toLowerCase().includes(search.trim().toLowerCase()));

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

    const handleCheckout = async () => {
        if (!itemCount || checkoutLoading) return;
        if (!address.trim()) {
            setCheckoutMessage("Хүргэлтийн хаягаа оруулна уу.");
            return;
        }

        const user = userContext?.user;
        setCheckoutLoading(true);
        setCheckoutMessage("");
        try {
            await axios.post(`${API_BASE_URL}/order`, {
                user: user?._id,
                customer: user?.email || "Зочин",
                email: user?.email || "guest@nomnom.com",
                items: cartFoods.map((food) => ({
                    food: food._id,
                    foodname: food.foodname,
                    price: food.price,
                    quantity: cart[food._id],
                    image: food.image || "",
                })),
                total: subtotal + (itemCount ? 4.5 : 0),
                address,
            });
            setCart({});
            setAddress("");
            setCheckoutMessage("Захиалга амжилттай хийгдлээ!");
        } catch (error) {
            setCheckoutMessage("Захиалга хийхэд алдаа гарлаа. Дахин оролдоно уу.");
        } finally {
            setCheckoutLoading(false);
        }
    };

    const loadOrderHistory = async () => {
        const email = userContext?.user?.email;
        if (!email) return;
        setOrderHistoryLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/order`);
            const orders: OrderHistoryItem[] = (response.data.orders || []).filter(
                (order: { email: string }) => order.email === email,
            );
            setOrderHistory(orders);
        } catch (error) {
            console.error("Захиалгын түүхийг татахад алдаа гарлаа:", error);
        } finally {
            setOrderHistoryLoading(false);
        }
    };

    const selectCartTab = (tab: "cart" | "order") => {
        setCartTab(tab);
        if (tab === "order") void loadOrderHistory();
    };

    if (userContext?.loading || !userContext?.user) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#242424] text-[13px] text-[#c8c8c8]">
                Шалгаж байна...
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#242424] px-0 font-sans text-[#18181a] sm:px-4">
            <div className="mx-auto min-h-screen max-w-[1440px] bg-[#414141] shadow-2xl">
                <header className="sticky top-0 z-30 bg-[#171719] text-white shadow-md">
                    <div className="mx-auto flex h-[68px] max-w-[1360px] items-center justify-between gap-4 px-4 sm:px-7">
                        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="NomNom home">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f44748] text-white"><Utensils size={17} /></span>
                            <span>
                                <span className="block text-[16px] font-bold leading-none">NomNom</span>
                                <span className="mt-1 block text-[9px] text-[#b8b8bb]">Swift delivery</span>
                            </span>
                        </Link>

                        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                            <label className="hidden h-9 w-[190px] items-center gap-2 rounded-full bg-white px-3 text-[#222] md:flex">
                                <Search size={14} className="shrink-0 text-[#f04449]" />
                                <input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search dishes"
                                    aria-label="Search dishes"
                                    className="min-w-0 flex-1 bg-transparent text-[11px] outline-none placeholder:text-[#85858b]"
                                />
                            </label>
                            <button type="button" className="hidden h-9 items-center gap-2 rounded-full bg-white px-3 text-left text-[#202024] sm:flex">
                                <MapPin size={14} className="text-[#f04449]" />
                                <span className="leading-tight"><span className="block text-[9px] text-[#89898e]">Delivery address</span><span className="block text-[10px] font-medium">Add location</span></span>
                                <ArrowRight size={12} className="text-[#85858b]" />
                            </button>
                            <button type="button" onClick={() => setCartOpen((open) => !open)} aria-label={`Open basket, ${itemCount} items`} className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#222] transition hover:bg-[#f4f4f4]">
                                <ShoppingBag size={16} />
                                {itemCount > 0 && <span className="absolute -right-1 -top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#f44748] px-1 text-[9px] font-bold text-white">{itemCount}</span>}
                            </button>
                            <Link href="/signin" aria-label="Sign in" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f44748] text-[12px] font-bold text-white">N</Link>
                        </div>
                    </div>
                    <label className="flex h-10 items-center gap-2 border-t border-white/10 px-4 md:hidden">
                        <Search size={14} className="shrink-0 text-[#f77b7d]" />
                        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search dishes" aria-label="Search dishes" className="min-w-0 flex-1 bg-transparent text-[12px] text-white outline-none placeholder:text-[#b4b4b8]" />
                    </label>
                </header>

                <section aria-label="Featured offer" className="relative isolate flex h-[250px] items-center overflow-hidden bg-[#f7f0e9] sm:h-[320px] lg:h-[390px]">
                    <div aria-hidden="true" className="absolute inset-0 flex -rotate-[4deg] flex-col justify-center gap-1 overflow-hidden text-center font-black leading-[0.8] text-[#e9ded8]">
                        <span className="whitespace-nowrap text-[38px] sm:text-[64px]">SAY CHEESE · SAY CHEESE · SAY CHEESE</span>
                        <span className="whitespace-nowrap text-[38px] sm:text-[64px] text-[#f3d1c8]">FRESHLY DELIVERED · FRESHLY DELIVERED</span>
                        <span className="whitespace-nowrap text-[38px] sm:text-[64px]">SAY CHEESE · SAY CHEESE · SAY CHEESE</span>
                        <span className="whitespace-nowrap text-[38px] sm:text-[64px] text-[#f3d1c8]">FRESHLY DELIVERED · FRESHLY DELIVERED</span>
                    </div>
                    <div className="absolute inset-x-0 top-1/2 h-[150px] -translate-y-1/2 rounded-r-[90px] border-b-[10px] border-[#f44748] bg-[#171719] sm:h-[210px] sm:border-b-[14px]" />
                    <div className="relative mx-auto flex w-full max-w-[1240px] items-center justify-between px-5 sm:px-10">
                        <h1 className="z-20 max-w-[42%] font-black leading-[0.92] text-white [font-stretch:condensed] text-[clamp(38px,7vw,92px)]">TODAY&apos;S</h1>
                        <h2 className="z-20 max-w-[35%] text-right font-black leading-[0.92] text-white [font-stretch:condensed] text-[clamp(38px,7vw,92px)]">OFFER!</h2>
                    </div>
                    <div className="absolute left-[23%] top-1/2 z-10 h-[150px] w-[54%] -translate-y-1/2 rotate-[-4deg] overflow-hidden rounded-[44%] border-[5px] border-[#f7f0e9] shadow-xl sm:h-[245px] sm:w-[45%] sm:border-[8px] lg:w-[38%]">
                        <Image src={foods[0]?.image || "/image/salad.png"} alt={foods[0]?.foodname || "Freshly prepared dish"} fill sizes="(max-width: 640px) 54vw, 45vw" className="object-cover" unoptimized priority />
                        {!foods[0]?.image && <button type="button" onClick={() => foods[0] && changeQuantity(foods[0]._id, 1)} aria-label="Add featured dish to basket" className="absolute right-[13%] top-[48%] z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#f44748] shadow-md sm:h-11 sm:w-11"><Plus size={20} /></button>}
                    </div>
                    <span className="absolute bottom-[22%] left-[8%] z-20 rounded-full bg-[#ff4b48] px-4 py-2 text-[13px] font-bold uppercase text-white shadow sm:bottom-[21%] sm:left-[8%] sm:text-[17px]">Steak Society</span>
                    <span aria-hidden="true" className="absolute right-[31%] top-[12%] z-20 text-[38px] font-black leading-none text-[#ff4b48] sm:text-[54px]">+</span>
                </section>

                <section id="menu" className="mx-auto min-h-[70vh] max-w-[1360px] px-5 pb-16 pt-8 sm:px-8 sm:pt-10">
                    <div className="mb-7 flex items-end justify-between gap-4 md:hidden">
                        <div>
                            <h2 className="text-[21px] font-bold text-white">Today&apos;s menu</h2>
                            <p className="mt-1 text-[11px] text-[#c8c8c8]">Fresh from the NomNom kitchen</p>
                        </div>
                        <Link href="/signup" className="text-[11px] font-semibold text-[#ff7775]">Sign up</Link>
                    </div>

                    {loadError ? (
                        <div role="alert" className="rounded-lg bg-white p-5 text-[13px] text-[#a83e42]">{loadError}</div>
                    ) : loading ? (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }, (_, index) => <div key={index} className="h-[300px] animate-pulse rounded-xl bg-[#505050]" />)}
                        </div>
                    ) : categories.length && filteredFoods.length ? (
                        <div className="space-y-9 sm:space-y-11">
                            {categories.map((category) => {
                                const categoryFoods = filteredFoods.filter((food) => categoryForFood(food) === category._id);
                                if (categoryFoods.length === 0) return null;
                                return (
                                    <section key={category._id} aria-labelledby={`category-${category._id}`}>
                                        <div className="mb-4 flex items-center justify-between">
                                            <h2 id={`category-${category._id}`} className="text-[18px] font-semibold text-white sm:text-[21px]">{category.categoryName}</h2>
                                            <span className="text-[11px] text-[#c9c9c9]">{categoryFoods.length} dishes</span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
                                            {categoryFoods.map((food) => (
                                                <article key={food._id} className="overflow-hidden rounded-[11px] bg-white p-3 shadow-sm transition-transform duration-200 hover:-translate-y-1">
                                                    <div className="relative h-[190px] overflow-hidden rounded-[8px] bg-[#e8e5df] sm:h-[205px]">
                                                        <Image src={food.image || "/image/salad.png"} alt={food.foodname} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" unoptimized />
                                                        <button type="button" onClick={() => changeQuantity(food._id, 1)} aria-label={`Add ${food.foodname} to basket`} className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#f44748] shadow-md transition hover:scale-105 hover:bg-[#fff2f1]">
                                                            <Plus size={17} />
                                                        </button>
                                                    </div>
                                                    <div className="px-1 pb-1 pt-3">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <h3 className="min-w-0 text-[13px] font-medium leading-5 text-[#ed3e41]">{food.foodname}</h3>
                                                            <span className="shrink-0 text-[12px] font-semibold text-[#202024]">{money(food.price)}</span>
                                                        </div>
                                                        <p className="mt-1.5 line-clamp-2 min-h-8 text-[10px] leading-4 text-[#48484c]">{food.ingredients || "Fluffy pancakes stacked with fruits, cream, syrup, and powdered sugar."}</p>
                                                    </div>
                                                </article>
                                            ))}
                                        </div>
                                    </section>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-lg bg-white p-8 text-center text-[13px] text-[#777771]">{search ? "No dishes match your search." : "No dishes are available yet."}</div>
                    )}
                </section>

                {cartOpen && (
                    <div className="fixed inset-0 z-50 bg-black/45" onClick={() => setCartOpen(false)}>
                        <aside aria-label="Order detail" onClick={(event) => event.stopPropagation()} className="absolute right-0 top-0 flex h-full w-full max-w-[423px] flex-col gap-6 overflow-y-auto rounded-l-[20px] bg-[#404040] p-8 shadow-2xl">
                            <div className="flex items-center justify-center gap-3">
                                <ShoppingCart size={24} className="text-white" />
                                <p className="flex-1 text-[20px] font-semibold tracking-[-0.5px] text-white">Order detail</p>
                                <button type="button" onClick={() => setCartOpen(false)} aria-label="Close basket" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10"><X size={16} /></button>
                            </div>

                            <div className="flex items-center gap-2 rounded-full bg-white p-1">
                                <button type="button" onClick={() => selectCartTab("cart")} className={`flex-1 rounded-full px-2 py-1 text-[18px] transition ${cartTab === "cart" ? "bg-[#ef4444] text-white" : "text-[#09090b]"}`}>Cart</button>
                                <button type="button" onClick={() => selectCartTab("order")} className={`flex-1 rounded-full px-2 py-1 text-[18px] transition ${cartTab === "order" ? "bg-[#ef4444] text-white" : "text-[#09090b]"}`}>Order</button>
                            </div>

                            {cartTab === "cart" ? (
                                <>
                                    <div className="flex flex-1 flex-col justify-between gap-5 overflow-hidden rounded-[20px] bg-white p-4">
                                        <div className="flex flex-col gap-5 overflow-y-auto">
                                            <p className="text-[20px] font-semibold tracking-[-0.5px] text-[#71717a]">My cart</p>
                                            {cartFoods.length ? cartFoods.map((food, index) => (
                                                <div key={food._id}>
                                                    {index > 0 && <div className="mb-5 h-px w-full border-t border-dashed border-[#e4e4e7]" />}
                                                    <div className="flex h-[120px] items-start gap-2.5">
                                                        <div className="relative h-full w-[124px] shrink-0 overflow-hidden rounded-xl bg-[#eee]"><Image src={food.image || "/image/salad.png"} alt="" fill sizes="124px" className="object-cover" unoptimized /></div>
                                                        <div className="flex h-full flex-1 flex-col gap-6">
                                                            <div className="flex items-start gap-2.5">
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="truncate text-[16px] font-bold text-[#ef4444]">{food.foodname}</p>
                                                                    <p className="mt-1 line-clamp-2 text-[12px] text-[#09090b]">{food.ingredients || "Fluffy pancakes stacked with fruits, cream, syrup, and powdered sugar."}</p>
                                                                </div>
                                                                <button type="button" onClick={() => setCart((current) => { const next = { ...current }; delete next[food._id]; return next; })} aria-label={`Remove ${food.foodname} from cart`} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#ef4444] text-[#ef4444]"><X size={16} /></button>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <button type="button" onClick={() => changeQuantity(food._id, -1)} aria-label={`Remove one ${food.foodname}`} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e4e4e7]"><Minus size={16} /></button>
                                                                    <span className="text-[18px] font-semibold text-[#09090b]">{cart[food._id]}</span>
                                                                    <button type="button" onClick={() => changeQuantity(food._id, 1)} aria-label={`Add one ${food.foodname}`} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e4e4e7]"><Plus size={16} /></button>
                                                                </div>
                                                                <p className="text-[16px] font-bold text-[#09090b]">{money(food.price * cart[food._id])}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : <div className="flex flex-col items-center justify-center gap-2 py-10 text-center"><ShoppingBag size={24} className="text-[#aaaab0]" /><p className="text-[13px] font-medium text-[#09090b]">Your basket is empty</p><p className="text-[11px] text-[#71717a]">Add a dish to start an order.</p></div>}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <p className="text-[20px] font-semibold tracking-[-0.5px] text-[#71717a]">Delivery location</p>
                                            <textarea id="delivery-address" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Please share your complete address" rows={2} className="min-h-[80px] w-full resize-none rounded-md border border-[#e4e4e7] p-3 text-[14px] text-[#09090b] outline-none placeholder:text-[#71717a] focus:border-[#ef4444]" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-5 rounded-[20px] bg-white p-4">
                                        <p className="text-[20px] font-semibold tracking-[-0.5px] text-[#71717a]">Payment info</p>
                                        <div className="flex flex-col gap-2 text-[16px]">
                                            <div className="flex justify-between"><span className="text-[#71717a]">Items</span><span className="font-bold text-[#09090b]">{money(subtotal)}</span></div>
                                            <div className="flex justify-between"><span className="text-[#71717a]">Shipping</span><span className="font-bold text-[#09090b]">{itemCount ? money(4.5) : money(0)}</span></div>
                                        </div>
                                        <div className="h-px w-full border-t border-dashed border-[#e4e4e7]" />
                                        <div className="flex w-full justify-between"><span className="text-[#71717a]">Total</span><span className="text-[18px] font-semibold text-[#09090b]">{money(subtotal + (itemCount ? 4.5 : 0))}</span></div>
                                        <button type="button" disabled={!itemCount || checkoutLoading} onClick={() => void handleCheckout()} className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#ef4444] px-8 py-2 text-[14px] font-medium text-white hover:bg-[#e13636] disabled:cursor-not-allowed disabled:opacity-40">{checkoutLoading ? "Хадгалж байна..." : "Checkout"} <ArrowRight size={14} /></button>
                                        {checkoutMessage && <p role="status" className="text-[10px] leading-4 text-[#ffb4b4]">{checkoutMessage}</p>}
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-1 flex-col gap-4 overflow-y-auto rounded-[20px] bg-white p-4">
                                    <p className="text-[20px] font-semibold tracking-[-0.5px] text-[#71717a]">Order history</p>
                                    {!userContext?.user ? (
                                        <p className="py-6 text-center text-[12px] text-[#71717a]">Захиалгын түүхээ харахын тулд эхлээд нэвтэрнэ үү.</p>
                                    ) : orderHistoryLoading ? (
                                        <p className="py-6 text-center text-[12px] text-[#71717a]">Ачаалж байна...</p>
                                    ) : orderHistory.length ? (
                                        <div className="flex flex-col gap-3">
                                            {orderHistory.map((order) => (
                                                <div key={order._id} className="rounded-md border border-[#e4e4e7] p-3">
                                                    <div className="flex items-center justify-between text-[12px]">
                                                        <span className="font-semibold text-[#09090b]">{order.items.map((item) => `${item.foodname} x${item.quantity}`).join(", ")}</span>
                                                        <span className="rounded-full bg-[#f4f4f5] px-2 py-0.5 text-[10px] font-medium text-[#71717a]">{order.status}</span>
                                                    </div>
                                                    <div className="mt-1 flex items-center justify-between text-[11px] text-[#71717a]"><span>{new Date(order.createdAt).toLocaleDateString()}</span><span className="font-bold text-[#09090b]">{money(order.total)}</span></div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="py-6 text-center text-[12px] text-[#71717a]">Захиалгын түүх алга байна.</p>
                                    )}
                                </div>
                            )}
                        </aside>
                    </div>
                )}
            </div>
        </main>
    );
}