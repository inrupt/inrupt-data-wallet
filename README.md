# Data Wallet Application

This project produces a front-end react native application for use with the Inrupt Data Wallet service.
This README provides information on:

* [Setup and configuration](#setup-and-configuration)
  * [Prerequisites](#prerequisites)
  * [Install dependencies](#install-dependencies)
  * [Configure build environment](#configure-build-environment)
    * [Create keystore](#create-keystore)
    * [Make the keystore available to CI](#make-the-keystore-available-to-ci)
* [Running the application locally](#running-the-application-locally)
  * [On a device with Expo Go](#on-a-device-with-expo-go)
  * [On an Android emulator](#on-an-android-emulator)
  * [On an iOS simulator](#on-an-ios-simulator)
* [Build the app on EAS](#build-the-app-on-eas)
* [Testing with Detox](#testing-with-detox)
  * [On Android](#on-android)
  * [On iOS](#on-ios)
* [UI overview](#ui-overview)
  * [Home](#home)
  * [Profile](#profile)
  * [Requests](#requests)
  * [Access](#access)
* [Issues & Help](#issues--help)
  * [Bugs and Feature Requests](#bugs-and-feature-requests)
  * [Documentation](#documentation)
  * [Changelog](#changelog)
  * [License](#license)

## Setup and configuration

### Prerequisites

Ensure that you have the following dependencies installed and configured:

- [Expo Go](https://expo.dev/go) - app to be installed on a real device
- [Xcode](https://apps.apple.com/us/app/xcode/id497799835)
- [iOS simulators](https://developer.apple.com/documentation/safari-developer-tools/installing-xcode-and-simulators)
- [Android emulators](https://developer.android.com/studio/install)

### Install dependencies

First, install all the project dependencies.

```bash
npm ci
```

### Configure build environment

Copy the `.env.sample` file to `.env` and fill in any relevant values.

If you are testing manually, the minimal configuration is the URLs for the wallet's backend service.
```
EXPO_PUBLIC_LOGIN_URL=
EXPO_PUBLIC_WALLET_API=
```

Automated testing also requires access credentials for the Data Wallet:
```bash
TEST_ACCOUNT_USERNAME=<Wallet username>
TEST_ACCOUNT_PASSWORD=<Wallet password>
```

For testing with iOS simulators, you will need:
```bash
IOS_BINARY_PATH=<Path to the built iOS binary>
TEST_IOS_SIM=<Name of the iOS simulator on your device>
```

For testing with Android emulators, you will need:
```bash
ANDROID_BINARY_PATH=<Path to the main Android binary>
ANDROID_TEST_BINARY_PATH=<Path to the test Android binary>
TEST_ANDROID_EMU=<Name of the Android emulator on your device>
```
Ensure that the ``TEST_ANDROID_EMU`` configuration aligns with a device emulator in Android Studio.
For example: ``TEST_ANDROID_EMU=Android_34``. If the emulated device is called "Test Emulator 33",
the EMU name will be ``Test_Emulator_33``.

#### Create keystore for Android

The Android app will need to be signed for it to be installed. See: https://reactnative.dev/docs/signed-apk-android
for more information on this.

__WARNING:__ The following is only to be used for development. In production the keystore should
be generated and configured in a more secure manner.

To generate a keystore with a key and cert run the following from the root of the project (this requires a Java JDK
installation):

```bash
keytool -genkeypair -v -storetype PKCS12 \
 -keystore android/app/wallet.keystore \
 -alias wallet -keyalg RSA -keysize 2048 -validity 100 \
 -noprompt -dname "CN=wallet.example.com"
```

Add the following to: `.env` and update the placeholders.
```text
KEYSTORE_PATH=<path>/inrupt-data-wallet/android/app/wallet.keystore
KEYSTORE_PASSWORD=<keystore password>
```

#### Make the keystore available to CI

In order to make the keystore available to CI, it has to be present in the repository secret.
- Encrypting the keystore with a GPG key to get a Base64 representation: `gpg -c --armor wallet.keystore`
- Create GitHub repository secrets:
  - ENCRYPTED_KEYSTORE with the Base64-encoded encrypted keystore
  - KEYSTORE_DECRYPTION_KEY with the GPG key
  - KEYSTORE_PASSWORD with the keystore password
- In CI, decrypt the keystore back: `gpg -d --passphrase "..." --batch wallet.keystore.asc > wallet.keystore`

## Running the application locally

Start the application:

```bash
npx expo start
```

In the output, you'll find options to open the app in a
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo.
- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)

### On a device with Expo Go

Press ``s`` to switch to the Expo Go environment. This will display a QR code which you will need to scan from your
device's Expo Go application.

The Wallet application will then build and install into your device for you to test & debug.

### On an Android emulator

For Android, ensure that a virtual device has been added to the Android emulator by opening the new Device Manager with
the following actions: 
* Go to the Android Studio Welcome screen
* Select **More Actions > Virtual Device Manager.**

```bash
npm run android
```
Note: When running on the android emulator, there is a special loopback IP, 10.0.2.2, which points to the host machine 127.0.0.1. You can use it if the emulator complains about cleartext communication to the local network IP of the host.
### On an iOS simulator

To build the iOS wallet app in an iOS simulator, just run the following command:

```bash
npm run ios
```

This will install the necessary CocoaPods and compile the application. Upon completion, the iOS simulator should be open and the wallet app running.

## Build the app on EAS

Both the Android and the iOS versions of the app can be built using the Expo Application Service (EAS). To do so, follow
the instructions from the [EAS documentation](https://docs.expo.dev/build/setup/).

Note that the project ID is not hard-coded in the `app.config.ts`, but provided as an environment variable instead.
In order to trigger an EAS build, please add the appropriate project ID in your environment, e.g.

```
EAS_PROJECT_ID="..." eas build --platform android --local --profile preview
```

## Testing with Detox

### On Android

Run the following command to build the Android app. This process may take up to 30 minutes to complete.

```bash
npx detox build --configuration=android.emu.release
```

For local development (a back-end server running on localhost or at an alternative location), use
the `android.emu.debug` configuration. If running the debug configuration, make sure to run the
development server (`npx expo start`).

Once built, run the detox tests for the relevant configuration:

```bash
npx detox test --configuration=android.emu.release
```

After completion, the binary apps will be located in:
```bash
./android/app/build/outputs
```

You can share the .apk files with others who need to run the Detox tests without building the Android app locally.

### On iOS

If you want to generate the iOS binary, run the following commands. Note that this process may take around 30 minutes to complete.

```bash
xcodebuild -workspace ios/inruptwalletfrontend.xcworkspace -scheme inruptwalletfrontend -configuration Release -sdk iphonesimulator -derivedDataPath ios/build
```

After completion, the iOS binary should be located at:

```bash
inrupt-data-wallet/ios/build/Build/Products/inruptwalletfrontend.app
```

You can share the .app file with others who need to run the Detox tests without building the iOS app locally.

Execute the command below to start Detox test on iOS.
```bash
npx detox test --configuration=ios.sim.release
```

## UI overview

Upon execution, the application prompts the user to log in. After successful authentication, the wallet app presents various views, located in the `app/(tabs)` directory: 
- [Home](#home)
- [Profile](#profile)
- [Requests](#requests)
- [Access](#access)

### Home
This page allows users to see all their assets within the wallet. 

For each item, users can share it via QR code, download it, or delete it.
Additionally, users can add new items: they can upload an existing photo, take a new one using the camera, upload an existing file, or use the QR scanner to request access to one.

### Profile

This page displays the profile information of the wallet owner.

Here, users can see their webId and profile picture, if it is available. A QR code is also provided which can be used to share the user's wallet. Additionally, users can log out from this page.

### Requests

This page displays the access requests for items within the wallet or for the wallet itself. 

From here, the user can view all the requests along with their details (requestor, access mode, resource, and expiry date) and either confirm or deny access. If the user confirms the request, the requestor will be granted the specified access mode to the resource.

### Access

This page shows what access has been granted to other agents.

For each authorized agent, there is a list of the wallet resources to which they have access. Users also have the option to revoke access to each resource from this page.

## Issues & Help

### Bugs and Feature Requests

- For public feedback, bug reports, and feature requests please file an issue
  via [Github](https://github.com/inrupt/inrupt-data-wallet/issues/).
- For non-public feedback or support inquiries please use the
  [Inrupt Service Desk](https://inrupt.atlassian.net/servicedesk).

### Documentation

- [Inrupt Data Wallet](https://docs.inrupt.com/data-wallet/)
- [Homepage](https://docs.inrupt.com/)

### Changelog

See [the release notes](https://github.com/inrupt/inrupt-data-wallet/releases).

### License

Apache 2.0 © [Inrupt](https://inrupt.com)
