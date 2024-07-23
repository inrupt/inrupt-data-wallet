//
// Copyright Inrupt Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
// Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

export const SESSION_KEY = "session";

export const makeApiRequest = async <T>(
  endpoint: string,
  method: string = "GET",
  body: unknown = null,
  contentType: string | null = "application/json"
): Promise<T> => {
  const session = await SecureStore.getItemAsync(SESSION_KEY);
  if (!session) return {} as T;

  const headers: HeadersInit = {};

  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body !== null) {
    options.body = body as BodyInit;
  }

  const response = await fetch(
    `${process.env.EXPO_PUBLIC_WALLET_API}/${endpoint}`,
    options
  );

  if (response.status === 401) {
    router.navigate("/profile?forceLogout=true");
    throw new Error(`Unauthorized: ${response.status}`);
  }
  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }

  const responseType = response.headers.get("content-type");
  if (
    responseType?.includes("application/json") ||
    responseType?.includes("application/ld+json")
  ) {
    const result: T = await response.json();
    return result;
  }
  if (
    responseType?.includes("text/plain") ||
    responseType?.includes("text/turtle")
  ) {
    const result: T = (await response.text()) as unknown as T;
    return result;
  }

  const result: T = (await response.blob()) as unknown as T;
  return result;
};

export const objectToParams = (
  obj: Record<string, string | number | boolean | null | undefined>
): string => {
  const params = new URLSearchParams();

  Object.entries(obj).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      params.append(key, String(value));
    }
  });

  return params.toString();
};
