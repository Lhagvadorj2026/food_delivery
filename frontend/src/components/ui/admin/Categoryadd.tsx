"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { API_BASE_URL } from "@/lib/api"
import axios from "axios"
import { useState } from "react"

export const Categoryadd = ({ fetchdata }: { fetchdata: () => void }) => {
    const [value, setValue] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    const addCategory = async () => {
        if (!value.trim()) return;

        try {
            await axios.post(`${API_BASE_URL}/category`, {
                categoryName: value
            });
            fetchdata();
            setValue("");
        } catch (error) {
            console.error("Категори нэмэхэд алдаа гарлаа:", error);
        }
    }

    return (
        <div>
            <Dialog>
                <DialogTrigger>
                    <div className="rounded-2xl bg-red-600 w-9 h-10 flex items-center justify-center text-white text-xl font-bold cursor-pointer hover:bg-red-700 transition">
                        +
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Category name</DialogTitle>
                        <div className="flex flex-col gap-4 mt-3">
                            <input
                                className="w-full h-10 border rounded-md px-3 text-sm outline-none focus:ring-2 focus:ring-red-500"
                                onChange={handleChange}
                                placeholder="Type category name..."
                                value={value}
                            />
                            <div className="flex justify-end">
                                <DialogClose render={<Button onClick={addCategory} />}>
                                    Add category
                                </DialogClose>
                            </div>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
};
// "use client"
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
//     DialogClose
// } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import axios from "axios"
// import { useState } from "react"
// export const Categoryadd = ({ fetchdata }: {
//     fetchdata: () => void;
// }) => {
//     const [value, setValue] = useState("")
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         console.log("Event", e)
//         setValue(e.target.value)
//     }
//     const addCategory = async () => {
//         await axios.post("http://localhost:3001/category", {
//             categoryName: value
//         });
//         fetchdata()
//         setValue("")
//     }
//     return <div>
//         <Dialog>
//             <DialogTrigger>
//                 <div className="rounded-2xl bg-red-600 w-9 h-10 " />
//             </DialogTrigger>
//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle>Category name</DialogTitle>
//                     <input className="w-100 h-8" onChange={handleChange} placeholder="Type category name..." value={value}></input>
//                     <DialogClose>
//                         <Button onClick={addCategory}>add category</Button>
//                     </DialogClose>
//                 </DialogHeader>
//             </DialogContent>
//         </Dialog>

//     </div>


// }

