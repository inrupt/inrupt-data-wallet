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
import React, { useRef } from "react";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { PermissionStatus } from "expo-image-picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postFile } from "@/api/files";
import { useRouter } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons/faImage";
import { faFile } from "@fortawesome/free-solid-svg-icons/faFile";
import { faCamera } from "@fortawesome/free-solid-svg-icons/faCamera";
import { faQrcode } from "@fortawesome/free-solid-svg-icons/faQrcode";
import { ThemedText } from "./ThemedText";

const { width } = Dimensions.get("window");
type PopupMenuProps = {
  visible: boolean;
  onClose: () => void;
  position: { x: number | undefined; y: number | undefined };
  positionType: "topMiddle" | "bottomLeft" | "bottomMiddle";
};

const menuItems = [
  { icon: faFile, text: "File" },
  { icon: faImage, text: "Photo" },
  { icon: faCamera, text: "Camera" },
  { icon: faQrcode, text: "Scan" },
];

const PopupMenu: React.FC<PopupMenuProps> = ({
  visible,
  onClose,
  position,
  positionType,
}) => {
  const router = useRouter();
  const menuRef = useRef(null);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: postFile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["files"] });
    },
    mutationKey: ["filesMutation"],
  });
  if (!visible) return null;
  const { x, y } = position;
  if (!x || !y) return null;
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  let menuStyle = {};
  switch (positionType) {
    case "topMiddle":
      menuStyle = { bottom: screenHeight - y + 10, left: screenWidth / 2 - 79 };
      break;
    case "bottomLeft":
      menuStyle = { top: y + 40, left: x - 140 };
      break;
    case "bottomMiddle":
      menuStyle = { top: y - 30, left: screenWidth / 2 - 79 };
      break;
    default:
      break;
  }

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== PermissionStatus.GRANTED) {
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (result.canceled || result.assets.length === 0) return;
    const selectedPhoto = result.assets[0];
    mutation.mutate({
      uri: selectedPhoto.uri,
      name:
        selectedPhoto.fileName ||
        selectedPhoto.uri.substring(selectedPhoto.uri.lastIndexOf("/") + 1),
    });
    onClose();
  };

  const handleMenuItemPress = async (item: string) => {
    if (item === "File") {
      const result = await DocumentPicker.getDocumentAsync();
      if (!result.canceled && result.assets) {
        const selectedFile = result.assets[0];
        mutation.mutate(selectedFile);
      }
      onClose();
    } else if (item === "Photo") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== PermissionStatus.GRANTED) {
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled && result.assets) {
        const selectedFile = result.assets[0];
        mutation.mutate({
          uri: selectedFile.uri,
          name: selectedFile.fileName || "",
        });
      }
      onClose();
    } else if (item === "Camera") {
      await takePicture();
    } else if (item === "Scan") {
      router.navigate("/scan-qr");
      onClose();
    }
  };

  return (
    <TouchableOpacity
      style={styles.overlay}
      onPress={onClose}
      activeOpacity={1}
    >
      <TouchableOpacity
        ref={menuRef}
        style={[styles.menu, menuStyle]}
        activeOpacity={1}
      >
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => handleMenuItemPress(item.text)}
          >
            <FontAwesomeIcon icon={item.icon} size={24} />
            <ThemedText style={styles.menuText}>{item.text}</ThemedText>
          </TouchableOpacity>
        ))}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0)",
    justifyContent: "center",
    alignItems: "center",
  },
  menu: {
    width: 158,
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 4, height: 9 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  icon: {
    width: 26,
  },
  menuText: {
    marginLeft: 16,
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
    flexDirection: "column",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  cancelText: {
    fontSize: 16,
    color: "#FFF",
    textDecorationLine: "underline",
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

export default PopupMenu;
