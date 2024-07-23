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
import Svg, {
  G,
  Text,
  Defs,
  Circle,
  Mask,
  Use,
  Polygon,
  TSpan,
} from "react-native-svg";

const Logo: React.FC = () => (
  <Svg width="302px" height="239px" viewBox="0 0 302 239">
    <Defs>
      <Circle id="path-1" cx="45" cy="45" r="45"></Circle>
    </Defs>
    <G id="Wallet-MVP" stroke="none" strokeWidth="1" fill="none">
      <G id="Wallet-MVP-Login" transform="translate(-221, -510)">
        <G id="Logo" transform="translate(221.5, 510)">
          <Text
            id="Future-Co-Wallet"
            fontFamily="ReadexPro-Regular_Bold, Readex Pro"
            fontSize="50.4"
            fontWeight="700"
            fill="#1C2033"
          >
            <TSpan x="0.0056" y="163">
              {" "}
              FUTURE CO
            </TSpan>
            <TSpan x="45.29" y="226">
              WALLET
            </TSpan>
          </Text>
          <G transform="translate(105.5, 0)">
            <Mask id="mask-2" fill="white">
              <Use xlinkHref="#path-1"></Use>
            </Mask>
            <Use id="Mask" fill="#1C2033" xlinkHref="#path-1"></Use>
            <Polygon
              id="Star"
              fill="#FFFFFF"
              mask="url(#mask-2)"
              points="46.4516129 74.0322581 17.4415666 89.283742 22.9819924 56.9805807 -0.487628062 34.1033548 31.9465897 29.3903871 46.4516129 0 60.9566361 29.3903871 93.3908539 34.1033548 69.9212334 56.9805807 75.4616592 89.283742"
            ></Polygon>
          </G>
        </G>
      </G>
    </G>
  </Svg>
);

export default Logo;
