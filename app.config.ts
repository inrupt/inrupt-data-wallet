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
import type { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "inrupt-wallet-frontend",
  slug: "inrupt-wallet-frontend",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/logo.png",
  scheme: "inrupt-wallet",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.inrupt.inrupt-wallet",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.inrupt.wallet",
    blockedPermissions: [
      "android.permission.RECORD_AUDIO",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE",
    ],
    allowBackup: false,
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/logo.png",
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    "@config-plugins/detox",
    [
      "expo-build-properties",
      {
        android: {
          usesCleartextTraffic: process.env.NODE_ENV === "development",
        },
      },
    ],
    "./plugins/withSigningConfig",
  ],
  experiments: {
    typedRoutes: true,
  },
});
