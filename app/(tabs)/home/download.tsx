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
import React, { useEffect, useLayoutEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import CustomButton from "@/components/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postFile } from "@/api/files";
import { FontAwesome6 } from "@expo/vector-icons";
import IconResourceName from "@/components/common/IconResourceName";
import { RDF_CONTENT_TYPE } from "@/utils/constants";
import type { WalletFile } from "@/types/WalletFile";
import { isDownloadQR } from "@/types/accessPrompt";

interface FileDetailProps {
  file: WalletFile;
  onClose: () => void;
  onOpenMenu: (file: WalletFile) => void;
}

const Page: React.FC<FileDetailProps> = () => {
  const params = useLocalSearchParams();
  if (!isDownloadQR(params)) {
    throw new Error("Incorrect params for download request")
  }
  const queryClient = useQueryClient();
  const currentNavigation = useNavigation();
  const parentNavigation = useNavigation("/(tabs)");
  const { replace } = useRouter();

  const mutation = useMutation({
    mutationFn: postFile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["files"] });
    },
    onError: (error) => {
      // TODO: there needs to be better error handling here...
      console.warn(error);
    },
    mutationKey: ["filesMutation"],
  });
  const fileName = params.uri?.substring(
    params.uri.lastIndexOf("/") + 1
  );
  const isRdfFile =
    (params.contentType && RDF_CONTENT_TYPE.includes(params.contentType)) || false;

  const onSaveToWallet = async () => {
    mutation.mutate({
      uri: params.uri,
      name: fileName,
      type: params.contentType,
    });
    // This used to be goBack() but that leaves the download page on the stack so subsequent file uploads are blocked by it.
    // Using replace to return to the homepage my not be ideal, but it works (here and in the cancel handler below).
    replace("/");
  };
  useLayoutEffect(() => {
    currentNavigation.setOptions({
      headerTitleAlign: "center",
      headerTitle: "Save to Wallet",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => currentNavigation.goBack()}
          style={{ width: 60, paddingLeft: 8 }}
        >
          <FontAwesome6 size={20} name="chevron-left" />
        </TouchableOpacity>
      ),
    });
  }, [currentNavigation]);

  useEffect(() => {
    parentNavigation.setOptions({ headerShown: false });
    return () => {
      parentNavigation.setOptions({ headerShown: true });
    };
  }, [parentNavigation]);
  return (
    <View style={styles.modalContainer}>
      <View style={styles.container}>
        <View style={styles.content}>
          <ThemedText style={styles.title}>SAVE</ThemedText>
          <IconResourceName
            resourceName={fileName}
            isRDFResource={isRdfFile}
            containerStyle={{ flex: 0 }}
          />
          <ThemedText style={styles.title} fontWeight="medium">
            DOWNLOAD FROM
          </ThemedText>
          <ThemedText style={styles.detail} fontWeight="regular">
            {params.uri}
          </ThemedText>
        </View>
        <View style={styles.buttonContainer}>
          <CustomButton
            variant="primary"
            title="Save to Wallet"
            onPress={() => onSaveToWallet()}
            customStyle={styles.button}
          />
          <CustomButton
            variant="secondary"
            title="Cancel"
            onPress={() => replace("/")}
            customStyle={styles.button}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  fileName: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  title: {
    paddingTop: 20,
    paddingBottom: 8,
    fontSize: 10,
  },
  button: { width: 210, marginBottom: 24, paddingHorizontal: 36 },
  name: {
    fontSize: 16,
  },
  detail: {
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 30,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
});

export default Page;
