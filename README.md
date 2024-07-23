# Data Wallet Front-end Application

This project produces a front-end react native application for use with the Inrupt Data Wallet.
This README provides information on:

* [Setup](#setup)
  * [Prerequisites](#prerequisites)
  * [Install dependencies](#install-dependencies)
  * [Configure build environment](#configure-build-environment)
    * [Create keystore](#create-keystore)
* [Running](#running)
  * [Configure test environment](#configure-test-environment)
  * [Test native versions](#test-native-versions)
    * [iOS app](#ios-app)
    * [Android app](#android-app)
* [UI overview](#ui-overview)
  * [Home](#home)
  * [Profile](#profile)
  * [Requests](#requests)
  * [Access](#access)


## Setup

### Prerequisites

Ensure that you have the following dependencies installed and configured:
- Xcode
- iOS simulators
- [Android emulators](https://developer.android.com/studio/install)

### Install dependencies

First, install any react native dependencies.

```bash
npm install
```

### Configure build environment

Copy the `.env.sample` file to `.env` and fill in any relevant values.

If you are testing manually, the minimal configuration is the URLs for the wallet's backend service.
```
EXPO_PUBLIC_LOGIN_URL=
EXPO_PUBLIC_WALLET_API=
```

#### Create keystore

The Android app will need to be signed for it to be installed. See: https://reactnative.dev/docs/signed-apk-android
for more information on this.

__WARNING:__ The following is only to be used for development. In production the keystore should
be generated and configured in a more secure manner.

To generate a keystore with a key and cert run the following from the root of the project:

```bash
keytool -genkeypair -v -storetype PKCS12 \
 -keystore android/app/wallet.keystore \
 -alias wallet -keyalg RSA -keysize 2048 -validity 100 \
 -noprompt -dname "CN=wallet.example.com"
```

Add the following to: `~/.gradle/gradle.properties` and update the placeholders.
```text
WALLET_UPLOAD_STORE_FILE=<path>/inrupt-wallet-frontend/android/app/wallet.keystore
WALLET_UPLOAD_STORE_PASSWORD=<keystore password>
WALLET_UPLOAD_KEY_ALIAS=wallet
WALLET_UPLOAD_KEY_PASSWORD=<keystore password>
```

## Running

If you are going to run the application in an emulator or simulator, you need to build the development version using
one of the following:
   ```bash
    npm run android
    npm run ios
   ```

Start the application:

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

### Configure test environment

The tests require access credentials for a Pod which will be used by this instance of the wallet.
Update your .env file with the following environment variables:
```bash
TEST_ACCOUNT_USERNAME=<Wallet Pod username>
TEST_ACCOUNT_PASSWORD=<Wallet Pod password>
IOS_BINARY_PATH=<Path to the built iOS binary>
TEST_IOS_SIM=<Name of the iOS simulator on your device>
ANDROID_BINARY_PATH=<Path to the main Android binary>
ANDROID_TEST_BINARY_PATH=<Path to the test Android binary>
TEST_ANDROID_EMU=<Name of the Android emulator on your device>
```
Replace placeholders with actual values specific to your setup.

For Android development, ensure that the `TEST_ANDROID_EMU` configuration aligns with
a device emulator in Android Studio, e.g.:

```bash
TEST_ANDROID_EMU=Android_34
```

### Test native versions

#### iOS app

To build the iOS wallet app in an iOS simulator, just run the following command:

```bash
npm run ios
```

This will install the necessary CocoaPods and compile the application. Upon completion, the iOS simulator should be open and the wallet app running.

If you want to generate the iOS binary as well, run the following commands. Note that this process may take around 30 minutes to complete.

```bash
npx expo run:ios
xcodebuild -workspace ios/inruptwalletfrontend.xcworkspace -scheme inruptwalletfrontend -configuration Release -sdk iphonesimulator -derivedDataPath ios/build
```

After completion, the iOS binary should be located at:

```bash
inrupt-wallet-frontend/ios/build/Build/Products/inruptwalletfrontend.app
```

You can share the .app file with others who need to run the Detox tests without building the iOS app locally.

Execute the command below to start Detox test on iOS.
```bash
npx detox test --configuration=ios.sim.release
```

#### Android app

Ensure that a virtual device has been added to the Android emulator.

Run the following command to build the Android app. This process may take up to 30 minutes to complete.

```bash
npx detox build --configuration android.emu.release
```

For local development (a back-end server running on localhost or at an alternative location), use
the `android.emu.debug` configuration.

Once built, run the detox tests for the relevant configuration:

```bash
npx detox test --configuration android.emu.release
```

After completion, the binary apps will be located in:
```bash
./android/app/build/outputs
```

You can share the .apk files with others who need to run the Detox tests without building the Android app locally.

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