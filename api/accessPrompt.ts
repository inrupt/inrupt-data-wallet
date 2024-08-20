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
import type { AccessRequest } from "@/types/accessRequest";
import type { AccessPromptResource } from "@/types/accessPrompt";
import { makeApiRequest, objectToParams } from "./apiRequest";

export const getAccessPromptResource = async (accessPrompt: {
  webId: string;
  type: string;
}): Promise<AccessPromptResource> => {
  return makeApiRequest<AccessPromptResource>(
    `accessprompt/resource?${objectToParams(accessPrompt)}`,
    "GET"
  );
};

export const requestAccessPrompt = async (params: {
  resource: string;
  client: string;
}): Promise<void> => {
  await makeApiRequest<AccessRequest[]>(
    "accessprompt",
    "POST",
    JSON.stringify(params)
  );
};
