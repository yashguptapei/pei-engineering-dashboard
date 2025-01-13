"use client"

import type { JSX } from "react";
import { Button, cn, Input, Label } from "@repo/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { redirect, useSearchParams } from "next/navigation";
import { auth } from "../../lib/config/firebase";
import { type LoginFormI, LoginFormSchema } from "../../types";
import { login } from "../../actions";

export default function LoginForm(): JSX.Element {
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect') || '/';

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<LoginFormI>({
        resolver: zodResolver(LoginFormSchema),
    });

    const onSubmit = ({ email, password }: LoginFormI): void => {
        signInWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
            const accessToken = await userCredential.user.getIdToken();
            await login(accessToken);
            reset();
            redirect(redirectUrl);
        }).catch((error) => {
            throw error;
        });
    };

    return (
        <form className="flex flex-col gap-6" onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
            <div className="flex flex-col gap-1">
                <h1 className="font-semibold text-lg">Sign in to account</h1>
                <p className="font-light text-xs">Enter your email & password to login</p>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input {...register("email")} className={cn("test-sm", { "border border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500": Boolean(errors.email) })} id="email" placeholder="john.doe@gmail.com" type="email" />
                    {errors.email ? <p className="text-red-500 text-xs">{errors.email.message}</p> : null}
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input {...register("password")} className={cn("test-sm", { "border border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500": Boolean(errors.password) })} id="password" placeholder="*********" type="password" />
                    {errors.password ? <p className="text-red-500 text-xs">{errors.password.message}</p> : null}
                </div>
                <div className="flex flex-col gap-2">
                    <Button className="p-0 h-auto w-fit" type="button" variant="link">Forgot Password?</Button>
                    <Button className="text-xs w-full" disabled={isSubmitting} type="submit">Sign In</Button>
                </div>
            </div>
        </form>
    );
}