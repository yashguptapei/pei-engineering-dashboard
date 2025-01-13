"use client"

import { Button } from "@repo/ui";
import Image from "next/image";
import type { JSX } from "react";
import { logout } from "../actions";
import { redirect } from "next/navigation";

export default function Page(): JSX.Element {
  async function handleLogout() {
    await logout();
    redirect("/login");
  }
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <p>Home page</p>

      <Button className="text-xs" onClick={() => void handleLogout()}>Sign Out</Button>

      <Image alt="Logo" height={50} src="pei-group-logo.svg" width={100} />
    </main>
  );
}
