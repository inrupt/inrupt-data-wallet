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
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { FontAwesome6 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import IconResourceName from "@/components/common/IconResourceName";
import WebIdDisplay from "@/components/common/WebIdDisplay";
import type { AccessGrant, AccessGrantGroup } from "@/types/accessGrant";

interface BottomModalProps {
  accessGrant?: AccessGrant;
  accessGrantGroup?: AccessGrantGroup;
  onRevoke?: (accessGrant: AccessGrant | AccessGrantGroup) => void;
}

const BottomModal: React.FC<BottomModalProps> = ({
  accessGrant,
  accessGrantGroup,
  onRevoke = () => {},
}) => {
  return (
    <BottomSheetView style={styles.bottomSheetContent}>
      <View style={styles.fileDetailedTitle}>
        {accessGrantGroup && (
          <WebIdDisplay
            webId={accessGrantGroup.webId}
            ownerName={accessGrantGroup.ownerName}
            logo={accessGrantGroup.logo}
            containerStyle={{ padding: 0 }}
          />
        )}
        {accessGrant && (
          <IconResourceName
            resourceName={accessGrant.resourceName}
            isRDFResource={accessGrant.isRDFResource}
            resourceUri={accessGrant.resource}
          ></IconResourceName>
        )}
      </View>
      <TouchableOpacity
        style={styles.fileDetailMenuContainer}
        onPress={() => onRevoke(accessGrant!)}
      >
        <FontAwesome6 size={24} name="trash" />
        <ThemedText style={{ paddingLeft: 24, fontSize: 16 }}>
          {accessGrantGroup ? "Revoke all access" : "Revoke access"}
        </ThemedText>
      </TouchableOpacity>
    </BottomSheetView>
  );
};

const styles = StyleSheet.create({
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 8,
    paddingBottom: 24,
  },
  fileDetailMenuContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 24,
  },
  fileDetailedTitle: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: 18,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.secondary,
  },
});

export default BottomModal;
