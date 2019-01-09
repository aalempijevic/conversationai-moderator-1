/*
Copyright 2019 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { google } from 'googleapis';

import { CONFIGURATION_GOOGLE_OAUTH, getConfigItem, setConfigItem } from '@conversationai/moderator-backend-core';
import { config } from '@conversationai/moderator-config';

export interface IGoogleOAuthConfiguration {
  id: string;
  secret: string;
}

export async function getOAuthConfiguration() {
  return await getConfigItem(CONFIGURATION_GOOGLE_OAUTH) as IGoogleOAuthConfiguration | null;
}

export async function checkOAuthConfiguration(oauthConfig: IGoogleOAuthConfiguration) {
  console.log(oauthConfig);
  const oauth2Client = new google.auth.OAuth2(
    oauthConfig.id,
    oauthConfig.secret,
    `${config.get('api_url')}/auth/callback/google`,
  );
  const x = await oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
  });
  console.log(x);
  return true;
}

export async function setOAuthConfiguration(oauthConfig: IGoogleOAuthConfiguration) {
  return await setConfigItem(CONFIGURATION_GOOGLE_OAUTH, oauthConfig);
}
