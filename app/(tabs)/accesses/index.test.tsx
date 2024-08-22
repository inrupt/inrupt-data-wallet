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
import * as SessionHooks from "@/hooks/session";
import { AccessRequestMode } from "@/types/enums";
import type { AccessGrant } from "@/types/accessGrant";
import GrantsScreen from "./index";

const { useSession } = SessionHooks;

function mockUseQuery(
  data: AccessGrant[]
): ReturnType<typeof ReactQuery.useQuery> {
  return {
    data,
    isLoading: false,
    isFetching: false,
    refetch: jest.fn<ReturnType<typeof ReactQuery.useQuery>["refetch"]>(),
  } as unknown as ReturnType<typeof ReactQuery.useQuery>;
}

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
    useQuery: jest.fn<typeof ReactQuery.useQuery>(),
  };
});

jest.mock("expo-router", () => {
  const actualExpoRouter = jest.requireActual(
    "expo-router"
  ) as typeof ExpoRouter;
  return {
    ...actualExpoRouter,
    useRouter: jest.fn<typeof actualExpoRouter.useRouter>().mockReturnValue({
      // Only mock a subset of the Expo Router
      navigate: jest.fn(),
    } as unknown as ReturnType<(typeof ExpoRouter)["useRouter"]>),
    useFocusEffect: jest.fn<typeof actualExpoRouter.useFocusEffect>(),
    useLocalSearchParams: jest
      .fn<typeof actualExpoRouter.useLocalSearchParams>()
      .mockReturnValue({ forceLogout: undefined }),
    useNavigation: jest
      .fn<typeof actualExpoRouter.useNavigation>()
      .mockReturnValue({ setOptions: jest.fn() }),
    Redirect: jest.fn<typeof actualExpoRouter.Redirect>(),
  };
});

jest.mock("@/hooks/session", () => {
  const actualSessionModule = jest.requireActual(
    "@/hooks/session"
  ) as typeof SessionHooks;
  const actualSessionProvider = actualSessionModule.SessionProvider;
  return {
    useSession: jest.fn<typeof useSession>().mockReturnValue({
      signOut: jest.fn(),
      signIn: jest.fn(),
      session: "some-session-id",
    }),
    SessionProvider: actualSessionProvider,
  };
});

// This module is ESM-only, which is problematic for Jest imports.
jest.mock("@fortawesome/react-native-fontawesome", () => ({
  FontAwesomeIcon: jest.fn(),
}));

describe("Snapshot testing the home screen", () => {
  it("shows text when no access granted", async () => {
    // Mocks begin...
    const { useQuery: mockedUseQuery } = jest.requireMock(
      "@tanstack/react-query"
    ) as jest.Mocked<typeof ReactQuery>;
    mockedUseQuery.mockReturnValue(mockUseQuery([]));
    // ... mocks end

    render(<GrantsScreen />);
    await expect(
      screen.findByTestId("no-access-grants-text")
    ).resolves.toBeVisible();
  });

  it("shows pending requests", async () => {
    // Mocks begin...
    const { useQuery: mockedUseQuery } = jest.requireMock(
      "@tanstack/react-query"
    ) as jest.Mocked<typeof ReactQuery>;
    mockedUseQuery.mockReturnValue(
      mockUseQuery([
        {
          uuid: "0000-0000-0000-0000",
          webId: "https://example.org/id/some-username",
          ownerName: "Some Owner",
          expirationDate: new Date("2024-08-22:12:00:00Z"),
          issuedDate: new Date("2024-08-22:12:00:00Z"),
          forPurpose: "https://example.org/ns/some-purpose",
          modes: [AccessRequestMode.Read],
          logo: "https://example.org/id/some-username#some-profile-pic",
          identifier: "some-identifier",
          resource: "https://example.org/storage/some-resource",
          resourceName: "some-resource",
          isRDFResource: false,
        },
      ])
    );
    // ... mocks end

    render(<GrantsScreen />);
    await expect(
      screen.findByTestId("access-grants-list")
    ).resolves.toBeVisible();
    await expect(screen.findByText("Some Owner")).resolves.toBeVisible();
    await expect(
      screen.findByText("https://example.org/id/some-username")
    ).resolves.toBeVisible();
  });
});
