"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import Link from "next/link"
import { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { UserContext } from "@/context/UserContext"

const formSchema = z.object({
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

const Loginform = () => {
    const [showPassword, setShowPassword] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: "", password: "" },
    })
    const context = useContext(UserContext)

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        await context?.signIn(data.email, data.password)
    }

    return (
        <main className="flex min-h-screen w-full bg-white">
            <section className="flex w-full items-center justify-center px-6 py-12 sm:px-10 lg:w-[40%]">
                <div className="w-full max-w-[310px]">
                    <Link href="/signup" aria-label="Back to sign up" className="mb-12 inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#eeeeef] text-sm text-[#77777d] hover:bg-[#f7f7f8]">‹</Link>
                    <Link href="/" className="mb-8 flex items-center gap-2 text-sm font-semibold">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff464b] text-white">N</span>
                        NomNom
                    </Link>
                    <div className="mb-6">
                        <h1 className="text-[22px] font-bold tracking-normal">Welcome back</h1>
                        <p className="mt-1 text-[12px] text-[#85858b]">Log in to enjoy your favorite dishes.</p>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
                        <div>
                            <label htmlFor="login-email" className="mb-1.5 block text-[11px] font-medium">Email</label>
                            <input
                                id="login-email"
                                type="email"
                                autoComplete="email"
                                placeholder="Enter your email address"
                                aria-invalid={!!form.formState.errors.email}
                                className={`h-10 w-full rounded-[5px] border px-3 text-[12px] outline-none transition placeholder:text-[#b0b0b5] focus:border-[#252529] ${form.formState.errors.email ? "border-[#ef4444]" : "border-[#e6e6e8]"}`}
                                {...form.register("email")}
                            />
                            {form.formState.errors.email && <p className="mt-1 text-[10px] text-[#e34449]">{form.formState.errors.email.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="login-password" className="mb-1.5 block text-[11px] font-medium">Password</label>
                            <input
                                id="login-password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                aria-invalid={!!form.formState.errors.password}
                                className={`h-10 w-full rounded-[5px] border px-3 text-[12px] outline-none transition placeholder:text-[#b0b0b5] focus:border-[#252529] ${form.formState.errors.password ? "border-[#ef4444]" : "border-[#e6e6e8]"}`}
                                {...form.register("password")}
                            />
                            {form.formState.errors.password && <p className="mt-1 text-[10px] text-[#e34449]">{form.formState.errors.password.message}</p>}
                        </div>
                        <label className="flex items-center gap-2 text-[10px] text-[#55555b]">
                            <input type="checkbox" checked={showPassword} onChange={(event) => setShowPassword(event.target.checked)} className="accent-[#19191b]" />
                            Show password
                        </label>
                        <button type="submit" disabled={form.formState.isSubmitting} className="h-10 w-full rounded-[5px] bg-[#19191b] text-[12px] font-medium text-white transition hover:bg-[#343438] disabled:opacity-60">
                            {form.formState.isSubmitting ? "Logging in..." : "Log in"}
                        </button>
                    </form>

                    <p className="mt-5 text-center text-[10px] text-[#77777d]">Don&apos;t have an account? <Link href="/signup" className="font-semibold text-[#29292d] underline underline-offset-2">Sign up</Link></p>
                </div>
            </section>
            <div className="relative hidden min-h-screen flex-1 bg-[#ece9e4] lg:block">
                <Image src="/image/zurag.png" alt="NomNom delivery rider on the way to a customer" fill priority sizes="60vw" className="object-cover" />
            </div>
        </main>
    )
}

export default Loginform


// "use client"
// import axios from "axios"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useContext, useState } from "react"

// import * as z from "zod"
// import { Controller, useForm } from "react-hook-form"
// import { FieldGroup, FieldError } from "@/components/ui/field"
// import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"

// import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { useRouter } from "next/navigation"
// import { UserContext } from "@/context/Usercontext"



// const Loginform = () => {
//     const router = useRouter()
//     const formSchema = z.object({
//         email: z.string().email("ta zow email oruulna uu"),
//         password: z.string().min(6, "ta urt pass hiin vv").max(10, "ta bogin pass hiin vv")
//     })

//     const form = useForm<z.infer<typeof formSchema>>({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             email: "",
//             password: ""
//         },
//     })
//     const context = useContext(UserContext)
//     const onSubmit = async (data: z.infer<typeof formSchema>) => {
//         console.log("CONTEXT", context)
//         console.log("submit amjilttai", data);
//         context?.signIn(data.email, data.password)
//     }
//     return <div className="w-1/2 flex justify-center flex-col items-center h-screen ">
//         <div className="flex justify-center  gap-6">

//             <div className="w-[300px]">
//                 <h1>Log in </h1>
//                 <p>Log in to enjoy your favorite dishes</p>
//                 <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
//                     <FieldGroup>
//                         <Controller
//                             name="email"
//                             control={form.control}
//                             render={({ field, fieldState }) => (
//                                 <Field data-invalid={fieldState.invalid}>
//                                     <FieldLabel htmlFor="form-rhf-demo-title">
//                                         Email
//                                     </FieldLabel>
//                                     <Input
//                                         {...field}
//                                         id="form-rhf-demo-title"
//                                         aria-invalid={fieldState.invalid}
//                                         placeholder="enter your email"
//                                         autoComplete="off"
//                                     />
//                                     {fieldState.invalid && (
//                                         <FieldError errors={[fieldState.error]} />
//                                     )}
//                                 </Field>
//                             )}
//                         />
//                         <Controller
//                             name="password"
//                             control={form.control}
//                             render={({ field, fieldState }) => (
//                                 <Field data-invalid={fieldState.invalid}>
//                                     <FieldLabel htmlFor="form-rhf-demo-description">
//                                         password
//                                     </FieldLabel>
//                                     <Input
//                                         {...field}
//                                         id="form-rhf-demo-title"
//                                         aria-invalid={fieldState.invalid}
//                                         placeholder="enter your password"
//                                         autoComplete="off"
//                                     />

//                                     {fieldState.invalid && (
//                                         <FieldError errors={[fieldState.error]} />
//                                     )}
//                                 </Field>
//                             )}
//                         />
//                     </FieldGroup>
//                 </form>

//                 <Field orientation="horizontal" >
//                     <Button type="button" variant="outline" onClick={() => form.reset()}>
//                         Reset
//                     </Button>
//                     <Button type="submit" form="form-rhf-demo">
//                         Submit
//                     </Button>
//                 </Field>
//             </div>
//         </div>
//     </div >



// }
// export default Loginform