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

import {IUserInstance, User} from '@conversationai/moderator-backend-core';

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

    const userdata = users.map((u: IUserInstance) => {
      const simple = u.toJSON();
      simple.extra = JSON.parse(u.get('extra'));
      return pick(simple, userFields);
    });

    res.json({ users: userdata });

    next();
  });

  return router;
}
