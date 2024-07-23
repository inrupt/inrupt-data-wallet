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
import { Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  fontWeight?: "regular" | "semiBold" | "medium" | "bold" | "light";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  fontWeight = "regular",
  ...rest
}: ThemedTextProps) {
  const color = lightColor;
  return (
    <Text
      style={[
        { color },
        fontWeight === "regular"
          ? { fontFamily: "ReadexPro-Regular" }
          : undefined,
        fontWeight === "semiBold"
          ? { fontFamily: "ReadexPro-SemiBold" }
          : undefined,
        fontWeight === "medium"
          ? { fontFamily: "ReadexPro-Medium" }
          : undefined,
        fontWeight === "bold" ? { fontFamily: "ReadexPro-Bold" } : undefined,
        fontWeight === "light" ? { fontFamily: "ReadexPro-Light" } : undefined,
        { fontSize: 16 },
        style,
      ]}
      {...rest}
    />
  );
}
