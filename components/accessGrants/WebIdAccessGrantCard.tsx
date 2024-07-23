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
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import AccessSolid from "@/assets/images/access-solid.svg";
import { ThemedText } from "../ThemedText";

interface CardProps {
  name: string;
  detail: string;
  logoUri?: string;
  id: string;
}

const WebIdAccessGrantCard: React.FC<CardProps> = ({
  name,
  detail,
  id,
  logoUri,
}) => {
  const { navigate } = useRouter();
  const encoded = encodeURIComponent(id);
  return (
    <TouchableOpacity onPress={() => navigate(`accesses/${encoded}`)}>
      <View style={styles.card}>
        {logoUri ? (
          <Image
            source={{ uri: logoUri }}
            style={styles.logo}
            borderRadius={40}
          />
        ) : (
          <AccessSolid style={styles.logo} width={40} height={40} />
        )}
        <View style={styles.textContainer}>
          {name && <ThemedText style={styles.name}>{name}</ThemedText>}
          <ThemedText style={styles.detail}>{detail}</ThemedText>
        </View>
        <FontAwesome6 size={18} name="chevron-right" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginVertical: 12,
    borderRadius: 10,
    backgroundColor: "#E7F1F7",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
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

export default WebIdAccessGrantCard;
