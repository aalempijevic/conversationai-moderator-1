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

import { List, Map } from 'immutable';
import { Action, createAction, handleActions } from 'redux-actions';

import { listTextSizesByIds } from '../platform/dataService';
import { IAppStateRecord, IThunkAction } from './appstate';

const DATA_PREFIX = ['global', 'textSizes'];

const loadTextSizesStart = createAction(
  'text-sizes/LOAD_TEXT_SIZES_START',
);

type ILoadTestSizesCompletePayload = {
  textSizes: Map<string, number>;
};
const loadTextSizesComplete = createAction<ILoadTestSizesCompletePayload>(
  'text-sizes/LOAD_TEXT_SIZES_COMPLETE',
);

export interface ITextSizesState {
  isLoading: boolean;
  hasData: boolean;
  textSizes: Map<string, number>;
}

export const reducer = handleActions<
  Readonly<ITextSizesState>,
  void                          | // loadTextSizesStart
  ILoadTestSizesCompletePayload   // loadTextSizesComplete
>({
  [loadTextSizesStart.toString()]: (state) => ({...state, isLoading: true}),

  [loadTextSizesComplete.toString()]: (state, { payload: { textSizes } }: Action<ILoadTestSizesCompletePayload>) => ({
    isLoading: false,
    hasData: true,
    textSizes: state.textSizes.merge(textSizes),
  }),

}, {
  isLoading: true,
  hasData: false,
  textSizes: Map<string, number>(),
});

function getState(state: IAppStateRecord): ITextSizesState {
  return state.getIn(DATA_PREFIX);
}

export function getTextSizesHasData(state: IAppStateRecord): boolean {
  return getState(state).hasData;
}

export function getTextSizes(state: IAppStateRecord): Map<string, number> {
  return getState(state).textSizes;
}

export function loadTextSizesByIds(ids: List<string>, width: number): IThunkAction<Promise<void>> {
  return async (dispatch, getGlobalState) => {
    if (ids.size <= 0) {
      return;
    }

    await dispatch(loadTextSizesStart());

    const state = getGlobalState();
    const hasData = getTextSizesHasData(state);
    const loadedSizes = getTextSizes(state);
    const unloadedIDs = !hasData ? ids : ids.filter((id) => !loadedSizes.has(id));

    const textSizes = await listTextSizesByIds(unloadedIDs.toArray(), width);

    await dispatch(loadTextSizesComplete({ textSizes }));
  };
}
