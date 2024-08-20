//
// Copyright Inrupt Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
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
