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
import type { StyleProp, ViewStyle } from "react-native";
import { Image, StyleSheet, View } from "react-native";
import AccessSolid from "@/assets/images/access-solid.svg";
import { ThemedText } from "../ThemedText";

interface IComponentProps {
  logo?: string;
  webId: string;
  ownerName: string;
  containerStyle?: StyleProp<ViewStyle>;
  rightComponent?: React.ReactNode;
}

const WebIdDisplay: React.FC<IComponentProps> = ({
  logo,
  webId,
  ownerName,
  containerStyle,
  rightComponent,
}) => {
  return (
    <View style={[styles.webIdCard, containerStyle]}>
      {logo ? (
        <Image source={{ uri: logo }} style={styles.logo} />
      ) : (
        <AccessSolid style={styles.logo} />
      )}
      <View style={styles.textContainer}>
        <ThemedText style={styles.name}>{ownerName}</ThemedText>
        <ThemedText style={styles.detail}>{webId}</ThemedText>
      </View>
      {rightComponent}
    </View>
  );
};

const styles = StyleSheet.create({
  webIdCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 10,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 40,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    lineHeight: 22,
  },
  detail: {
    fontSize: 14,
    lineHeight: 18,
  },
});

export default WebIdDisplay;
