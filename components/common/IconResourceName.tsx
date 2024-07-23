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
import type { ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import type { StyleProp } from "react-native/Libraries/StyleSheet/StyleSheet";
import { formatResourceName, getIconFile } from "@/utils/fileUtils";
import { ThemedText } from "../ThemedText";

interface IComponentProps {
  resourceName: string;
  isRDFResource?: boolean;
  haveBackground?: boolean;
  resourceUri?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const IconResourceName: React.FC<IComponentProps> = ({
  resourceName,
  isRDFResource = false,
  haveBackground = false,
  resourceUri = "",
  containerStyle = {},
}) => {
  return (
    <View
      style={[
        styles.fileNameCardHeader,
        haveBackground ? styles.background : { flex: 1 },
        containerStyle,
      ]}
    >
      <FontAwesomeIcon
        icon={getIconFile(resourceUri, isRDFResource)}
        style={styles.icon}
        size={24}
      />

      <ThemedText ellipsizeMode={"tail"} numberOfLines={1}>
        {formatResourceName(resourceName, isRDFResource, resourceUri)}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  fileNameCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    // paddingVertical: 16,
    // paddingHorizontal: 24,
    // backgroundColor: "#E7F1F7",
    borderRadius: 16,
  },
  background: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    backgroundColor: "#E7F1F7",
    borderRadius: 16,
  },

  icon: {
    marginRight: 12,
  },
  detail: {
    flex: 1,
    lineHeight: 22,
  },
});

export default IconResourceName;
