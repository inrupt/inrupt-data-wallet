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
import mime from "mime";
import { makeApiRequest } from "./apiRequest";

interface FileObject {
  uri: string;
  name: string;
  type?: string;
}

export const fetchFiles = async (): Promise<WalletFile[]> => {
  return makeApiRequest<WalletFile[]>("wallet");
};

export const postFile = async (file: FileObject): Promise<void> => {
  console.log(process.env.EXPO_PUBLIC_WALLET_API);

  const formData = new FormData();
  formData.append("file", {
    name: file.name,
    type: mime.getType(file.name) || "application/octet-stream",
    uri: file.uri,
  } as unknown as Blob);

  await fetch(`${process.env.EXPO_PUBLIC_WALLET_API}/wallet`, {
    method: "PUT",
    body: formData,
  });
};

export const deleteFile = async (fileId: string): Promise<void> => {
  return makeApiRequest<void>(`wallet/${encodeURIComponent(fileId)}`, "DELETE");
};

export const getFile = async (fileId: string): Promise<Blob> => {
  return makeApiRequest<Blob>(
    `wallet/${encodeURIComponent(fileId)}?raw=true`,
    "GET"
  );
};

export const collectFileToPod = async (uri: string): Promise<Blob> => {
  return makeApiRequest<Blob>(
    `wallet/collect?url=${encodeURIComponent(uri)}`,
    "PUT"
  );
};
