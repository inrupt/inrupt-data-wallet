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
import { getAccessGrants } from "@/api/accessGrant";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";
import WebIdAccessGrantList from "@/components/accessGrants/WebIdAccessGrantList";
import useRefreshOnFocus from "@/hooks/useRefreshOnFocus";
import type { AccessGrantGroup } from "@/types/accessGrant";

export default function AccessGrantScreen() {
  const {
    data = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery<AccessGrantGroup[]>({
    queryKey: ["accessGrants"],
    queryFn: getAccessGrants,
  });
  useRefreshOnFocus(refetch);

  return (
    <View style={styles.container}>
      <WebIdAccessGrantList
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
