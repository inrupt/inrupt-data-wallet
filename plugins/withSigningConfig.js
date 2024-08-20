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
const {
  withAppBuildGradle,
  withGradleProperties,
} = require("expo/config-plugins");
const { readFile } = require("fs/promises");

module.exports = function withSigningConfig(config) {
  // Add path to gradle signing snippet to gradle.properties.
  // This is then used by the android/app/build.gradle mod.
  withGradleProperties(config, async (gradleProps) => {
    if (process.env.SIGNING_CONFIG_PATH === undefined) {
      throw new Error("Missing environment variable SIGNING_CONFIG_PATH");
    }
    gradleProps.modResults.push({
      type: "comment",
      value: "Path to the signing configuration gradle snippet",
    });
    gradleProps.modResults.push({
      type: "property",
      key: "inrupt.wallet.frontend.signing",
      value: process.env.SIGNING_CONFIG_PATH,
    });
    if (process.env.KEYSTORE_PATH === undefined) {
      throw new Error("Missing environment variable KEYSTORE_PATH");
    }
    if (process.env.KEYSTORE_PASSWORD === undefined) {
      throw new Error("Missing environment variable KEYSTORE_PASSWORD");
    }
    gradleProps.modResults.push({
      type: "comment",
      value: "Keystore configuration for app signing.",
    });
    gradleProps.modResults.push({
      type: "property",
      key: "inrupt.wallet.frontend.keystore.file",
      value: process.env.KEYSTORE_PATH,
    });
    gradleProps.modResults.push({
      type: "property",
      key: "inrupt.wallet.frontend.keystore.password",
      value: process.env.KEYSTORE_PASSWORD,
    });
    gradleProps.modResults.push({
      type: "property",
      key: "inrupt.wallet.frontend.key.alias",
      value: "wallet",
    });
    gradleProps.modResults.push({
      type: "property",
      key: "inrupt.wallet.frontend.key.password",
      value: process.env.KEYSTORE_PASSWORD,
    });
    return gradleProps;
  });
  // Append a block to android/app/build.gradle to reuse signing config
  // from /android-config/signing-config.gradle.
  withAppBuildGradle(config, async (buildGradle) => {
    const updatedBuildGradle = { ...buildGradle };
    // The following path is relative to the project root
    const buildGradleSnippet = await readFile(
      "./android-config/extend-build.gradle",
      { encoding: "utf8" }
    );
    updatedBuildGradle.modResults.contents =
      buildGradle.modResults.contents.concat("\n", buildGradleSnippet);
    return updatedBuildGradle;
  });
  return config;
};
