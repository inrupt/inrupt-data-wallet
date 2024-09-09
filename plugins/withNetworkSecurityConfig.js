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
const {
  AndroidConfig,
  withAndroidManifest,
  withDangerousMod,
} = require("expo/config-plugins");
const { mkdir, copyFile } = require("fs/promises");
const { join } = require("path");

/**
 * Android network security config
 *
 * @param {import('@expo/config-types').ExpoConfig} config
 * @param {{networkSecurityConfig: string, enable?: boolean}} options
 * @returns {import('@expo/config-types').ExpoConfig} config
 */
module.exports = function withExpoNetworkSecurityConfig(
  config,
  { enable, networkSecurityConfig }
) {
  // Early return switch
  if (!enable) return config;

  console.log("coucou")

  const { getMainApplicationOrThrow } = AndroidConfig.Manifest;
  const { getResourceFolderAsync } = AndroidConfig.Paths;

  // Copy network_security_config.xml to android/app/src/main/res/xml
  withDangerousMod(config, [
    "android",
    async (config) => {
      const { projectRoot } = config.modRequest;
      const resourcePath = await getResourceFolderAsync(projectRoot);

      await mkdir(join(resourcePath, "/xml"), { recursive: true });
      await copyFile(
        join(projectRoot, networkSecurityConfig),
        join(resourcePath, "/xml/network_security_config2.xml")
      );
      await mkdir(join(resourcePath, "/raw"), { recursive: true });
      await copyFile(
        join(projectRoot, "./my-ca.pem"),
        join(resourcePath, "/raw/my_ca")
      );

      return config;
    },
  ]);

  // Add networkSecurityConfig to AndroidManifest.xml
  withAndroidManifest(config, (config) => {
    const mainApplication = getMainApplicationOrThrow(config.modResults);

    // mainApplication.$["android:networkSecurityConfig"] =
    //   "@xml/network_security_config2";
    delete mainApplication.$["android:networkSecurityConfig"];
    console.log(JSON.stringify(config, null, 2));
    return config;
  });

  return config;
};
