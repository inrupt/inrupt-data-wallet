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
import React, { useEffect } from "react";
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
import Logo from "@/assets/images/future_co.svg";
import type { WebViewNavigation } from "react-native-webview";
import { WebView } from "react-native-webview";
import { useSession } from "@/hooks/session";
import CustomButton from "@/components/Button";
import { ThemedText } from "@/components/ThemedText";
import { clearWebViewIOSCache } from "react-native-webview-ios-cache-clear";

const isRunningInExpoGo = Constants.appOwnership === "expo";

const LoginScreen = () => {
  const [showWebView, setShowWebView] = React.useState(false);
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
