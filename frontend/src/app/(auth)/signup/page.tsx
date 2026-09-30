"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { API_BASE_URL } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field"

const signupSchema = z.object({
    email: z.string().email("Зөв имэйл хаяг оруулна уу"),
    password: z.string().min(6, "Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой"),
    confirmPassword: z.string().min(6, "Нууц үгээ давтан оруулна уу")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Нууц үг зөрж байна",
    path: ["confirmPassword"],
})

type SignupFormValues = z.infer<typeof signupSchema>

export default function SignupPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [showPassword, setShowPassword] = useState(false)

    const { register, handleSubmit, trigger, formState: { errors, isSubmitting } } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
    })

    const onSubmit = async (data: SignupFormValues) => {
        try {
            const res = await fetch(`${API_BASE_URL}/user/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            })

            if (res.ok) {
                router.push("/signin")
            } else {
                const errorData = await res.json()
                alert(errorData.message || "Бүртгэл амжилтгүй боллоо")
            }
        } catch (error) {
            console.error("Signup error:", error)
            alert("Сервертэй холбогдоход алдаа гарлаа")
        }
    }

    return (
        <main className="flex min-h-screen w-full bg-white">
            <section className="flex w-full items-center justify-center px-6 py-12 sm:px-10 lg:w-[40%]">
                <div className="w-full max-w-[310px]">
                    <Link href="/" aria-label="Back to home" className="mb-12 inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#eeeeef] text-sm text-[#77777d] hover:bg-[#f7f7f8]">‹</Link>
                    <Link href="/" className="mb-8 flex items-center gap-2 text-sm font-semibold">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff464b] text-white">N</span>
                        NomNom
                    </Link>
                    <div className="mb-6">
                        <p className="mb-2 text-[10px] font-medium text-[#77777d]">Step {step} of 2</p>
                        <h1 className="text-[22px] font-bold tracking-normal">{step === 1 ? "Create your account" : "Create a strong password"}</h1>
                        <p className="mt-1 text-[12px] text-[#85858b]">{step === 1 ? "Sign up to explore your favorite dishes." : "Use at least 6 characters to secure your account."}</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                        {step === 1 ? (
                            <div>
                                <label htmlFor="email" className="mb-1.5 block text-[11px] font-medium">Email address</label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    autoComplete="email"
                                    {...register("email")}
                                    aria-invalid={!!errors.email}
                                    className={`h-10 w-full rounded-[5px] border px-3 text-[12px] outline-none transition placeholder:text-[#b0b0b5] focus:border-[#252529] ${errors.email ? "border-[#ef4444]" : "border-[#e6e6e8]"}`}
                                />
                                {errors.email && <p className="mt-1 text-[10px] text-[#e34449]">{errors.email.message}</p>}
                            </div>
                        ) : (
                            <FieldGroup className="space-y-4">
                                <Field data-invalid={!!errors.password}>
                                    <FieldLabel htmlFor="password" className="text-[11px]">Password</FieldLabel>
                                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="Create a password" autoComplete="new-password" {...register("password")} aria-invalid={!!errors.password} className={`h-10 rounded-[5px] text-[12px] ${errors.password ? "border-[#ef4444]" : "border-[#e6e6e8]"}`} />
                                    {errors.password && <FieldError errors={[{ message: errors.password.message }]} />}
                                </Field>
                                <Field data-invalid={!!errors.confirmPassword}>
                                    <FieldLabel htmlFor="confirmPassword" className="text-[11px]">Confirm password</FieldLabel>
                                    <Input id="confirmPassword" type={showPassword ? "text" : "password"} placeholder="Confirm your password" autoComplete="new-password" {...register("confirmPassword")} aria-invalid={!!errors.confirmPassword} className={`h-10 rounded-[5px] text-[12px] ${errors.confirmPassword ? "border-[#ef4444]" : "border-[#e6e6e8]"}`} />
                                    {errors.confirmPassword && <FieldError errors={[{ message: errors.confirmPassword.message }]} />}
                                </Field>
                            </FieldGroup>
                        )}

                        {step === 2 && (
                            <label className="flex items-center gap-2 text-[10px] text-[#55555b]">
                                <input type="checkbox" checked={showPassword} onChange={(event) => setShowPassword(event.target.checked)} className="accent-[#19191b]" />
                                Show password
                            </label>
                        )}

                        {step === 1 ? (
                            <Button type="button" onClick={async () => { if (await trigger("email")) setStep(2) }} className="h-10 w-full rounded-[5px] bg-[#19191b] text-[12px] font-medium text-white hover:bg-[#343438]">
                                Let&apos;s Go
                            </Button>
                        ) : (
                            <div className="space-y-2">
                                <Button type="submit" disabled={isSubmitting} className="h-10 w-full rounded-[5px] bg-[#19191b] text-[12px] font-medium text-white hover:bg-[#343438]">
                                    {isSubmitting ? "Creating account..." : "Create account"}
                                </Button>
                                <button type="button" onClick={() => setStep(1)} className="h-9 w-full text-[11px] font-medium text-[#68686e] hover:text-[#19191b]">Back</button>
                            </div>
                        )}
                    </form>

                    <p className="mt-5 text-center text-[10px] text-[#77777d]">Already have an account? <Link href="/signin" className="font-semibold text-[#29292d] underline underline-offset-2">Log in</Link></p>
                </div>
            </section>
            <div className="relative hidden min-h-screen flex-1 bg-[#ece9e4] lg:block">
                <Image
                    src="/image/zurag.png"
                    alt="NomNom delivery rider on the way to a customer"
                    fill
                    priority
                    sizes="60vw"
                    className="object-cover"
                />
            </div>
        </main>
    )
}
// "use client"

// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import * as z from "zod"
// import Image from "next/image"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field"

// const signupSchema = z.object({
//     email: z.string().email("Зөв имэйл хаяг оруулна уу"),
//     password: z.string().min(6, "Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой"),
//     confirmPassword: z.string().min(6, "Нууц үгээ давтан оруулна уу")
// }).refine((data) => data.password === data.confirmPassword, {
//     message: "Нууц үг зөрж байна",
//     path: ["confirmPassword"],
// })

// type SignupFormValues = z.infer<typeof signupSchema>

// export default function SignupPage() {
//     const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormValues>({
//         resolver: zodResolver(signupSchema),
//     })

//     const onSubmit = async (data: SignupFormValues) => {
//         console.log("Signup Data:", data)
//         // Энд сервер рүү бүртгүүлэх хүсэлт илгээнэ
//     }

//     return (
//         <div className="flex min-h-screen w-full">
//             {/* Зүүн тал: Бүртгэлийн формын хэсэг */}
//             <div className="flex w-full items-center justify-center lg:w-1/2 px-8 py-12">
//                 <div className="w-full max-w-sm space-y-6">
//                     <div className="space-y-2">
//                         <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
//                         <p className="text-sm text-gray-500">Sign up to get started with Food delivery</p>
//                     </div>

//                     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                         <FieldGroup className="space-y-4">
//                             <Field data-invalid={!!errors.email}>
//                                 <FieldLabel htmlFor="email">Email</FieldLabel>
//                                 <Input
//                                     id="email"
//                                     type="email"
//                                     placeholder="Enter your email"
//                                     {...register("email")}
//                                     aria-invalid={!!errors.email}
//                                 />
//                                 {errors.email && <FieldError errors={[{ message: errors.email.message }]} />}
//                             </Field>

//                             <Field data-invalid={!!errors.password}>
//                                 <FieldLabel htmlFor="password">Password</FieldLabel>
//                                 <Input
//                                     id="password"
//                                     type="password"
//                                     placeholder="Enter your password"
//                                     {...register("password")}
//                                     aria-invalid={!!errors.password}
//                                 />
//                                 {errors.password && <FieldError errors={[{ message: errors.password.message }]} />}
//                             </Field>

//                             <Field data-invalid={!!errors.confirmPassword}>
//                                 <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
//                                 <Input
//                                     id="confirmPassword"
//                                     type="password"
//                                     placeholder="Confirm password"
//                                     {...register("confirmPassword")}
//                                     aria-invalid={!!errors.confirmPassword}
//                                 />
//                                 {errors.confirmPassword && <FieldError errors={[{ message: errors.confirmPassword.message }]} />}
//                             </Field>
//                         </FieldGroup>

//                         <Button type="submit" disabled={isSubmitting} className="w-full bg-black text-white hover:bg-gray-800">
//                             Let's Go
//                         </Button>
//                     </form>

//                     <div className="text-center text-sm text-gray-500">
//                         Already have an account?{" "}
//                         <Link href="/signin" className="font-semibold text-red-600 hover:underline">
//                             Log in
//                         </Link>
//                     </div>
//                 </div>
//             </div>

//             {/* Баруун тал: Зурагтай хэсэг */}
//             <div className="hidden lg:block relative w-1/2 min-h-screen bg-gray-100">
//                 <Image
//                     src="/image/zurag.png"
//                     alt="Delivery Bike"
//                     fill
//                     priority
//                     sizes="(max-width: 1024px) 100vw, 50vw"
//                     className="object-cover"
//                 />
//             </div>
//         </div>
//     )
// }