// src/shared/api/http.js
import { tokenStore } from "../lib/storage";

export async function http(method, url, { body, headers } = {}) {
  const token = tokenStore.get?.();
  const res = await fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const ctype = res.headers.get("content-type") || "";
  const data = ctype.includes("application/json")
    ? await res.json()
    : await res.text();
  if (!res.ok) {
    const msg =
      typeof data === "string" ? data : data?.message || "Request failed";
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}
export const get = (u, o) => http("GET", u, o);
export const post = (u, b, o = {}) => http("POST", u, { ...o, body: b });
