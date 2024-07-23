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
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getFile } from "@/api/files";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons/faEllipsis";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { isImageFile } from "@/utils/fileUtils";
import { FontAwesome6 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import VcCard from "@/components/files/VcCard";
import BottomModal from "@/components/files/BottomModal";

interface FileDetailProps {
  file: WalletFile;
  onClose: () => void;
  onOpenMenu: (file: WalletFile) => void;
}
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const Page: React.FC<FileDetailProps> = () => {
  const { fileName, isRDFResourceStr, identifier } = useLocalSearchParams();
  const isRDFResource: boolean = isRDFResourceStr === "true";
  const [imageUri, setImageUri] = useState<string | null>(null);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { setOptions, goBack } = useNavigation("/(tabs)");
  const currentNavigation = useNavigation();
  // data can be a json file from server so need to use any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = useQuery<Blob | any>({
    queryKey: ["file", fileName],
    queryFn: () => getFile(fileName as string),
  });

  useEffect(() => {
    setOptions({ headerShown: false });
    return () => {
      setOptions({ headerShown: true });
    };
  }, [setOptions]);
  useLayoutEffect(() => {
    currentNavigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => bottomSheetModalRef.current?.present()}
        >
          <FontAwesomeIcon icon={faEllipsis} size={24} />
        </TouchableOpacity>
      ),
      headerTitleAlign: "center",
      headerTitle: data?.name || fileName,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => currentNavigation.goBack()}
          style={{ width: 60, paddingLeft: 8 }}
        >
          <FontAwesome6 size={20} name="xmark" />
        </TouchableOpacity>
      ),
    });
  }, [currentNavigation, data?.name, fileName]);
  useEffect(() => {
    const fetchImageAsBlob = async () => {
      try {
        const base64Data = await blobToBase64(data);
        setImageUri(`data:image/png;base64,${base64Data}`);
      } catch (error) {
        /* empty */
      }
    };

    if (data && isImageFile(fileName as string)) {
      fetchImageAsBlob().catch(() => {
        /* empty */
      });
    }
  }, [data, fileName]);

  return (
    <View style={styles.modalContainer}>
      {isImageFile(fileName as string) && imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.modalImage}
          resizeMode="contain"
        />
      )}
      {isRDFResource && data && <VcCard data={data} />}
      <BottomSheetModal
        enableDismissOnClose
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={[260, 260, "90%"]}
        backgroundStyle={styles.bottomSheetContainer}
        backdropComponent={({ style }) => (
          <View
            style={[style, styles.backdrop]}
            onTouchEnd={() => bottomSheetModalRef.current?.close()}
          />
        )}
        enablePanDownToClose
      >
        <BottomModal
          file={{
            fileName: fileName as string,
            identifier: identifier as string,
            isRDFResource,
          }}
          onCloseModal={() => bottomSheetModalRef.current?.close()}
          onDeleteSuccessfully={() => goBack()}
          onChangeSnapPoint={(snapHeight: number) =>
            bottomSheetModalRef.current?.snapToPosition(snapHeight)
          }
        />
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 32,
    backgroundColor: "#FFF",
    justifyContent: "center",
  },
  fileName: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
  },

  modalContent: {
    flex: 1,
  },

  modalImage: {
    width: "100%",
    height: "100%",
  },
  bottomSheetContainer: {
    shadowColor: "#000000",
    shadowOffset: { width: 4, height: 9 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 5,
    borderRadius: 26,
    position: "absolute",
  },
  backdrop: {},
  cardContent: {
    backgroundColor: Colors.light.secondaryBackground,
    justifyContent: "center",
    flexDirection: "column",
    padding: 24,
    borderRadius: 16,
  },
  cardHeader: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
});

export default Page;
