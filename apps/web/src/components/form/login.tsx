import type { JSX } from "react";
import { Button, Input, Label } from "@repo/ui";

export default function LoginForm(): JSX.Element {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h1 className="font-semibold text-lg">Sign in to account</h1>
                <p className="font-light text-xs">Enter your email & password to login</p>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input className="text-xs" id="email" placeholder="john.doe@gmail.com" type="email" />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input className="text-xs" id="password" placeholder="*********" type="password" />
                </div>
                <div className="flex flex-col gap-2">
                    <Button className="p-0 h-auto w-fit" type="button" variant="link">Forgot Password?</Button>
                    <Button className="text-xs w-full" type="submit">Sign In</Button>
                </div>
            </div>
        </div>
    );
}