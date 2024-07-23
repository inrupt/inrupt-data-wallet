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
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import CustomButton from "@/components/Button";

interface ConfirmModalProps {
  visible: boolean;
  onClose?: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
  confirmLabel: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  content,
  visible,
  onConfirm,
  confirmLabel,
  onClose = () => {},
}) => {
  const [modalVisible, setModalVisible] = useState(visible);

  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ThemedText style={styles.header}>{title}</ThemedText>
            <ThemedText style={styles.description} fontWeight="light">
              {content}
            </ThemedText>
            <View style={styles.buttonContainer}>
              <View style={styles.button}>
                <CustomButton
                  variant="primary"
                  title={confirmLabel}
                  customStyle={{ paddingHorizontal: 16 }}
                  onPress={onConfirm}
                />
              </View>
              <View style={styles.button}>
                <CustomButton
                  variant="secondary"
                  title="Cancel"
                  onPress={() => {
                    setModalVisible(false);
                    onClose();
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    opacity: 1,
  },
  modalView: {
    width: "88%",
    backgroundColor: "white",
    borderRadius: 18,
    padding: 24,
    margin: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    fontSize: 18,
  },
  description: {
    paddingTop: 16,
    paddingBottom: 48,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  button: { paddingBottom: 24 },
});

export default ConfirmModal;
