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
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { format } from "date-fns";
import { ThemedText } from "../ThemedText";
import WebIdDisplay from "../common/WebIdDisplay";

interface CardProps {
  name: string;
  detail: string;
  logoUri?: string;
  id: string;
  issuedDate: Date;
}

const AccessRequestCard: React.FC<CardProps> = ({
  name,
  detail,
  id,
  logoUri,
  issuedDate,
}) => {
  const { navigate } = useRouter();
  return (
    <TouchableOpacity
      onPress={() => navigate(`requests/${id}`)}
      style={styles.card}
    >
      <ThemedText fontWeight="medium" style={styles.time}>
        {format(issuedDate, "MMMM d  HH:mm")}
      </ThemedText>
      <WebIdDisplay
        webId={detail}
        ownerName={name}
        logo={logoUri}
        containerStyle={{ padding: 0 }}
        rightComponent={
          <View style={styles.rightContainer}>
            <FontAwesome6 size={16} name="chevron-right" style={styles.icon} />
          </View>
        }
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#E7F1F7",
    paddingHorizontal: 16,
    paddingTop: 9,
    paddingBottom: 13,
    borderRadius: 10,
    marginBottom: 16,
  },
  rightContainer: {
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  time: {
    fontSize: 10,
    color: Colors.light.grey,
    textAlign: "right",
    textTransform: "uppercase",
  },
  icon: {},
});

export default AccessRequestCard;
