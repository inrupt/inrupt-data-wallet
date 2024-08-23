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
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from "react-native";
import { Redirect } from "expo-router";
import Constants from "expo-constants";
import { SvgXml } from "react-native-svg";
import type { WebViewNavigation } from "react-native-webview";
import { WebView } from "react-native-webview";
import { useSession } from "@/hooks/session";
import CustomButton from "@/components/Button";
import { ThemedText } from "@/components/ThemedText";
import { clearWebViewIOSCache } from "react-native-webview-ios-cache-clear";
import LogoSvg from "../assets/images/future_co.svg";

const isRunningInExpoGo = Constants.appOwnership === "expo";

// Despite what TS says, this works, so we can keep this as is
// for now.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const Logo = () => <SvgXml width="200" height="200" xml={LogoSvg} />;

const LoginScreen = () => {
  const [showWebView, setShowWebView] = useState(false);
  const { signIn, session } = useSession();

  useEffect(() => {
    clearWebViewIOSCache();
    if (!isRunningInExpoGo) {
      import("@react-native-cookies/cookies")
        .then((CookieManager) =>
          CookieManager.default
            .clearAll()
            .then((success) => console.log("Cleared all cookies?", success))
        )
        .catch((error) => console.log("Failed to clear cookies", error));
    }
  }, []);

  if (session) {
    return <Redirect href="/home" />;
  }
  const handleLoginPress = () => {
    setShowWebView(true);
  };

  const handleNavigationStateChange = async (navState: WebViewNavigation) => {
    const { url } = navState;

    const isLoginSuccess = url.includes("/login/success");

    if (isLoginSuccess) {
      signIn();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo />
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

      <Modal visible={showWebView} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
          <WebView
            source={{ uri: process.env.EXPO_PUBLIC_LOGIN_URL || "" }}
            onNavigationStateChange={handleNavigationStateChange}
            incognito={false}
            domStorageEnabled={false}
            sharedCookiesEnabled={true}
            thirdPartyCookiesEnabled={true}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowWebView(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
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

  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    elevation: 2,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#007BFF",
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
