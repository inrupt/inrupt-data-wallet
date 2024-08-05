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
import { faFile } from "@fortawesome/free-solid-svg-icons/faFile";
import { faImage } from "@fortawesome/free-solid-svg-icons/faImage";
import { faIdCard } from "@fortawesome/free-solid-svg-icons/faIdCard";
import { faWallet } from "@fortawesome/free-solid-svg-icons/faWallet";
import { AccessRequestMode } from "@/types/enums";
import type { WalletFile } from "@/types/WalletFile";

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export const isImageFile = (filename: string): boolean => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  const extension = filename?.split(".")?.pop()?.toLowerCase();
  return extension ? imageExtensions.includes(extension) : false;
};

export const getFileContainerByResource = (resource: string) => {
  const match = resource.match(/\/([^/]+)\/?$/);
  return match ? match[1] : "";
};

export const isDisplayDetailedPage = (file: WalletFile) => {
  return isImageFile(file.fileName) || file.isRDFResource;
};

export const addSpacesToCamelCase = (camelString: string) => {
  return camelString.replace(/([a-z])([A-Z])/g, "$1 $2");
};

export const getIconFile = (
  fileName: string,
  isRDFResource: boolean = false
) => {
  if (fileName.endsWith("/")) {
    return faWallet;
  }
  if (isRDFResource) return faIdCard;

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  const extension = fileName.split(".")?.pop()?.toLowerCase();
  if (extension) {
    if (imageExtensions.includes(extension)) return faImage;
  }
  return faFile;
};

export const isAccessContainer = (resourceUri: string) =>
  resourceUri.endsWith("/");

export const formatResourceName = (
  resource: string,
  isRDFResource: boolean,
  resourceUri: string = ""
): string => {
  let newResource = resource;
  let isContainer = false;
  if (resourceUri && resourceUri.endsWith("/")) {
    isContainer = true;
  }
  if (newResource.endsWith("/")) {
    newResource = newResource.slice(0, -1);
  }

  const parts = newResource.split("/");
  let lastPart = parts[parts.length - 1];
  if (isRDFResource && lastPart.includes(".")) {
    lastPart = lastPart.split(".").slice(0, -1).join(".");
  } else if (isContainer) {
    lastPart = capitalize(lastPart);
  }
  return lastPart;
};

export const removeFileExtension = (resource: string) => {
  const parts = resource.split("/");
  const lastPart = parts[parts.length - 1];
  return lastPart.split(".").slice(0, -1).join(".");
};

export const isWriteMode = (modes: AccessRequestMode[]) =>
  modes.some((mode) => mode === AccessRequestMode.Write);
