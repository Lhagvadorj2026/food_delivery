"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import { uploadFile } from "@/lib/uploadFile"
import { API_BASE_URL } from "@/lib/api"
import { Button, Input } from "@base-ui/react"
import axios from "axios"
import { Plus, Upload } from "lucide-react"
import { useState } from "react"

export const Foodbutton = ({ categoryId, categoryName, foodfunction }: { categoryId: string; categoryName: string; foodfunction: () => void | Promise<void> }) => {
    const [foodname, setFoodname] = useState("");
    const [price, setPrice] = useState<number | string>("");
    const [ingredients, setIngredients] = useState("");
    const [file, setFile] = useState<File>();

    const handledFoodname = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFoodname(e.target.value);
    }

    const handledprice = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(e.target.value);
    }

    const handledIngredients = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIngredients(e.target.value);
    }

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedfile = e.target.files?.[0];
        setFile(uploadedfile);
    }

    const buttonfood = async () => {
        if (!foodname.trim() || !price || !file) return;

        try {
            const imageUrl = await uploadFile(file);
            await axios.post(`${API_BASE_URL}/food`, {
                foodname: foodname,
                price: Number(price),
                ingredients: ingredients,
                category: categoryId,
                image: imageUrl
            });
            await foodfunction();
            setFoodname("");
            setPrice("");
            setIngredients("");
            setFile(undefined);
        } catch (error) {
            console.error("Хоол нэмэхэд алдаа гарлаа:", error);
        }
    }

    return (
        <div>
            <Dialog>
                <DialogTrigger>
                    <div className="flex h-[170px] w-full cursor-pointer flex-col items-center justify-center rounded-[14px] border border-dashed border-[#ff5559] bg-white text-center hover:bg-[#fffafa] sm:h-[170px]">
                        <span className="mb-4 flex h-7 w-7 items-center justify-center rounded-full bg-[#ff494d] text-white"><Plus size={16} /></span>
                        <span className="text-[10px] font-medium leading-[1.5] text-[#252529]">Add new Dish to<br />{categoryName}</span>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add new Dish to {categoryName}</DialogTitle>

                        <div className="flex flex-col gap-3 mt-4">
                            <div>
                                <p className="text-sm font-medium">Food name</p>
                                <Input value={foodname} onChange={handledFoodname} type="text" className="border w-full p-2 rounded" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Food price</p>
                                <Input value={price} onChange={handledprice} type="number" className="border w-full p-2 rounded" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Ingredients</p>
                                <Input value={ingredients} onChange={handledIngredients} type="text" className="border w-full p-2 rounded" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Image</p>
                                <label className="mt-1 flex cursor-pointer items-center gap-2 rounded-md border border-dashed p-3 text-sm text-gray-600">
                                    <Upload size={16} />
                                    <span>{file?.name || "Choose a food image"}</span>
                                    <Input onChange={handleFile} type="file" accept="image/*" className="sr-only" />
                                </label>
                            </div>

                            <div className="mt-4 flex justify-end">
                                <DialogClose render={<Button onClick={buttonfood} className="rounded-md bg-[#ff494d] px-4 py-2 text-sm font-medium text-white" />}>
                                    Add dish
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
// import { uploadFile } from "@/lib/uploadFile"
// import { Button, Input } from "@base-ui/react"
// import axios from "axios"
// import { useState } from "react"
// import Image from "next/image"


// export const Foodbutton = ({ categoryId, foodfunction }: { categoryId: string; foodfunction: () => void }) => {
//     const [foodname, setFoodname] = useState("");
//     const [price, setPrice] = useState();
//     const [ingredients, setIngredients] = useState("");
//     const [file, setFile] = useState<File>()
//     const handledFoodname = (e: any) => {
//         const { value } = e.target;
//         setFoodname(value)
//     }
//     const handledprice = (e: any) => {
//         const { value } = e.target;
//         setPrice(value)
//     }
//     const handledIngredients = (e: any) => {
//         const { value } = e.target;
//         setIngredients(value)
//     }
//     const buttonfood = async () => {
//         if (!file) {
//             console.log("zuragaa oruulna uu")
//             return
//         }
//         const imageUrl = await uploadFile(file)
//         await axios.post("http://localhost:3001/food", {
//             foodname: foodname,
//             price: price,
//             ingredients: ingredients,
//             category: categoryId,
//             image: imageUrl
//         })
//         foodfunction();

//     }
//     const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const uploadedfile = e.target.files?.[0]
//         setFile(uploadedfile)
//         console.log("FILE", uploadedfile)

//     }
//     return <div>
//         <Dialog>
//             <DialogTrigger>
//                 <div className=" flex flex-col items-center justify-center border border-dashed w-[270px] h-[241px] border-red-600">
//                     <p className="rounded-2xl w-9 h-10 border bg-red-700"></p>
//                     <p>Add new Dish to</p>
//                 </div>
//             </DialogTrigger>
//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle>Add new Dish to Appetizers</DialogTitle>
//                     <DialogDescription asChild >
//                     </DialogDescription>
//                     <div>
//                         <p>foodname</p>
//                         <Input onChange={handledFoodname} type="text" className="border" />
//                     </div>
//                     <div>
//                         <p>Food price</p>
//                         <Input onChange={handledprice} type="number" className="border" />
//                     </div>
//                     <div>
//                         <p>Ingredients</p>
//                         <Input onChange={handledIngredients} type="text" className="border" />
//                     </div>
//                     <div>
//                         <p>Image</p>
//                         <Input onChange={handleFile} type="file" />
//                     </div>
//                     <DialogClose>
//                         <Button onClick={buttonfood}>add</Button>
//                     </DialogClose>


//                 </DialogHeader>
//             </DialogContent>
//         </Dialog>
//     </div>


// }




