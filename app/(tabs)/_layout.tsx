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

import { Redirect, Tabs } from "expo-router";
import type { MutableRefObject } from "react";
import React, { useEffect, useRef, useState } from "react";
import HouseOutLine from "@/assets/images/house-outline.svg";
import AccessOutLine from "@/assets/images/access-outline.svg";
import AccessSolid from "@/assets/images/access-solid.svg";

import { FontAwesome6 } from "@expo/vector-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons/faBell";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { useSession } from "@/hooks/session";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
// import { Image } from "expo-image";
import PopupMenu from "@/components/PopupMenu";
import { ThemedText } from "@/components/ThemedText";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserInfo, signup } from "@/api/user";
import type { UserInfo } from "@/constants/user";

const { width, height } = Dimensions.get("window");

export default function TabLayout() {
  const [isShowSplash, setIsShowSplash] = useState(true);

  const { session, signOut } = useSession();
  const {
    isFetching,
    data: userInfo,
    refetch,
  } = useQuery<UserInfo>({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
    enabled: !!session,
  });

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: async () => {
      setIsShowSplash(false);
      await refetch();
    },
    onError: () => {
      setIsShowSplash(true);
    },
  });

  const rotation = useRef(new Animated.Value(0)).current;

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [positionType, setPositionType] = useState<
    "topMiddle" | "bottomLeft" | "bottomMiddle"
  >("bottomMiddle");

  useEffect(() => {
    if (userInfo && userInfo.signupRequired && session) {
      signupMutation.mutateAsync().catch((error) => {
        console.error("Error while signup", error);
        signOut();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo, session]);

  const tabBarAddButtonRef = useRef(null);
  const rightHeaderAddButtonRef = useRef(null);
  const toggleMenu = (
    type: "topMiddle" | "bottomLeft" | "bottomMiddle" = "topMiddle",
    buttonRef: MutableRefObject<null> = rightHeaderAddButtonRef,
    animated = false
  ) => {
    if (buttonRef && buttonRef.current) {
      if (animated)
        Animated.timing(rotation, {
          toValue: menuVisible ? 0 : 1,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {});
      (
        buttonRef.current as unknown as {
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
          setMenuVisible(!menuVisible);
        }
      );
    }
  };
  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  const animatedStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  if (!session) {
    return <Redirect href="/login" />;
  }

  if (isFetching || (userInfo!.signupRequired && isShowSplash)) {
    return (
      <View style={styles.container}>
        {!isFetching && (
          <Image
            // eslint-disable-next-line global-require
            source={require("../../assets/images/signup-splash.png")}
            style={styles.image}
          />
        )}
      </View>
    );
  }

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "black",
          tabBarLabelStyle: {
            fontFamily: "ReadexPro-Regular",
            color: "#262626",
            fontSize: 12,
          },

          headerTitleAlign: "center",
          tabBarStyle: { borderTopWidth: 0, elevation: 0 },
          headerStyle: {
            borderBottomWidth: 0,
            shadowOffset: { width: 0, height: 0 },
          },
          headerTitleStyle: { fontFamily: "ReadexPro-Regular", fontSize: 18 },
          headerShadowVisible: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) =>
              focused ? (
                <FontAwesome6 size={24} name="house" color={color} />
              ) : (
                <HouseOutLine width={24} height={24} />
              ),
            headerTitle: "Wallet",
            headerRight: () => (
              <TouchableOpacity
                ref={rightHeaderAddButtonRef}
                onPress={() =>
                  toggleMenu("bottomLeft", rightHeaderAddButtonRef, true)
                }
              >
                <Animated.View style={animatedStyle}>
                  <FontAwesome6 size={32} name="circle-plus" />
                </Animated.View>
              </TouchableOpacity>
            ),
            headerRightContainerStyle: { paddingRight: 16 },
          }}
        />

        <Tabs.Screen
          name="requests"
          options={{
            title: "Requests",
            headerTitle: "Access Requests",
            tabBarIcon: ({ color, focused }) =>
              focused ? (
                <FontAwesomeIcon icon={faBell} size={24} />
              ) : (
                <FontAwesome6 size={24} name="bell" color={color} />
              ),
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: "Add",
            tabBarButton: () => (
              <View style={styles.addTabBarButtonContainer}>
                <TouchableOpacity
                  ref={tabBarAddButtonRef}
                  onPress={() => toggleMenu("topMiddle", tabBarAddButtonRef)}
                >
                  <FontAwesome6 size={26} name="circle-plus" />
                  <ThemedText style={{ fontSize: 12, paddingTop: 4 }}>
                    Add
                  </ThemedText>
                </TouchableOpacity>
              </View>
            ),
          }}
          redirect={false}
        />
        <Tabs.Screen
          name="accesses"
          options={{
            title: "Access",
            tabBarIcon: ({ focused }) =>
              focused ? (
                <AccessSolid width={24} height={24} />
              ) : (
                <AccessOutLine width={24} height={24} />
              ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) =>
              focused ? (
                <FontAwesomeIcon icon={faUser} size={24} />
              ) : (
                <FontAwesome6 size={24} name={"user"} color={color} />
              ),
          }}
        />
      </Tabs>
      <PopupMenu
        visible={menuVisible}
        onClose={() => toggleMenu("topMiddle", rightHeaderAddButtonRef, true)}
        position={menuPosition}
        positionType={positionType}
      />
    </>
  );
}

const styles = StyleSheet.create({
  addTabBarButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingTop: 4,
  },
  container: {
    flex: 1,
  },
  image: {
    width,
    height,
    resizeMode: "cover",
  },
});
