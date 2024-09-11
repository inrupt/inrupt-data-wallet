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
import { View, StyleSheet } from "react-native";
import Close from "@/assets/images/close.svg";
import { ThemedText } from "../ThemedText";

interface ErrorPopupProps {
  errorMsg: string;
  onClose: () => void;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({
  errorMsg,
  onClose = () => null,
}) => {
  return (
    <View style={styles.errorPopup}>
      <ThemedText style={styles.loadingText}>{errorMsg}</ThemedText>
      <Close
        width="20"
        height="20"
        style={styles.closeView}
        onPress={onClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  errorPopup: {
    position: "absolute",
    bottom: 80,
    left: 24,
    right: 24,
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    shadowColor: "rgba(0, 0, 0)",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 5,
    borderRadius: 16,
    paddingVertical: 16,
  },
  loadingText: {
    paddingLeft: 16,
    fontSize: 16,
  },
  closeView: {
    alignItems: "center",
    paddingLeft: 24,
    paddingRight: 16,
  },
});

export default ErrorPopup;
