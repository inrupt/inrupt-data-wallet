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
import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import CustomButton from "@/components/Button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FontAwesome6 } from "@expo/vector-icons";
import WebIdDisplay from "@/components/common/WebIdDisplay";
import { Colors } from "@/constants/Colors";
import {
  getAccessPromptResource,
  requestAccessPrompt,
} from "@/api/accessPrompt";
import type { AccessPromptResource } from "@/types/accessPrompt";
import { isAccessPromptQR } from "@/types/accessPrompt";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import CardInfo from "@/components/common/CardInfo";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const Page: React.FC = () => {
  const params = useLocalSearchParams();
  if (!isAccessPromptQR(params)) {
    throw new Error("Incorrect params for access prompt request");
  }
  const router = useRouter();
  const { data } = useQuery<AccessPromptResource>({
    queryKey: ["accessPromptResource"],
    queryFn: () =>
      getAccessPromptResource({
        type: params.type,
        webId: params.webId,
      }),
  });
  const navigation = useNavigation();
  const mutation = useMutation({
    mutationFn: requestAccessPrompt,
    mutationKey: ["createAccessPromptRequest"],
  });

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitleAlign: "center",
      headerTitle: "Confirm Resource to Share",
      headerShadowVisible: false,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ width: 60, paddingLeft: 8 }}
        >
          <FontAwesome6 size={20} name="chevron-left" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const onConfirmResourceToShare = (): void => {
    if (!data) return;
    mutation.mutate({
      resource: data.resource,
      client: params.client,
    });
    router.replace({
      pathname: "/access-prompt/confirmed",
      params: {
        webId: params.webId,
        resourceName: data.resourceName,
        ownerName: data.ownerName,
        logo: data.logo,
      },
    });
  };
  if (!data) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.title} fontWeight="medium">
          REQUESTOR
        </ThemedText>

        <WebIdDisplay
          ownerName={data?.ownerName || ""}
          webId={params.webId}
          containerStyle={{
            backgroundColor: Colors.light.secondaryBackground,
          }}
          logo={data?.logo || ""}
        />
        <ThemedText style={styles.title} fontWeight="medium">
          Access Mode
        </ThemedText>
        <CardInfo
          content={"View"}
          icon={<FontAwesomeIcon icon={faEye} size={24} />}
        />
        <ThemedText style={styles.title} fontWeight="medium">
          Resource to share
        </ThemedText>
        <View style={styles.resourceNameContainer}>
          <ThemedText style={styles.name} fontWeight="medium">
            {data?.resourceName}
          </ThemedText>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          variant="primary"
          title="Confirm"
          onPress={() => onConfirmResourceToShare()}
          customStyle={styles.button}
        />
        <CustomButton
          variant="secondary"
          title="Cancel"
          onPress={() => router.back()}
          customStyle={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    textTransform: "uppercase",
  },
  button: { width: 210, marginBottom: 24, paddingHorizontal: 36 },
  name: {
    fontSize: 16,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  resourceNameContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderColor: "#DFE9F0",
    borderWidth: 1.45,
  },
});

export default Page;
