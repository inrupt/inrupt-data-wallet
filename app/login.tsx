//
// Copyright Inrupt Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Redirect, useLocalSearchParams } from "expo-router";
import Constants from "expo-constants";
import CustomButton from "@/components/Button";
import { ThemedText } from "@/components/ThemedText";
import { clearWebViewIOSCache } from "react-native-webview-ios-cache-clear";
import Logo from "@/assets/images/future_co.svg";
import { useLoginWebView } from "@/hooks/useInruptLogin";
import { useSession } from "@/hooks/session";

const isRunningInExpoGo = Constants.appOwnership === "expo";

const LoginScreen = () => {
  const { showLoginPage, requestLogout } = useLoginWebView();
  const { logout } = useLocalSearchParams();
  const { session } = useSession();

  useEffect(() => {
    if (logout) {
      requestLogout();
    }
  }, [logout, requestLogout]);

  useEffect(() => {
    if (!isRunningInExpoGo) {
      clearWebViewIOSCache();
      import("@react-native-cookies/cookies")
        .then((CookieManager) =>
          CookieManager.default
            .clearAll()
            .then((success) => console.log("Cleared all cookies?", success))
        )
        .catch((error) => console.log("Failed to clear cookies", error));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
      const RCTNetworking = require("react-native/Libraries/Network/RCTNetworking");
      RCTNetworking.default.clearCookies((result: never) => {
        console.log("clearCookies", result);
      });
    }
  }, []);

  const handleLoginPress = () => {
    showLoginPage();
  };

  if (session) {
    return <Redirect href="/home" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo width="200" height="200" />
        <ThemedText
          style={[styles.header, { paddingTop: 16 }]}
          fontWeight="bold"
        >
          Future Co
        </ThemedText>
        <ThemedText style={styles.header} fontWeight="bold">
          Wallet
        </ThemedText>
      </View>
      <CustomButton
        onPress={handleLoginPress}
        title="Login"
        variant="primary"
        customStyle={{ paddingHorizontal: 74 }}
        testID="login-button"
      ></CustomButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logoContainer: {
    marginBottom: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 36,
    textTransform: "uppercase",
    color: "#1C2033",
    fontWeight: 700,
  },
});

export default LoginScreen;
