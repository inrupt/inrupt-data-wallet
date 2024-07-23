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
import type { FlatListProps } from "react-native";
import { FlatList, StyleSheet, View } from "react-native";
import WebIdAccessGrantCard from "@/components/accessGrants/WebIdAccessGrantCard";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import Loading from "../LoadingButton";

interface WebIdAccessGrantListProps
  extends Omit<FlatListProps<AccessGrantGroup>, "data" | "renderItem"> {
  data: AccessGrantGroup[];
  isLoading: boolean;
}

const WebIdAccessGrantList: React.FC<WebIdAccessGrantListProps> = ({
  data,
  isLoading = false,
  ...props
}) => {
  return (
    <>
      {data.length > 0 ? (
        <FlatList
          {...props}
          data={data}
          renderItem={({ item: { ownerName, webId, logo } }) => (
            <WebIdAccessGrantCard
              name={ownerName}
              detail={webId}
              logoUri={logo}
              key={webId}
              id={webId}
            />
          )}
          keyExtractor={(item) => item.webId}
        />
      ) : (
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyStateText}>
            No access has been granted
          </ThemedText>
        </View>
      )}
      <Loading isLoading={isLoading} />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 18,
    color: Colors.light.grey,
  },
});
export default WebIdAccessGrantList;
