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
export interface AccessPromptQR {
  webId: string;
  client: string;
  type: string;
}

export function isAccessPromptQR(
  qr: unknown | AccessPromptQR
): qr is AccessPromptQR {
  return isValidUrl((qr as AccessPromptQR).webId) &&
    typeof (qr as AccessPromptQR).client === "string" &&
    typeof (qr as AccessPromptQR).type === "string";
}

export interface AccessPromptResource {
  webId: string;
  resource: string;
  resourceName: string;
  logo: string;
  ownerName: string;
}

export interface DownloadQR {
  uri: string;
  contentType: string;
}

export function isDownloadQR(
  qr: unknown | DownloadQR,
): qr is DownloadQR {
  return isValidUrl((qr as DownloadQR).uri) &&
    typeof (qr as DownloadQR).contentType === "string";
}

const isValidUrl = (str: string): boolean => {
  try {
    return Boolean(new URL(str));
  } catch {
    return false;
  }
};
