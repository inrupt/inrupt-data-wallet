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
import { View, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons/faCircleCheck";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import CustomButton from "@/components/Button";
import WebIdDisplay from "@/components/common/WebIdDisplay";
import FieldInfo from "@/components/common/FieldInfo";
import CardInfo from "@/components/common/CardInfo";

const Page: React.FC = () => {
  const {
    webId = "",
    resourceName = "",
    ownerName = "",
    logo = "",
  } = useLocalSearchParams();
  const currentNavigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    currentNavigation.setOptions({
      headerTitleAlign: "center",
      headerTitle: "Confirmed",
      headerLeft: () => <></>,
    });
  }, [currentNavigation]);

  return (
    <View style={styles.modalContainer}>
      <View style={styles.container}>
        <View style={styles.content}>
          <FontAwesomeIcon icon={faCircleCheck} size={40} />
          <ThemedText style={styles.succeedText}>
            Confirmed Resource to Share
          </ThemedText>
          <View style={styles.card}>
            <ThemedText style={styles.title} fontWeight="medium">
              REQUESTOR
            </ThemedText>

            <WebIdDisplay
              ownerName={ownerName as string}
              webId={webId as string}
              logo={logo as string}
              containerStyle={{
                padding: 0,
                marginBottom: 24,
              }}
            />
            <ThemedText style={styles.title} fontWeight="medium">
              Access Mode
            </ThemedText>
            <CardInfo
              content={"View"}
              icon={<FontAwesomeIcon icon={faEye} size={24} />}
              containerStyle={{ paddingVertical: 0, paddingHorizontal: 0 }}
            />
            <FieldInfo title="Resource" content={resourceName as string} />
          </View>
          <ThemedText style={styles.succeedText}>
            Please check the Requests tab for the Access Request
          </ThemedText>
        </View>
        <View style={styles.buttonContainer}>
          <CustomButton
            variant="primary"
            title="Done"
            onPress={() => router.replace("/")}
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
  fileDetail: {
    alignItems: "center",
    flexDirection: "row",
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
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flexDirection: "column",
    padding: 16,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#E7F1F7",
    width: "100%",
  },
  title: {
    paddingBottom: 4,
    fontSize: 10,
    textTransform: "uppercase",
  },
  textContainer: {
    flex: 1,
    paddingLeft: 12,
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
    flex: 0.3,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  succeedText: {
    fontSize: 18,
    lineHeight: 25,
    textAlign: "center",
    paddingBottom: 24,
    paddingTop: 12,
  },
});

export default Page;
