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
/* eslint-disable global-require */

import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import {
  QueryClientProvider,
  QueryClient,
  focusManager,
} from "@tanstack/react-query";

import { SessionProvider } from "@/hooks/session";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import type { AppStateStatus } from "react-native";
import { AppState, Platform } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
// eslint-disable-next-line @typescript-eslint/no-floating-promises
SplashScreen.preventAutoHideAsync();
// Create a client
const queryClient = new QueryClient();

export default function RootLayout() {
  function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== "web") {
      focusManager.setFocused(status === "active");
    }
  }
  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, []);

  const [loaded] = useFonts({
    "ReadexPro-Regular": require("../assets/fonts/ReadexPro-Regular.ttf"),
    "ReadexPro-Medium": require("../assets/fonts/ReadexPro-Medium.ttf"),
    "ReadexPro-SemiBold": require("../assets/fonts/ReadexPro-SemiBold.ttf"),
    "ReadexPro-Bold": require("../assets/fonts/ReadexPro-Bold.ttf"),
    "ReadexPro-Light": require("../assets/fonts/ReadexPro-Light.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      // eslint-disable-next-line no-console
      SplashScreen.hideAsync().catch((e) => console.log(e));
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <SessionProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen
                  name="scan-qr"
                  options={{
                    headerShown: false,
                    // Set the presentation mode to modal for our modal route.
                    // presentation: "fullScreenModal",
                    animation: "slide_from_bottom",
                    animationDuration: 200,
                  }}
                />
              </Stack>
            </SessionProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
