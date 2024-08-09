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
import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Colors } from "@/constants/Colors";
import { addSpacesToCamelCase } from "@/utils/fileUtils";
import CheckMark from "@/assets/images/check-mark.svg";
import FieldInfo from "../common/FieldInfo";
import { ThemedText } from "../ThemedText";

interface IComponentProps {
  // disable because we are getting data dynamically base on a file
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

const VcCard: React.FC<IComponentProps> = ({ data }) => {
  const { credentialSubject, issuer } = data;
  return (
    <View style={styles.cardContent}>
      <View style={styles.cardHeader}>
        <ThemedText style={{ fontSize: 18 }}>{data?.name}</ThemedText>
        <CheckMark width={24} height={24} />
      </View>
      {credentialSubject &&
        Object.entries(credentialSubject).map((subject) => (
          <FieldInfo
            key={subject[0]}
            title={addSpacesToCamelCase(subject[0])}
            content={
              typeof subject[1] === "string" || typeof subject[1] === "number"
                ? subject[1].toString()
                : ""
            }
          />
        ))}
      <View style={styles.issuerContainer}>
        <Image source={{ uri: issuer?.logo }} style={styles.issuerLogo} />

        <ThemedText
          ellipsizeMode={"tail"}
          numberOfLines={1}
          style={styles.issuerDetail}
        >
          {issuer?.name}
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  issuerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 24,
  },
  issuerLogo: { width: 32, height: 32 },
  issuerDetail: {
    lineHeight: 20,
    marginLeft: 12,
  },
});

export default VcCard;
