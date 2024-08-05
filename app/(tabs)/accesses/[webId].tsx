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
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import AccessGrantList from "@/components/accessGrants/AccessGrantList";
import { FontAwesome6 } from "@expo/vector-icons";
import BottomModal from "@/components/accessGrants/modal/BottomModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { revokeAccessGrant, revokeAccessGrantList } from "@/api/accessGrant";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons/faEllipsis";
import WebIdDisplay from "@/components/common/WebIdDisplay";
import ConfirmModal from "@/components/common/ConfirmModal";
import Loading from "@/components/LoadingButton";
import type { AccessGrant, AccessGrantGroup } from "@/types/accessGrant";

interface AccessGrantProps {}

const Page: React.FC<AccessGrantProps> = () => {
  const navigation = useNavigation();
  const parentNavigation = useNavigation("/(tabs)");
  const { webId } = useLocalSearchParams();
  const { data = [], refetch } = useQuery<AccessGrantGroup[]>({
    queryKey: ["accessGrants"],
    enabled: false,
  });
  const selectedRequest = data && data.find((r) => r.webId === webId);

  const [selectedAG, setSelectedAG] = useState<AccessGrant | undefined>();
  const [selectedWebId, setSelectedWebId] = useState<string | undefined>();
  const [isUpdating, setUpdating] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [200, 200], []);

  const mutationRevokeAccessGrant = useMutation({
    mutationFn: revokeAccessGrant,
    onSuccess: async () => {
      setModalVisible(false);
      setUpdating(false);
      if (selectedRequest && selectedRequest.items.length <= 1) {
        navigation.goBack();
      } else {
        // eslint-disable-next-line no-console
        refetch().catch(() => console.error("Error while refetching data"));
      }
    },
  });

  const mutationRevokeAccessGrantList = useMutation({
    mutationFn: revokeAccessGrantList,
    onSuccess: async () => {
      setModalVisible(false);
      setUpdating(false);
      navigation.goBack();
    },
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: selectedRequest?.ownerName,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ width: 60, paddingLeft: 8 }}
        >
          <FontAwesome6 size={18} name="chevron-left" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setSelectedAG(undefined);
            setSelectedWebId(selectedRequest?.webId);
            bottomSheetModalRef.current?.present();
          }}
        >
          <FontAwesomeIcon icon={faEllipsis} size={24} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, selectedRequest]);

  useEffect(() => {
    parentNavigation.setOptions({
      headerShown: false,
    });
    return () => {
      parentNavigation.setOptions({ headerShown: true });
    };
  }, [parentNavigation]);

  const closeMenu = () => bottomSheetModalRef.current?.close();

  const handleRevoke = () => {
    setModalVisible(true);
    closeMenu();
  };

  const handleConfirmToRevoke = (item: AccessGrant) => {
    setUpdating(true);
    setSelectedAG(undefined);
    mutationRevokeAccessGrant.mutate({ requestId: item.uuid as string });
  };

  const handleConfirmToRevokeAGList = (group: AccessGrantGroup) => {
    setUpdating(true);
    setSelectedWebId(undefined);
    mutationRevokeAccessGrantList.mutate({
      requestId: group.items.map((item: AccessGrant) => item.uuid),
    });
  };

  const handleSelectedItem = (item: AccessGrant) => {
    setSelectedAG(item);
    setSelectedWebId(undefined);
    bottomSheetModalRef.current?.present();
  };

  return selectedRequest ? (
    <>
      <View style={styles.container}>
        <WebIdDisplay
          webId={selectedRequest.webId}
          ownerName={selectedRequest.ownerName}
          logo={selectedRequest.logo}
        />
        <AccessGrantList data={selectedRequest} onSelect={handleSelectedItem} />
      </View>
      <BottomSheetModal
        snapPoints={snapPoints}
        enableDismissOnClose
        ref={bottomSheetModalRef}
        index={1}
        enableDynamicSizing
        backgroundStyle={styles.bottomSheetContainer}
        backdropComponent={({ style }) => (
          <View
            style={style}
            onTouchEnd={() => bottomSheetModalRef.current?.close()}
          />
        )}
      >
        <BottomModal
          accessGrant={selectedAG}
          accessGrantGroup={selectedWebId ? selectedRequest : undefined}
          onRevoke={handleRevoke}
        />
      </BottomSheetModal>
      {selectedAG && (
        <ConfirmModal
          visible={modalVisible}
          title={"Revoke Access?"}
          content={`${selectedAG.ownerName} will no longer have access to ${selectedAG.resourceName}.`}
          onConfirm={() => handleConfirmToRevoke(selectedAG!)}
          confirmLabel={"Revoke Access"}
          onClose={() => setModalVisible(false)}
        />
      )}

      {selectedWebId && (
        <ConfirmModal
          visible={modalVisible}
          title={"Revoke All Access?"}
          content={`${selectedRequest.ownerName} will no longer have access to anything in your wallet.`}
          onConfirm={() => handleConfirmToRevokeAGList(selectedRequest)}
          confirmLabel={"Revoke All Access"}
          onClose={() => setModalVisible(false)}
        />
      )}
      <Loading isLoading={isUpdating} />
    </>
  ) : (
    <View style={styles.container}>
      <Loading isLoading={isUpdating} />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)", // Semi-transparent background
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  bottomSheetContainer: {
    shadowColor: "#000000",
    shadowOffset: { width: 4, height: 9 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 5,
    borderRadius: 26,
  },
});

export default Page;
