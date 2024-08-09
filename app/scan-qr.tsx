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
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import type { BarcodeScanningResult } from "expo-camera";
import { Camera, CameraView } from "expo-camera";
import { isAccessPromptQR, isDownloadQR } from "@/types/accessPrompt";

const { width } = Dimensions.get("window");

export default function Logout() {
  const { goBack } = useNavigation();
  const { replace, navigate } = useRouter();
  const [scanned, setScanned] = useState(false);
  useEffect(() => {
    const getCameraPermissions = async () => {
      await Camera.requestCameraPermissionsAsync();
    };
    getCameraPermissions().catch(() =>
      // eslint-disable-next-line no-console
      console.log("Don't have camera permission")
    );
  }, []);

  const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
    setScanned(true);
    try {
      const resourceInfo = JSON.parse(data);
      if (isAccessPromptQR(resourceInfo)) {
        replace({
          pathname: "/access-prompt",
          params: {
            webId: resourceInfo.webId,
            client: resourceInfo.client,
            type: resourceInfo.type,
          },
        });
      } else if (isDownloadQR(resourceInfo)) {
        navigate({
          pathname: "/home/download",
          params: {
            uri: resourceInfo.uri,
            contentType: resourceInfo.contentType,
          },
        });
      } else {
        throw new Error("QR code not a recognized type");
      }
    } catch (err) {
      if ((err as Error).name === "SyntaxError") {
        console.warn("QR code not a valid format");
      } else {
        console.warn(err);
      }
      goBack();
    }
  };
  return (
    <View style={styles.modalContainer}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <ThemedText style={styles.headerText}>Scan</ThemedText>
        </View>
        <TouchableOpacity
          onPress={() => {
            goBack();
          }}
          style={styles.cancelContainer}
        >
          <ThemedText style={styles.cancelText}>Cancel</ThemedText>
        </TouchableOpacity>
      </View>
      <View style={styles.cameraContainer}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          style={styles.camera}
        />
      </View>

      <View style={styles.footer}>
        <ThemedText style={styles.footerText}>Scan a QR code</ThemedText>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
    flexDirection: "column",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  titleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 24,
    alignItems: "center",
  },

  headerText: {
    fontSize: 18,
    color: "#FFF",
  },
  cancelContainer: {
    position: "absolute",
    right: 24,
    top: 26,
    alignItems: "flex-end",
  },
  cancelText: {
    fontSize: 16,
    color: "#FFF",
    alignItems: "center",
  },
  cameraContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: width,
    width: "100%",
    marginTop: 40,
  },
  camera: {
    width,
    height: width,
  },
  footer: {
    flex: 1,
    padding: 16,

    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    color: "#FFF",
  },
});
