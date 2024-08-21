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

import * as React from "react";
import { screen } from "@testing-library/react-native";

import { jest, describe, it, expect } from "@jest/globals";
import type * as ExpoRouter from "expo-router";
import type * as ReactQuery from "@tanstack/react-query";

import { render } from "@/test/providers";

import HomeScreen from "./index";

jest.mock("expo-router", () => {
  const actualExpoRouter = jest.requireActual(
    "expo-router"
  ) as typeof ExpoRouter;
  return {
    // ...actualExpoRouter,
    useRouter: jest.fn<typeof actualExpoRouter.useRouter>().mockReturnValue({
      // Only mock a subset of the Expo Router
      navigate: jest.fn(),
    } as unknown as ReturnType<(typeof ExpoRouter)["useRouter"]>),
    useFocusEffect: jest.fn<typeof actualExpoRouter.useFocusEffect>(),
    Redirect: jest.fn<typeof actualExpoRouter.Redirect>(),
  };
});

jest.mock("@tanstack/react-query", () => {
  const actualReactQuery = jest.requireActual(
    "@tanstack/react-query"
  ) as typeof ReactQuery;
  return {
    ...actualReactQuery,
    // Only mock the subset of the module relevant to the test.
    useIsMutating: jest.fn<typeof ReactQuery.useIsMutating>(),
    useMutation: jest.fn<typeof ReactQuery.useMutation>(),
    useQueryClient: jest.fn<typeof ReactQuery.useQueryClient>(),
    useQuery: jest.fn<typeof ReactQuery.useQuery>().mockReturnValue({
      data: [
        {
          identifier: "some-file-identifier",
          fileName: "some-file-name",
          isRDFResource: true,
        },
      ],
      isLoading: false,
      isFetching: false,
      refetch: jest.fn<ReturnType<typeof ReactQuery.useQuery>["refetch"]>(),
    } as unknown as ReturnType<typeof ReactQuery.useQuery>),
  };
});

describe("Snapshot testing the home screen", () => {
  it("shows the given file list", async () => {
    render(<HomeScreen />);
    const fileEntry = await screen.findByText("some-file-name");
    expect(fileEntry).toBeVisible();
  });
});
