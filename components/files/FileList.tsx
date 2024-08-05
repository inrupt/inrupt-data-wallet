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
import React, { useCallback, useRef, useState } from "react";
import type { FlatListProps } from "react-native";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  formatResourceName,
  getIconFile,
  isDisplayDetailedPage,
} from "@/utils/fileUtils";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { faEllipsis } from "@fortawesome/free-solid-svg-icons/faEllipsis";
import { useRouter } from "expo-router";
import { useIsMutating } from "@tanstack/react-query";
import Loading from "@/components/LoadingButton";
import type { WalletFile } from "@/types/WalletFile";
import BottomModal from "./BottomModal";
import { ThemedText } from "../ThemedText";

interface FileListProps
  extends Omit<FlatListProps<WalletFile>, "data" | "renderItem"> {
  files: WalletFile[] | undefined;
  isLoading?: boolean;
}

const FileList: React.FC<FileListProps> = ({
  files,
  isLoading = false,
  ...props
}) => {
  const { navigate } = useRouter();
  const isMutatingFiles = useIsMutating({ mutationKey: ["filesMutation"] });

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedFile, setSelectedFile] = useState<WalletFile | null>(null);

  const onPressDetailedFile = useCallback((file: WalletFile) => {
    setSelectedFile(file);
    bottomSheetModalRef.current?.present();
  }, []);

  const handleClose = () => {
    bottomSheetModalRef.current?.close();
  };

  const onPressDetail = (file: WalletFile) => {
    if (isDisplayDetailedPage(file)) {
      navigate({
        pathname: `/home/${file.fileName}`,
        params: {
          isRDFResourceStr: String(file.isRDFResource),
          identifier: file.identifier,
        },
      });
    } else {
      setSelectedFile(file);
      bottomSheetModalRef.current?.present();
    }
  };

  const renderItem = ({ item }: { item: WalletFile }) => (
    <TouchableOpacity onPress={() => onPressDetail(item)}>
      <View style={styles.fileContainer}>
        <FontAwesomeIcon
          icon={getIconFile(item.fileName, item.isRDFResource)}
          size={24}
        />

        <ThemedText
          style={styles.itemText}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {formatResourceName(item.fileName, item.isRDFResource)}
        </ThemedText>

        <View style={styles.menuIconContainer}>
          <TouchableOpacity onPress={() => onPressDetailedFile(item)}>
            <FontAwesomeIcon icon={faEllipsis} size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <>
      <FlatList
        {...props}
        data={files}
        renderItem={renderItem}
        keyExtractor={(item) => item.identifier}
        contentContainerStyle={styles.container}
      />
      <Loading isLoading={isLoading || !!isMutatingFiles} />

      <BottomSheetModal
        enableDismissOnClose
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={[260, 260, "90%"]}
        backgroundStyle={styles.bottomSheetContainer}
        backdropComponent={({ style }) => (
          <View style={style} onTouchEnd={handleClose} />
        )}
        enablePanDownToClose
      >
        <BottomModal
          file={selectedFile}
          onCloseModal={() => bottomSheetModalRef.current?.close()}
          onChangeSnapPoint={(snapHeight: number) =>
            bottomSheetModalRef.current?.snapToPosition(snapHeight)
          }
        />
      </BottomSheetModal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  fileContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomColor: "#E3E8EB",
    borderBottomWidth: 1,
  },
  fileName: {
    marginLeft: 8,
    fontSize: 16,
  },
  itemText: {
    paddingLeft: 18,
    flex: 1,
    fontSize: 16,
    paddingRight: 2,
  },
  menuIconContainer: {
    width: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  flatListLoading: {
    opacity: 0.5, // Reduced opacity when loading
  },
  loadingContainer: {
    position: "static",
    bottom: 36,
    left: 0,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    shadowColor: "rgba(0, 0, 0)",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 5,
    borderRadius: 16,
    paddingVertical: 14,
  },

  bottomSheetContainer: {
    shadowColor: "#000000",
    shadowOffset: { width: 4, height: 9 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 5,
    borderRadius: 26,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default FileList;
