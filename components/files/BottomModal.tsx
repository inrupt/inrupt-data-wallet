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
import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { FontAwesome6 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteFile, getFile } from "@/api/files";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import QRCode from "react-native-qrcode-svg";
import { formatResourceName } from "@/utils/fileUtils";
import type { UserInfo } from "@/constants/user";
import type { WalletFile } from "@/types/WalletFile";
import { ThemedText } from "../ThemedText";
import ConfirmModal from "../common/ConfirmModal";

interface BottomModalProps {
  file: WalletFile | null;
  onCloseModal: () => void;
  onDeleteSuccessfully?: () => void;
  onChangeSnapPoint: (index: number) => void;
}

const BottomModal: React.FC<BottomModalProps> = ({
  file,
  onCloseModal,
  onDeleteSuccessfully,
  onChangeSnapPoint,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { data: userInfo } = useQuery<UserInfo>({
    queryKey: ["userInfo"],
    staleTime: Infinity,
  });
  const [isShowQRCode, setShowQRCode] = useState(false);
  const deleteMutation = useMutation({
    mutationFn: deleteFile,
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["files"] }),
    mutationKey: ["filesMutation"],
  });
  const { data } = useQuery<Blob>({
    queryKey: ["file", file?.fileName],
    queryFn: () => getFile(file?.fileName as string),
  });
  const queryClient = useQueryClient();

  const onFileShare = async (fileName: string) => {
    if (!data) return;
    const fr = new FileReader();
    fr.onload = async () => {
      const fileUri = `${FileSystem.documentDirectory}/${fileName}`;
      if (typeof fr.result !== "string") {
        throw new Error("An error happened while reading the file.");
      }
      await FileSystem.writeAsStringAsync(fileUri, fr.result?.split(",")[1], {
        encoding: FileSystem.EncodingType.Base64,
      });
      await Sharing.shareAsync(fileUri);
    };
    fr.readAsDataURL(data);
  };
  const onDeleteFile = async (fileName: string) => {
    deleteMutation
      .mutateAsync(fileName)
      // eslint-disable-next-line no-console
      .catch(() => console.error("Error while deleting data"));
    onCloseModal();
    onDeleteSuccessfully?.();
    queryClient
      .refetchQueries({ queryKey: ["files"] })
      // eslint-disable-next-line no-console
      .catch(() => console.error("Error while refetching data"));
  };

  const onShareViaQR = () => {
    setShowQRCode(true);
    onChangeSnapPoint(360);
  };

  return (
    <>
      <BottomSheetView style={styles.bottomSheetContent}>
        <View style={styles.fileDetailedTitle}>
          {isShowQRCode && (
            <TouchableOpacity
              onPress={() => {
                setShowQRCode(false);
                onChangeSnapPoint(260);
              }}
            >
              <FontAwesome6 size={20} name="chevron-left" />
            </TouchableOpacity>
          )}

          <ThemedText
            style={{ fontSize: 18, paddingLeft: isShowQRCode ? 16 : 0 }}
          >
            {formatResourceName(
              file?.fileName || "",
              file?.isRDFResource || false
            )}
          </ThemedText>
        </View>
        {isShowQRCode ? (
          <View style={styles.qrContainer}>
            <QRCode
              size={203}
              value={JSON.stringify({
                webId: userInfo?.webId,
                resource: file?.identifier,
              })}
            />
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.fileDetailMenuContainer}
              onPress={() => file && onShareViaQR()}
            >
              <FontAwesome6 size={24} name="share" />
              <ThemedText style={{ paddingLeft: 24, fontSize: 16 }}>
                Share via QR Code
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.fileDetailMenuContainer}
              onPress={() => file && onFileShare(file?.fileName)}
            >
              <FontAwesome6 size={24} name="download" />
              <ThemedText style={{ paddingLeft: 24, fontSize: 16 }}>
                Download a copy
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.fileDetailMenuContainer}
              onPress={() => file && setModalVisible(true)}
            >
              <FontAwesome6 size={24} name="trash" />
              <ThemedText style={{ paddingLeft: 24, fontSize: 16 }}>
                Delete
              </ThemedText>
            </TouchableOpacity>
          </>
        )}
      </BottomSheetView>
      <ConfirmModal
        visible={modalVisible}
        title={"Delete from wallet?"}
        content={`${file?.fileName} will be deleted from your wallet and any access to it will be revoked.`}
        onConfirm={() => onDeleteFile(file?.fileName as string)}
        confirmLabel={"Delete"}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    shadowColor: "#000000",
    shadowOffset: { width: 4, height: 9 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 5,
    borderRadius: 26,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 8,
    paddingBottom: 24,
  },

  fileDetailMenuContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 24,
  },
  fileDetailedTitle: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: 18,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.secondary,
  },
  qrContainer: {
    paddingTop: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BottomModal;
