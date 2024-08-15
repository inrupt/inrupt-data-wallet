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
import { by, element, waitFor } from "detox";
import detoxConfig from "../../.detoxrc";

class HomePage {
  private homeTitle: Detox.NativeElement;

  private requestsTab: Detox.NativeElement;

  private addButton: Detox.NativeElement;

  private accessTab: Detox.NativeElement;

  private profileTab: Detox.NativeElement;

  private walletTab: Detox.NativeElement;

  constructor() {
    this.homeTitle = element(by.text("Home"));
    this.requestsTab = element(by.text("Requests"));
    this.addButton = element(by.text("Add"));
    this.accessTab = element(by.text("Access"));
    this.profileTab = element(by.text("Profile"));
    this.walletTab = element(by.text("Wallet"));
  }

  async verifyHomeScreenComponents(
    timeout: number = detoxConfig.custom.defaultTestTimeout
  ) {
    await waitFor(this.homeTitle)
      .toBeVisible()
      .withTimeout(timeout * 2);
    await waitFor(this.requestsTab).toBeVisible().withTimeout(timeout);
    await waitFor(this.addButton).toBeVisible().withTimeout(timeout);
    await waitFor(this.accessTab).toBeVisible().withTimeout(timeout);
    await waitFor(this.profileTab).toBeVisible().withTimeout(timeout);
    await waitFor(this.walletTab).toBeVisible().withTimeout(timeout);
  }

  async isHomeScreenVisible(
    timeout: number = detoxConfig.custom.defaultTestTimeout
  ): Promise<boolean> {
    try {
      await waitFor(this.homeTitle).toBeVisible().withTimeout(timeout);
      // eslint-disable-next-line no-console
      console.log("Home screen is visible");
      return true;
    } catch {
      // eslint-disable-next-line no-console
      console.warn(
        `Warning: Home screen did not load within ${timeout}ms, login may be required`
      );
      return false;
    }
  }

  async clickOnAddButton() {
    await waitFor(this.addButton)
      .toBeVisible()
      .withTimeout(detoxConfig.custom.defaultTestTimeout);
    await this.addButton.tap();
  }

  // eslint-disable-next-line class-methods-use-this
  async showMenuOption(option: string) {
    const menuOptionElement = element(by.text(option));
    await waitFor(menuOptionElement)
      .toBeVisible()
      .withTimeout(detoxConfig.custom.defaultTestTimeout);
  }
}

export default new HomePage();
