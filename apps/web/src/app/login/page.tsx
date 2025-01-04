import Image from "next/image";
import type { JSX } from "react";
import LoginForm from "../../components/form/login";

export default function LoginPage(): JSX.Element {
    return (
        <div className="p-5 flex flex-col gap-7 h-screen">
            {/* Logo */}
            <div className="flex justify-center">
                <Image alt="Logo" height={50} src="/pei-group-logo.svg" width={100} />
            </div>
            {/* Login Form */}
            <LoginForm />
        </div>
    );
}