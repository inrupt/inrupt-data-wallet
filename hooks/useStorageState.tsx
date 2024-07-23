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
import { useState, useEffect, useCallback } from "react";
import * as SecureStore from "expo-secure-store";

type UseStateHook<T> = [T | undefined, (value: T | null) => void];

function useAsyncState<T>(initialState?: T): UseStateHook<T> {
  const [state, setState] = useState<T | undefined>(initialState);
  const setAsyncState = useCallback(
    (value: T | null) => {
      setState(value ?? undefined);
    },
    [setState]
  );
  return [state, setAsyncState];
}

function setStorageItemAsync(key: string, value: string | null): void {
  if (value === null) {
    SecureStore.deleteItemAsync(key).catch((e) => {
      // eslint-disable-next-line no-console
      console.error("Something wrong while deleting key:", e);
    });
  } else {
    SecureStore.setItemAsync(key, value).catch((e) => {
      // eslint-disable-next-line no-console
      console.error("something wrong while logout:", e);
    });
  }
}

export function useStorageState(key: string): UseStateHook<string> {
  const [state, setState] = useAsyncState<string>();

  useEffect(() => {
    SecureStore.getItemAsync(key).catch(() =>
      // eslint-disable-next-line no-console
      console.error(`Can not get data with key:${key}`)
    );
  }, [key, setState]);

  const setValue = useCallback(
    async (value: string | null) => {
      setState(value);
      try {
        await setStorageItemAsync(key, value);
      } catch (error) {
        /* empty */
      }
    },
    [key, setState]
  );

  return [state, setValue];
}
