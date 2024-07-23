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
import { useSession } from "@/hooks/session";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useRef } from "react";
import { ThemedText } from "@/components/ThemedText";
import QRCode from "react-native-qrcode-svg";
import Logo from "@/assets/images/future_co.svg";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons/faEllipsis";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons/faRightFromBracket";

import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import type { UserInfo } from "@/constants/user";
import AccessSolid from "@/assets/images/access-solid.svg";
import { formatResourceName } from "@/utils/fileUtils";

export default function Profile() {
  const { signOut } = useSession();
  const { data: userInfo } = useQuery<UserInfo>({
    queryKey: ["userInfo"],
    enabled: false,
  });

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const navigation = useNavigation();

  const { forceLogout } = useLocalSearchParams();
  useEffect(() => {
    if (forceLogout) {
      signOut();
    }
  }, [forceLogout, signOut]);
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={styles.logo}>
          <Logo width={32} height={32} />
          <ThemedText fontWeight="bold" style={styles.headerTitle}>
            Future CO
          </ThemedText>
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => bottomSheetModalRef.current?.present()}
        >
          <FontAwesomeIcon icon={faEllipsis} size={32} />
        </TouchableOpacity>
      ),
      headerRightContainerStyle: { paddingRight: 16 },
    });
  }, [navigation]);

  const { logo, name, webId } = userInfo || {};

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.profileContainer}>
          {logo ? (
            <Image
              source={{
                uri: logo,
              }}
              style={styles.profileUri}
              borderRadius={50}
            />
          ) : (
            <AccessSolid style={styles.profileUri} borderRadius={50} />
          )}
          <View style={styles.profileDetail}>
            <ThemedText style={styles.profileName}>
              {name || webId ? formatResourceName(webId, false, webId) : null}
            </ThemedText>
            <ThemedText fontWeight="light" style={styles.profileWebId}>
              {webId}
            </ThemedText>
          </View>
        </View>
        <View style={styles.QR}>
          <QRCode size={226} value={webId} backgroundColor="#E7F1F7" />
        </View>
      </View>
      <BottomSheetModal
        enableDismissOnClose
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={[111, 111]}
        backgroundStyle={styles.bottomSheetContainer}
        backdropComponent={({ style }) => (
          <View
            style={style}
            onTouchEnd={() => bottomSheetModalRef.current?.close()}
          />
        )}
        enablePanDownToClose
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <TouchableOpacity
            style={styles.logoutContainer}
            onPress={() => signOut()}
          >
            <FontAwesomeIcon icon={faRightFromBracket} size={22} />
            <ThemedText style={{ paddingLeft: 16 }}>Logout</ThemedText>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    paddingLeft: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    textTransform: "uppercase",
    color: "#1C2033",
    fontWeight: 700,
    paddingLeft: 12,
    fontSize: 18,
  },
  cardContainer: {
    backgroundColor: "#E7F1F7",
    flexDirection: "column",
    paddingHorizontal: 16,
    paddingVertical: 24,
    width: "100%",
    borderRadius: 37.5,
  },
  profileContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 28,
  },
  profileName: {
    fontSize: 24,
    lineHeight: 30,
    marginBottom: 4,
  },
  profileUri: {
    width: 75,
    height: 75,
  },
  profileDetail: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 12,
  },
  profileWebId: { lineHeight: 22, fontSize: 18 },
  QR: {
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomSheetContainer: {
    shadowColor: "#000000",
    shadowOffset: { width: 4, height: 9 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 5,
    borderRadius: 26,
    position: "absolute",
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 8,
    paddingBottom: 30,
    justifyContent: "center",
  },
  logoutContainer: {
    flexDirection: "row",
  },
});
