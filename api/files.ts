//
// Copyright Inrupt Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
import mime from "mime";
import type { WalletFile } from "@/types/WalletFile";
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
  const formData = new FormData();
  formData.append("file", {
    name: file.name,
    type: file.type || mime.getType(file.name) || "application/octet-stream",
    uri: file.uri,
  } as unknown as Blob);

  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_WALLET_API}/wallet`,
      {
        method: "PUT",
        body: formData,
      }
    );

    if (response.ok) {
      console.debug(
        `Uploaded file to Wallet. HTTP response status:${response.status}`
      );
    } else {
      throw Error(
        `Failed to upload file to Wallet. HTTP response status from Wallet Backend service:${
          response.status
        }`
      );
    }
  } catch (error) {
    throw Error("Failed to retrieve and upload file to Wallet", {
      cause: error,
    });
  }
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
