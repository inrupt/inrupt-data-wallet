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
import { getAccessRequests } from "@/api/accessRequest";
import RequestList from "@/components/accessRequests/AccessRequestList";
import useRefreshOnFocus from "@/hooks/useRefreshOnFocus";
import type { AccessRequest } from "@/types/accessRequest";
import { FontAwesome6 } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

export default function AccessRequestScreen() {
  const {
    data = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery<AccessRequest[]>({
    queryKey: ["accessRequests"],
    queryFn: getAccessRequests,
  });
  useRefreshOnFocus(refetch);

  const navigation = useNavigation("/(tabs)");

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => refetch()}>
          <FontAwesome6 size={24} name="rotate-right" />
        </TouchableOpacity>
      ),
      headerRightContainerStyle: { paddingRight: 16 },
    });
  }, [navigation, refetch]);
  return (
    <View style={styles.container}>
      <RequestList
        data={data}
        isLoading={isLoading || isFetching}
        onRefresh={() => refetch()}
        refreshing={false}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
});
