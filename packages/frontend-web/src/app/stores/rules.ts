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

import { List } from 'immutable';
import { Action, createAction, handleActions } from 'redux-actions';
import { makeTypedFactory, TypedRecord } from 'typed-immutable-record';

import { IRuleModel } from '../../models';
import { IAppStateRecord } from './index';

const STATE_ROOT = ['global', 'rules'];
const RULES_DATA = [...STATE_ROOT, 'items'];

export const rulesUpdated = createAction(
  'all-rules/UPDATED',
);

export function getRules(state: IAppStateRecord): List<IRuleModel> {
  return state.getIn(RULES_DATA);
}

export interface IRulesState {
  items: List<IRuleModel>;
}

export interface IRulesStateRecord extends TypedRecord<IRulesStateRecord>, IRulesState {}

const StateFactory = makeTypedFactory<IRulesState, IRulesStateRecord>({
  items: List<IRuleModel>(),
});

const reducer = handleActions<IRulesStateRecord, List<IRuleModel>>( {
  [rulesUpdated.toString()]: (state: IRulesStateRecord, { payload }: Action<List<IRuleModel>>) => {
    return state.set('items', payload);
  },
}, StateFactory());

export { reducer };
