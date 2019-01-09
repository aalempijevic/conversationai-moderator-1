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

import { Dispatch } from 'redux';
import {Action, createAction, handleActions} from 'redux-actions';
import { makeTypedFactory, TypedRecord } from 'typed-immutable-record';

import { fetchConfig, IConfigData } from '../platform/dataService';
import { IAppStateRecord } from './index';

const STATE_ROOT = ['global', 'config'];

const configLoaded = createAction<IConfigData>(
  'config/CONFIG_LOADED',
);

export function getConfig(state: IAppStateRecord) {
  return state.getIn(STATE_ROOT).data;
}

export interface IConfigState {
  data: IConfigData;
}

export interface IConfigStateRecord extends TypedRecord<IConfigStateRecord>, IConfigState {}

const StateFactory = makeTypedFactory<IConfigState, IConfigStateRecord>({
  data: {google_oauth_client_id: ''},
});

const reducer = handleActions<IConfigStateRecord, IConfigData>({
  [configLoaded.toString()]: (state: IConfigStateRecord, { payload }: Action<IConfigData>) => {
    return state.set('data', payload);
  },
}, StateFactory());

export { reducer };

export async function loadConfig(dispatch: Dispatch<IAppStateRecord>): Promise<void> {
  const result = await fetchConfig();

  await dispatch(configLoaded(result));
}
