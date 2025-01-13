import type { ApiClientOptionsI } from "../../types";
import { getAllCookies } from "./cookie";

/**
 * Base URL for the API.
 */
const BASE_URL = process.env.BASE_API_URL || "https://localhost:3020/api";

/**
 * Retrieves the default headers for the API requests, including cookies.
 *
 * @returns The default headers object.
 */
const getDefaultHeaders = async (): Promise<Record<string, string>> => {
  const cookies = await getAllCookies();
  return {
    "Content-Type": "application/json",
    Cookie: Object.entries(cookies)
      .map(([name, value]) => `${name}=${value}`)
      .join("; "),
  };
};

/**
 * Builds a URL with query parameters.
 *
 * @param url - The base URL.
 * @param params - The query parameters as a key-value object.
 * @returns The full URL with query parameters appended.
 */
const buildUrl = (
  url: string,
  params?: Record<string, string | number | boolean>
): string => {
  if (!params) return url;
  const queryParams = new URLSearchParams(
    params as Record<string, string>
  ).toString();
  return `${url}?${queryParams}`;
};

/**
 * Handles the API response.
 *
 * @param response - The fetch response object.
 * @returns The parsed JSON response data and headers.
 * @throws If the response status is not OK.
 */
const handleResponse = async <T>(
  response: Response
): Promise<{ data: T; headers: Headers }> => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error: ${response.status} - ${errorText}`);
  }

  const data = (await response.json()) as T;
  return { data, headers: response.headers };
};

/**
 * Retrieves the value of a specified cookie from the provided headers.
 *
 * @param cookieName - The name of the cookie to retrieve.
 * @param headers - The Headers object containing the cookies.
 * @returns The value of the specified cookie, or null if not found.
 */
const getCookiesFromHeaders = (
  cookieName: string,
  headers: Headers
): string | null => {
  return headers.get(cookieName);
};

/**
 * Makes a GET request to the API.
 *
 * @param url - The endpoint URL.
 * @param options - The request options.
 * @returns The response data.
 */
const get = async <T>(
  url: string,
  options: ApiClientOptionsI = {}
): Promise<{ data: T }> => {
  const { params, headers, credentials = "include" } = options;
  const fullUrl = buildUrl(`${BASE_URL}${url}`, params);

  const response = await fetch(fullUrl, {
    method: "GET",
    headers: {
      ...(await getDefaultHeaders()),
      ...headers,
    },
    credentials,
  });

  const { data } = await handleResponse(response);
  return { data: data as T };
};

/**
 * Makes a POST request to the API.
 *
 * @param url - The endpoint URL.
 * @param options - The request options.
 * @returns The response data and a method to get cookies.
 */
const post = async <T>(
  url: string,
  options: ApiClientOptionsI = {}
): Promise<{ data: T; getCookie: (cookieName: string) => string | null }> => {
  const { body, headers, credentials = "include" } = options;

  const response = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers: {
      ...(await getDefaultHeaders()),
      ...headers,
    },
    body: body && !(body instanceof FormData) ? JSON.stringify(body) : body,
    credentials,
  });

  const { data, headers: responseHeaders } = await handleResponse(response);
  return {
    data: data as T,
    getCookie: (cookieName: string) =>
      getCookiesFromHeaders(cookieName, responseHeaders),
  };
};

/**
 * Makes a PUT request to the API.
 *
 * @param url - The endpoint URL.
 * @param options - The request options.
 * @returns The response data.
 */
const put = async <T>(
  url: string,
  options: ApiClientOptionsI = {}
): Promise<{ data: T }> => {
  const { body, headers, credentials = "include" } = options;

  const response = await fetch(`${BASE_URL}${url}`, {
    method: "PUT",
    headers: {
      ...(await getDefaultHeaders()),
      ...headers,
    },
    body: body && !(body instanceof FormData) ? JSON.stringify(body) : body,
    credentials,
  });

  const { data } = await handleResponse(response);
  return { data: data as T };
};

/**
 * Makes a DELETE request to the API.
 *
 * @param url - The endpoint URL.
 * @param options - The request options.
 * @returns The response data.
 */
const del = async <T>(
  url: string,
  options: ApiClientOptionsI = {}
): Promise<{ data: T }> => {
  const { headers, credentials = "include" } = options;

  const response = await fetch(`${BASE_URL}${url}`, {
    method: "DELETE",
    headers: {
      ...(await getDefaultHeaders()),
      ...headers,
    },
    credentials,
  });

  const { data } = await handleResponse(response);
  return { data: data as T };
};

export const api = { get, post, put, del };
