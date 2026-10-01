"use client";

import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, LayoutGrid, Truck, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";

type DeliveryStatus = "Pending" | "Delivered" | "Cancelled";

interface Order {
    id: string;
    customer: string;
    email: string;
    items: { name: string; quantity: number; image: string }[];
    date: string;
    total: number;
    address: string;
    status: DeliveryStatus;
}

interface OrderResponse {
    _id: string;
    customer: string;
    email: string;
    items: { foodname: string; quantity: number; image: string }[];
    createdAt: string;
    total: number;
    address: string;
    status: DeliveryStatus;
}

const statuses: DeliveryStatus[] = ["Pending", "Delivered", "Cancelled"];

const mapOrder = (order: OrderResponse): Order => ({
    id: order._id,
    customer: order.customer,
    email: order.email,
    items: (order.items || []).map((item) => ({ name: item.foodname, quantity: item.quantity, image: item.image })),
    date: order.createdAt ? order.createdAt.slice(0, 10) : "",
    total: order.total,
    address: order.address,
    status: order.status,
});

const statusStyles: Record<DeliveryStatus, string> = {
    Pending: "border-[#ef777a] text-[#b52f34] bg-white",
    Delivered: "border-[#91d3a7] text-[#34764a] bg-white",
    Cancelled: "border-[#dedede] text-[#5d5d5d] bg-white",
};

