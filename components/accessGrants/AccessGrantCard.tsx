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
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { formatDate } from "@/utils/dateFormatUtils";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons/faEllipsis";
import IconResourceName from "@/components/common/IconResourceName";
import { isWriteMode } from "@/utils/fileUtils";
import type { AccessRequestMode } from "@/types/enums";
import FieldInfo from "../common/FieldInfo";

interface CardProps {
  resourceName: string;
  resource: string;
  forPurpose: string;
  grantedDate: Date;
  expirationDate: Date;
  id: string;
  isRDFResource: boolean;
  modes: AccessRequestMode[];
  onSelect: (item: string) => void;
}

const AccessGrantCard: React.FC<CardProps> = ({
  id,
  resourceName,
  forPurpose,
  grantedDate,
  expirationDate,
  isRDFResource,
  resource,
  modes,
  onSelect,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <IconResourceName
          resourceName={resourceName}
          isRDFResource={isRDFResource}
          resourceUri={resource}
        ></IconResourceName>
        <TouchableOpacity onPress={() => onSelect(id)}>
          <FontAwesomeIcon icon={faEllipsis} size={24} />
        </TouchableOpacity>
      </View>
      <FieldInfo
        title="Access Mode"
        content={isWriteMode(modes) ? "Save to" : "View"}
      />
      <FieldInfo title="PURPOSE" content={forPurpose} />
      <FieldInfo title="ACCESS GRANTED" content={formatDate(grantedDate)} />
      <FieldInfo title="EXPIRY" content={formatDate(expirationDate)} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    padding: 16,
    marginVertical: 12,
    borderRadius: 10,
    backgroundColor: "#E7F1F7",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  fileNameCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
});

export default AccessGrantCard;
