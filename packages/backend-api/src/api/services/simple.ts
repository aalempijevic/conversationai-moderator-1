/*
Copyright 2017 Google Inc.

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

import * as express from 'express';
import { pick } from 'lodash';

import { User, USER_GROUP_SERVICE } from '@conversationai/moderator-backend-core';
import { createToken } from '@conversationai/moderator-backend-core';
import { getOAuthConfiguration } from '@conversationai/moderator-backend-core';

const userFields = ['id', 'name', 'email', 'group', 'isActive', 'extra'];

export function createSimpleRESTService(): express.Router {
  const router = express.Router({
    caseSensitive: true,
    mergeParams: true,
  });

  router.get('/systemUsers/:type', async (req, res, next) => {
    const users = await User.findAll({
      where: {
        group: req.params.type,
      },
    });

    const userdata: Array<any> = [];
    for (const u of users) {
      const simple = u.toJSON();
      if (req.params.type === USER_GROUP_SERVICE) {
        const token = await createToken(u.id);
        simple.extra = {jwt: token};
      }
      else {
        simple.extra = JSON.parse(u.get('extra'));
      }
      userdata.push(pick(simple, userFields));
    }

    res.json({ users: userdata });

    next();
  });

  router.get('/config/get', async (_, res, next) => {
    const config = await getOAuthConfiguration();
    const id = config ? config.id : '';
    res.json({ google_oauth_client_id: id });
    next();
  });

  router.post('/config/google_oauth', async(_req, _res, next) => {
    // const id = req.post
    next();
  });

  return router;
}
