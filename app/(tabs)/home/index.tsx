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
import CustomButton from "@/components/Button";
import PopupMenu from "@/components/PopupMenu";
import { ThemedText } from "@/components/ThemedText";
import React, { useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchFiles } from "@/api/files";
import FileList from "@/components/files/FileList";
import useRefreshOnFocus from "@/hooks/useRefreshOnFocus";
import { Colors } from "@/constants/Colors";

const HomeScreen = () => {
  const { data, isLoading, isFetching, refetch } = useQuery<WalletFile[]>({
    queryKey: ["files"],
    queryFn: fetchFiles,
  });
  useRefreshOnFocus(refetch);

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [positionType, setPositionType] = useState<
    "topMiddle" | "bottomLeft" | "bottomMiddle"
  >("bottomMiddle");
  const addButtonRef = useRef(null);

  const toggleMenu = (type: "topMiddle" | "bottomLeft" | "bottomMiddle") => {
    if (addButtonRef && addButtonRef.current) {
      (
        addButtonRef.current as unknown as {
          measure: (
            callback: (
              _fx: number,
              _fy: number,
              _width: number,
              _height: number,
              px: number,
              py: number
            ) => void
          ) => void;
        }
      ).measure(
        (
          _fx: number,
          _fy: number,
          _width: number,
          _height: number,
          px: number,
          py: number
        ) => {
          setMenuPosition({ x: px, y: py });
          setPositionType(type);
          setMenuVisible(true);
        }
      );
    }
  };

  return (
    <View style={styles.container}>
      {(data && data.length > 0) || isLoading ? (
        <FileList
          files={data}
          isLoading={isLoading || isFetching}
          onRefresh={() => refetch()}
          refreshing={false}
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <ThemedText style={styles.text}>
            Add your own data, such as photos, files, or notes.
          </ThemedText>
          <TouchableOpacity ref={addButtonRef}>
            <CustomButton
              variant="tertiary"
              title="Add Data"
              onPress={() => toggleMenu("topMiddle")}
            ></CustomButton>
          </TouchableOpacity>
        </View>
      )}

      <PopupMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        position={menuPosition}
        positionType={positionType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    padding: 10,
  },
  emptyStateContainer: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingHorizontal: 70,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 28,
    color: Colors.light.grey,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  list: {
    flexGrow: 1,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
  },
});

export default HomeScreen;
