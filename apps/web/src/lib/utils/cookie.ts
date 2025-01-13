import { cookies } from "next/headers";

/**
 * Get a cookie by its name.
 * @param name - The name of the cookie to retrieve.
 * @returns A promise that resolves to the value of the cookie or undefined if it doesn't exist.
 */
export async function getCookie(name: string): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
}

/**
 * Set a cookie.
 * @param name - The name of the cookie to set.
 * @param value - The value of the cookie.
 * @param options - Additional options for the cookie, such as:
 *   - `path`: The path where the cookie is accessible. Defaults to '/'.
 *   - `maxAge`: The maximum age of the cookie in seconds. Defaults to a session cookie.
 *   - `secure`: Whether the cookie is only sent over HTTPS. Defaults to `false`.
 *   - `httpOnly`: Whether the cookie is inaccessible to JavaScript's `Document.cookie` API. Defaults to `false`.
 *   - `sameSite`: The SameSite attribute of the cookie. Can be 'strict', 'lax', or 'none'. Defaults to 'lax'.
 *   - `expires`: The expiration date of the cookie.
 * @returns A promise that resolves when the cookie has been set.
 */
export async function setCookie(
  name: string,
  value: string,
  options: {
    path?: string;
    maxAge?: number;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: "strict" | "lax" | "none";
    expires?: Date;
  } = {}
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(name, value, options);
}

/**
 * Delete a cookie by its name.
 * @param name - The name of the cookie to delete.
 * @returns A promise that resolves when the cookie has been deleted.
 */
export async function deleteCookie(name: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(name);
}

/**
 * Check if a cookie exists.
 * @param name - The name of the cookie to check.
 * @returns A promise that resolves to true if the cookie exists, otherwise false.
 */
export async function hasCookie(name: string): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.has(name);
}

/**
 * Get all cookies as an object.
 * @returns A promise that resolves to an object containing all cookies with their names and values.
 */
export async function getAllCookies(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const allCookies: Record<string, string> = {};

  cookieStore.getAll().forEach(({ name, value }) => {
    allCookies[name] = value;
  });

  return allCookies;
}
