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
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import type { StyleProp } from "react-native/Libraries/StyleSheet/StyleSheet";
import type { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant: "primary" | "tertiary" | "secondary";
  customStyle?: StyleProp<ViewStyle> | undefined;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  customStyle = {},
  disabled = false,
  ...restProps
}) => {
  const buttonStyle: {
    [key in CustomButtonProps["variant"]]: {
      backgroundColor: string;
      borderColor: string;
      borderWidth?: number;
    };
  } = {
    primary: {
      backgroundColor: "#000000",
      borderColor: "#000000",
      borderWidth: 3,
    },
    tertiary: {
      backgroundColor: "#E7F1F7",
      borderColor: "#E7F1F7",
    },
    secondary: {
      backgroundColor: "#FFFFFF",
      borderColor: "#000000",
      borderWidth: 3,
    },
  };

  const textColor = {
    primary: "#FFFFFF",
    tertiary: "#000000",
    secondary: "#000000",
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.button,
        {
          backgroundColor: buttonStyle[variant].backgroundColor,
          borderColor: buttonStyle[variant].borderColor,
          borderWidth: buttonStyle[variant].borderWidth,
        },
        disabled && { backgroundColor: "grey" },
        customStyle,
      ]}
      onPress={onPress}
      {...restProps}
    >
      <Text style={[styles.text, { color: textColor[variant] }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    minWidth: 200,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "ReadexPro-Bold",
  },
});

export default CustomButton;
