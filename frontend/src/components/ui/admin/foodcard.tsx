import Image from "next/image";

interface Food {
    _id: string;
    foodname: string;
    price: number;
    ingredients: string;
    image: string;
    category: string;
}

interface FoodcardProps {
    categoryName: string;
    foods: Food[];
    categoryId: string;
    image?: string;
    foodfunction: () => void;
}

export const Foodcard = ({ categoryName, foods, categoryId, image }: FoodcardProps) => {
    const filteredfoods = foods?.filter((food) => food.category === categoryId);

    return (
        <div className="flex flex-col gap-4 bg-white rounded-xl p-4 w-full">
            <h3 className="text-xl font-bold text-gray-800">{categoryName}</h3>

            <div className="flex flex-wrap gap-5">
                {filteredfoods?.map((food) => (
                    <div key={food._id} className="border rounded-2xl p-3 shadow-sm bg-white hover:shadow-md transition">
                        <div className="w-[365px] h-[210px] relative overflow-hidden rounded-xl">
                            <Image
                                src={food.image || "/placeholder.png"}
                                alt={food.foodname}
                                width={365}
                                height={210}
                                className="object-cover h-full w-full"
                                unoptimized
                            />
                        </div>

                        <div className="flex w-[365px] justify-between items-center mt-3 font-semibold">
                            <p className="text-lg">{food.foodname}</p>
                            <p className="text-red-600">${food.price}</p>
                        </div>

                        <div className="w-[365px] mt-1">
                            <p className="text-sm text-gray-500 line-clamp-2">{food.ingredients}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
// import Image from "next/image";
// export const Foodcard = ({ categoryName, foods, categoryId, foodfunction }: { categoryName: string; foods: any; categoryId: string; foodfunction: () => void }) => {
//     const filteredfoods = foods?.filter((food: any) => food.category === categoryId

//     )
//     return <div className=" flex bg-white rounded-xl gap-5 w-full">
//         < h3 > {categoryName}</h3>
//         {filteredfoods?.map((food: any) => (
//             <div key={food._id}>
//                 <div className="  w-[365px] h-[210px] relative  overflow-hidden ">
//                     <Image src={food.image} alt={food.foodname} width={365} height={210} className="object-cover h-full w-full" />
//                 </div>

//                 <div className=" flex w-[365px] justify-between">
//                     <p>{food.foodname}</p>
//                     <p>{food.price}</p>

//                 </div>
//                 <div className="w-[365px]" >
//                     <p>{food.ingredients}</p>
//                 </div>
//             </div>
//         ))}
//     </div>
// } 
