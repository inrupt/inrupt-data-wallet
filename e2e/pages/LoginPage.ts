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
import { by, element, expect, web } from "detox";
import detoxConfig from "../../.detoxrc";
import HomePage from "./HomePage";
import PermissionPage from "./PermissionPage";

class LoginPage {
  private loginButton: Detox.NativeElement;

  private signInFormUsernameInput: Detox.WebElement;

  private signInFormPasswordInput: Detox.WebElement;

  private signInSubmitButton: Detox.WebElement;

  constructor() {
    this.loginButton = element(by.text("Login"));
    this.signInFormUsernameInput = web.element(
      by.web.xpath('//*[@id="signInFormUsername"]')
    );
    this.signInFormPasswordInput = web.element(
      by.web.xpath('//*[@id="signInFormPassword"]')
    );
    this.signInSubmitButton = web.element(
      by.web.xpath('//*[@name="signInSubmitButton"]')
    );
  }

  async login(
    username: string,
    password: string,
    timeout: number = detoxConfig.custom.defaultTestTimeout
  ) {
    await expect(this.loginButton).toBeVisible();
    await this.loginButton.tap();
    await new Promise((resolve) => {
      setTimeout(resolve, timeout * 2);
    });

    // Perform login
    await expect(this.signInFormUsernameInput).toExist();
    await this.signInFormUsernameInput.runScript(`(element) => {
        element.value = "${username}";
      }`);

    await expect(this.signInFormPasswordInput).toExist();
    await this.signInFormPasswordInput.runScript(`(element) => {
        element.value = "${password}";
      }`);

    await expect(this.signInSubmitButton).toExist();
    await this.signInSubmitButton.runScript((buttonElement) => {
      buttonElement.click();
    });

    // Handle permission screen
    await new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
    await PermissionPage.clickContinueButton();
  }

  async loginIfNeeded(username: string, password: string) {
    if (!(await HomePage.isHomeScreenVisible())) {
      await this.login(username, password);
    }
  }
}

export default new LoginPage();
