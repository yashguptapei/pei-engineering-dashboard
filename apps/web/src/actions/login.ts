"use server";

import { jwtDecode } from "jwt-decode";
import { api, setCookie } from "../lib/utils";

export async function login(accessToken: string): Promise<void> {
  const { getCookie } = await api.post("/auth/login", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const setCookieHeader = getCookie("set-cookie");
  if (setCookieHeader) {
    const sessionToken = setCookieHeader.split(";")[0].split("=")[1];
    const decodedToken = jwtDecode(sessionToken);
    await setCookie("session", sessionToken, {
      secure: true,
      httpOnly: true,
      sameSite: "lax",
      expires: decodedToken.exp ? new Date(decodedToken.exp * 1000) : undefined,
    });
  }
}
