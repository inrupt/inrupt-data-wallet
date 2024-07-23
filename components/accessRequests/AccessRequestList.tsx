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
import { StyleSheet, FlatList, View } from "react-native";
import { useIsMutating } from "@tanstack/react-query";
import type { AccessRequest } from "@/types/accessRequest";
import { Colors } from "@/constants/Colors";
import AccessRequestCard from "./AccessRequestCard";
import { ThemedText } from "../ThemedText";
import Loading from "../LoadingButton";

interface AccessRequestListProps
  extends Omit<FlatListProps<AccessRequest>, "renderItem"> {
  data: AccessRequest[];
  isLoading: boolean;
}

const AccessRequestList: React.FC<AccessRequestListProps> = ({
  data,
  isLoading = false,
  ...props
}) => {
  const isMutatingAccessRequest = useIsMutating({
    mutationKey: ["accessRequestsMutation"],
  });

  return (
    <>
      {data && data.length === 0 ? (
        <View style={styles.container}>
          <ThemedText style={styles.emptyText}>No active requests</ThemedText>
        </View>
      ) : (
        <FlatList
          {...props}
          data={data}
          renderItem={({
            item: { ownerName, webId, logo, uuid, issuedDate },
          }) => (
            <AccessRequestCard
              name={ownerName}
              detail={webId}
              logoUri={logo}
              key={uuid}
              id={uuid}
              issuedDate={issuedDate}
            />
          )}
          keyExtractor={(item) => item.uuid}
        />
      )}
      <Loading isLoading={isLoading || !!isMutatingAccessRequest} />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: { fontSize: 18, color: Colors.light.grey, marginTop: -4 },
});
export default AccessRequestList;
