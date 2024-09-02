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
import React, { useEffect, useRef, useState } from "react";
import type { WebViewNavigation } from "react-native-webview";
import { WebView } from "react-native-webview";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from "react-native";

const HTML_BLANK =
  '<html lang="us"><body style="background-color:white;"></body></html>';

const LoginWebViewModal = ({
  visible = false,
  onLoginSuccess = () => null,
  onLogoutSuccess = () => null,
  onClose = () => null,
  requestMode = "blank",
}: {
  visible: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  onLogoutSuccess: () => void;
  requestMode: "login" | "logout" | "blank";
}) => {
  const BASE_URL = `${process.env.EXPO_PUBLIC_WALLET_API}/`;
  const LOGIN_URL = process.env.EXPO_PUBLIC_LOGIN_URL || "";
  const LOGOUT_URL = `${BASE_URL}logout`;

  const webViewRef = useRef(null);
  const [webUrl, setWebUrl] = useState(LOGIN_URL);

  useEffect(() => {
    if (requestMode === "login") {
      setWebUrl(LOGIN_URL);
    }
    if (requestMode === "logout") {
      setWebUrl(LOGOUT_URL);
    }
    if (requestMode === "blank") {
      setWebUrl("");
    }
    if (visible) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      webViewRef.current!.reload();
    }
  }, [visible, requestMode]);

  const handleNavigationStateChange = async (navState: WebViewNavigation) => {
    const { url } = navState;
    const isLoginSuccess = url.includes("/login/success");
    const isLogout = url === `${process.env.EXPO_PUBLIC_WALLET_API}/`;

    if (isLoginSuccess) {
      onLoginSuccess();
    }

    if (isLogout) {
      onLogoutSuccess();
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          display: visible ? "flex" : "none",
          opacity: visible ? 1 : 0,
        },
      ]}
    >
      <WebView
        ref={webViewRef}
        source={webUrl ? { uri: webUrl } : { html: HTML_BLANK }}
        onNavigationStateChange={handleNavigationStateChange}
        incognito={false}
        domStorageEnabled={false}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
      />
      <TouchableOpacity style={styles.closeButton} onPress={() => onClose()}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    backgroundColor: "transparent",
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
});

export default LoginWebViewModal;
