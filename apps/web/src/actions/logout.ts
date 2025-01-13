"use server";

import { api, deleteCookie } from "../lib/utils";

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
  await deleteCookie("session");
}
