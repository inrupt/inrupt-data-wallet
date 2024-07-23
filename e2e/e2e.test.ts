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
import { describe, beforeAll, it } from "@jest/globals";
import { device } from "detox";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import "./setupEnv";

describe("E2E Test", () => {
  jest.setTimeout(300000);

  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  const testUsername = process.env.TEST_ACCOUNT_USERNAME || "";
  const testPassword = process.env.TEST_ACCOUNT_PASSWORD || "";

  beforeEach(async () => {
    await device.reloadReactNative();
    await LoginPage.loginIfNeeded(testUsername, testPassword);
  });

  // eslint-disable-next-line jest/expect-expect
  it("verify home screen components", async () => {
    await HomePage.verifyHomeScreenComponents();
  });
});