const formatMoney = (amount: number) => `$${amount.toFixed(2)}`;

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [bulkStatus, setBulkStatus] = useState<DeliveryStatus | "">("");
    const [page, setPage] = useState(1);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const pageSize = 12;

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/order`);
            setOrders((response.data.orders || []).map(mapOrder));
        } catch (error) {
            console.error("Захиалгуудыг татахад алдаа гарлаа:", error);
        }
    };

    useEffect(() => {
        void fetchOrders();
    }, []);

    const filteredOrders = useMemo(
        () => orders.filter((order) => (!fromDate || order.date >= fromDate) && (!toDate || order.date <= toDate)),
        [orders, fromDate, toDate],
    );
    const pageCount = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
    const pageOrders = filteredOrders.slice((page - 1) * pageSize, page * pageSize);
    const allVisibleSelected = pageOrders.length > 0 && pageOrders.every((order) => selectedIds.includes(order.id));

    const toggleSelected = (id: string) => {
        setSelectedIds((current) => current.includes(id) ? current.filter((selected) => selected !== id) : [...current, id]);
    };

    const toggleVisible = () => {
        setSelectedIds((current) => allVisibleSelected
            ? current.filter((id) => !pageOrders.some((order) => order.id === id))
            : [...new Set([...current, ...pageOrders.map((order) => order.id)])]);
    };

    const updateStatus = async (ids: string[], status: DeliveryStatus) => {
        const previousOrders = orders;
        setOrders((current) => current.map((order) => ids.includes(order.id) ? { ...order, status } : order));
        try {
            if (ids.length === 1) {
                await axios.patch(`${API_BASE_URL}/order/${ids[0]}/status`, { status });
            } else {
                await axios.patch(`${API_BASE_URL}/order/bulk-status`, { ids, status });
            }
        } catch (error) {
            console.error("Төлөв шинэчлэхэд алдаа гарлаа:", error);
            setOrders(previousOrders);
        }
    };

    const applyBulkStatus = () => {
        if (!bulkStatus || selectedIds.length === 0) return;
        void updateStatus(selectedIds, bulkStatus);
        setSelectedIds([]);
        setBulkStatus("");
    };

    const changeDate = (setter: (date: string) => void, date: string) => {
        setter(date);
        setPage(1);
    };


    return (
        <main className="flex min-h-screen bg-[#f4f4f5] text-[#252529]">
            <aside className="sticky top-0 flex h-screen w-[140px] shrink-0 flex-col border-r border-[#ededee] bg-white px-2 py-7 max-sm:w-[68px] max-sm:px-1">
                <Link href="/admin/menu" className="mb-8 flex items-center gap-2 px-1 max-sm:justify-center">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff494d] text-sm text-white">N</span>
                    <span className="max-sm:hidden"><span className="block text-sm font-bold leading-none">NomNom</span><span className="mt-1 block text-[9px] text-[#85858b]">Swift delivery</span></span>
                </Link>
                <nav className="space-y-2" aria-label="Admin navigation">
                    <Link href="/admin/menu" className="flex h-9 items-center gap-2 rounded-full px-3 text-[11px] font-medium text-[#333338] hover:bg-[#f4f4f5] max-sm:justify-center max-sm:px-0"><LayoutGrid size={15} /><span className="max-sm:hidden">Food menu</span></Link>
                    <Link href="/admin/orders" aria-current="page" className="flex h-9 items-center gap-2 rounded-full bg-[#19191b] px-3 text-[11px] font-medium text-white max-sm:justify-center max-sm:px-0"><Truck size={15} /><span className="max-sm:hidden">Orders</span></Link>
                </nav>
            </aside>

            <div className="min-w-0 flex-1 px-4 pb-8 md:px-6">
                <header className="flex h-[56px] items-center justify-end">
                    <button type="button" aria-label="Admin profile" className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ffd9d5] text-[#ec494c]"><UserRound size={15} /></button>
                </header>

                <section className="overflow-hidden rounded-md border border-[#e4e4e7] bg-white">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8e8eb] px-3 py-3">
                        <div>
                            <h1 className="text-[15px] font-bold">Orders</h1>
                            <p className="mt-0.5 text-[10px] text-[#88888f]">{filteredOrders.length} items</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <label className="flex h-8 items-center gap-1.5 rounded-full border border-[#e7e7ea] px-2">
                                <CalendarDays size={13} className="text-[#85858b]" />
                                <input aria-label="From date" type="date" value={fromDate} onChange={(event) => changeDate(setFromDate, event.target.value)} className="w-[110px] bg-transparent text-[9px] outline-none" />
                                <span className="text-[10px] text-[#99999f]">to</span>
                                <input aria-label="To date" type="date" value={toDate} onChange={(event) => changeDate(setToDate, event.target.value)} className="w-[110px] bg-transparent text-[9px] outline-none" />
                            </label>
                            <select aria-label="Bulk delivery state" value={bulkStatus} onChange={(event) => setBulkStatus(event.target.value as DeliveryStatus | "")} className="h-8 max-w-[135px] rounded-full border border-[#e7e7ea] bg-white px-2 text-[10px] outline-none">
                                <option value="">Change delivery state</option>
                                {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                            </select>
                            <button type="button" disabled={!bulkStatus || selectedIds.length === 0} onClick={applyBulkStatus} className="h-8 rounded-full bg-[#252529] px-3 text-[10px] font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-[#d2d2d5]">Apply</button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[970px] border-collapse text-left text-[10px]">
                            <thead className="bg-[#fafafb] text-[#7b7b83]">
                                <tr className="h-9 border-b border-[#e8e8eb]">
                                    <th className="w-9 px-3"><input type="checkbox" aria-label="Select all visible orders" checked={allVisibleSelected} onChange={toggleVisible} className="accent-[#252529]" /></th>
                                    <th className="w-10 font-medium">№</th>
                                    <th className="w-[145px] font-medium">Customer</th>
                                    <th className="w-[115px] font-medium">Food</th>
                                    <th className="w-[100px] font-medium">Date <ChevronDown size={11} className="ml-1 inline" /></th>
                                    <th className="w-[85px] font-medium">Total</th>
                                    <th className="font-medium">Delivery Address</th>
                                    <th className="w-[120px] pr-3 font-medium">Delivery state <ChevronDown size={11} className="ml-1 inline" /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageOrders.map((order, index) => (
                                    <tr key={order.id} className="border-b border-[#eeeeef] align-middle last:border-0">
                                        <td className="px-3 py-2.5"><input type="checkbox" aria-label={`Select order ${index + 1 + (page - 1) * pageSize}`} checked={selectedIds.includes(order.id)} onChange={() => toggleSelected(order.id)} className="accent-[#252529]" /></td>
                                        <td className="py-2.5 text-[#4d4d53]">{index + 1 + (page - 1) * pageSize}</td>
                                        <td className="py-2.5"><span className="block truncate pr-2 text-[#4d4d53]">{order.customer}</span><span className="mt-1 block truncate pr-2 text-[9px] text-[#909097]">{order.email}</span></td>
                                        <td className="py-2.5">
                                            <button type="button" aria-expanded={expandedId === order.id} onClick={() => setExpandedId((current) => current === order.id ? null : order.id)} className="flex items-center gap-2 text-[#686870]">
                                                {order.items.length} foods <ChevronDown size={12} className={`transition-transform ${expandedId === order.id ? "rotate-180" : ""}`} />
                                            </button>
                                            {expandedId === order.id && <div className="absolute z-10 mt-2 w-[190px] rounded-md border border-[#e7e7e9] bg-white p-2 shadow-lg">{order.items.map((food) => <div key={food.name} className="flex items-center gap-2 py-1"><Image src={food.image || "/image/salad.png"} alt="" width={24} height={24} className="h-6 w-6 rounded object-cover" unoptimized /><span className="min-w-0 flex-1 truncate text-[9px]">{food.name}</span><span className="text-[9px] text-[#88888f]">x {food.quantity}</span></div>)}</div>}
                                        </td>
                                        <td className="py-2.5 text-[#686870]">{order.date.replaceAll("-", "/")}</td>
                                        <td className="py-2.5 text-[#686870]">{formatMoney(order.total)}</td>
                                        <td className="max-w-[220px] py-2.5 pr-3"><span title={order.address} className="block truncate text-[9px] leading-4 text-[#85858b]">{order.address}</span></td>
                                        <td className="py-2.5 pr-3">
                                            <select aria-label={`Delivery state for order ${index + 1 + (page - 1) * pageSize}`} value={order.status} onChange={(event) => updateStatus([order.id], event.target.value as DeliveryStatus)} className={`h-6 w-[88px] rounded-full border px-2 text-[9px] outline-none ${statusStyles[order.status]}`}>
                                                {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                                {pageOrders.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-[12px] text-[#77777d]">Энэ хугацаанд захиалга олдсонгүй.</td></tr>}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#eeeeef] px-3 py-3 text-[10px] text-[#85858b]">
                        <span>{selectedIds.length ? `${selectedIds.length} selected` : `Showing ${filteredOrders.length ? (page - 1) * pageSize + 1 : 0}-${Math.min(page * pageSize, filteredOrders.length)} of ${filteredOrders.length}`}</span>
                        <nav aria-label="Orders pagination" className="flex items-center gap-1">
                            <button type="button" aria-label="Previous page" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-[#f2f2f3] disabled:opacity-35"><ChevronLeft size={14} /></button>
                            {Array.from({ length: pageCount }, (_, index) => index + 1).slice(0, 5).map((pageNumber) => <button key={pageNumber} type="button" onClick={() => setPage(pageNumber)} aria-current={page === pageNumber ? "page" : undefined} className={`h-7 min-w-7 rounded-full px-2 ${page === pageNumber ? "bg-[#414145] font-semibold text-white" : "hover:bg-[#f2f2f3]"}`}>{pageNumber}</button>)}
                            {pageCount > 5 && <span className="px-1">...</span>}
                            {pageCount > 5 && <button type="button" onClick={() => setPage(pageCount)} className="h-7 min-w-7 rounded-full px-2 hover:bg-[#f2f2f3]">{pageCount}</button>}
                            <button type="button" aria-label="Next page" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={page === pageCount} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-[#f2f2f3] disabled:opacity-35"><ChevronRight size={14} /></button>
                        </nav>
                    </div>
                </section>
            </div>
        </main>
    );
}