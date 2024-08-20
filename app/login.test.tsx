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

describe("Snapshot testing the login screen", () => {
  it("renders the default home screen when unauthenticated", async () => {
    const { useSession: mockedUseSession } = jest.requireMock(
      "@/hooks/session"
    ) as jest.Mocked<typeof SessionHooks>;
    const [mockedSignIn, mockedSignOut, mockedSession] = [
      jest.fn(),
      jest.fn(),
      undefined,
    ];
    mockedUseSession.mockReturnValueOnce({
      signIn: mockedSignIn,
      signOut: mockedSignOut,
      session: mockedSession,
    });
    render(<LoginScreen />);
    const loginButton = await screen.findByTestId("login-button");
    expect(loginButton).toBeDefined();
    expect(loginButton).toBeVisible();
    expect(loginButton).toHaveTextContent("Login");
  });
});
