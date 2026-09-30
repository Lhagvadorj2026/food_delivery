"use client"

import { UserContext } from "@/context/UserContext"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useContext } from "react"
import Link from "next/link"

export const Header = () => {
    const context = useContext(UserContext)

    return (
        <div className="w-full flex justify-between bg-black items-center px-6 py-2">
            <div>
                <Image
                    src="/Logo Container.png"
                    alt="logo image"
                    width={116}
                    height={68}
                    style={{ width: "auto", height: "auto" }} // Warning засав
                    priority
                />
            </div>

            {context?.user ? (
                <div className="text-white flex items-center gap-2">
                    <p className="font-semibold">{context.user.email}</p>
                </div>
            ) : (
                <div className="flex gap-3">
                    <Link href="/signup">
                        {/* text-black нэмж бичвэрийг харагдуулна */}
                        <Button className="bg-white text-black hover:bg-gray-200 rounded-2xl px-4 py-2 font-medium">
                            Sign up
                        </Button>
                    </Link>
                    <Link href="/signin">
                        <Button className="bg-red-600 text-white hover:bg-red-700 rounded-2xl px-4 py-2 font-medium">
                            Log in
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}
// import { UserContext } from "@/context/UserContext"
// import { Button } from "@/components/ui/button"

// import Image from "next/image"
// import { useContext } from "react"
// import Link from "next/link"
// export const Header = () => {
//     const context = useContext(UserContext)


//     return (
//         <div className="w-full flex justify-between bg-black items-center">
//             <div>
//                 <Image src="/Logo Container.png" alt="logo image" width={116} height={68} />
//             </div>
//             {context?.user ? (<div className="text-white">Amjilttai nevtersen bn <p>{context.user.email}</p></div>) : <div className="flex gap-3">
//                 <div className="flex gap-3">
//                     <Link href="/signup">
//                         <Button className="bg-white rounded-2xl">Sign up /</Button>
//                     </Link>
//                     <Link href="/signup">

//                         <Button className="bg-red-500 rounded-2xl">Log in</Button>
//                     </Link>
//                 </div>

//             </div>}
//         </div>
//     )
// }   