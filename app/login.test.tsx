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

import LoginScreen from "@/app/login";
import { render } from "@/test/providers";
import * as SessionHooks from "@/hooks/session";

const { useSession } = SessionHooks;

jest.mock("@/hooks/session", () => {
  const actualSessionModule = jest.requireActual(
    "@/hooks/session"
  ) as typeof SessionHooks;
  const actualSessionProvider = actualSessionModule.SessionProvider;
  return {
    useSession: jest.fn<typeof useSession>(),
    SessionProvider: actualSessionProvider,
  };
});

jest.mock("expo-router", () => {
  const actualExpoRouter = jest.requireActual(
    "expo-router"
  ) as typeof ExpoRouter;
  return {
    ...actualExpoRouter,
    Redirect: jest.fn<typeof actualExpoRouter.Redirect>(),
  };
});

describe("Snapshot testing the login screen", () => {
  it("renders the login screen when unauthenticated", async () => {
    // Mocks start...
    const { useSession: mockedUseSession } = jest.requireMock(
      "@/hooks/session"
    ) as jest.Mocked<typeof SessionHooks>;
    const [mockedSignIn, mockedSignOut, mockedSession] = [
      jest.fn(),
      jest.fn(),
      // When the session is logged out, the sessionId is undefined.
      undefined,
    ];
    mockedUseSession.mockReturnValueOnce({
      signIn: mockedSignIn,
      signOut: mockedSignOut,
      session: mockedSession,
    });
    // ... mocks end.

    render(<LoginScreen />);
    const loginButton = await screen.findByTestId("login-button");
    expect(loginButton).toBeDefined();
    expect(loginButton).toBeVisible();
    expect(loginButton).toHaveTextContent("Login");
    const { Redirect: mockedRedirect } = jest.requireMock(
      "expo-router"
    ) as jest.Mocked<typeof ExpoRouter>;
    expect(mockedRedirect).not.toHaveBeenCalledWith();
  });

  it("redirects to the home screen when authenticated", async () => {
    // Mocks start...
    const { useSession: mockedUseSession } = jest.requireMock(
      "@/hooks/session"
    ) as jest.Mocked<typeof SessionHooks>;
    const [mockedSignIn, mockedSignOut, mockedSession] = [
      jest.fn(),
      jest.fn(),
      "some-session-id",
    ];
    mockedUseSession.mockReturnValueOnce({
      signIn: mockedSignIn,
      signOut: mockedSignOut,
      session: mockedSession,
    });
    const { Redirect: mockedRedirect } = jest.requireMock(
      "expo-router"
    ) as jest.Mocked<typeof ExpoRouter>;
    // This checks that the Redirect component is returned.
    mockedRedirect.mockReturnValue("Dummy return" as unknown as null);
    // ... mocks end.

    render(<LoginScreen />);
    // The login button should *not* be mounted
    await expect(() => screen.findByTestId("login-button")).rejects.toThrow();
    // Check that what we get back here is the result of the redirect.
    expect(screen.toJSON()).toBe("Dummy return");
  });
});
