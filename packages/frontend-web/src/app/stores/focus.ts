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

import { IAppStateRecord } from './appstate';

export const focusedElement = createAction<string | null>('root/FOCUSED_ELEMENT');
export const unfocusedElement: () => Action<void> = createAction('root/UNFOCUSED_ELEMENT');
export const saveFocus: () => Action<void> = createAction('root/SAVE_FOCUS');
export const restoreFocus: () => Action<void> = createAction('root/RESTORE_FOCUS');

const STATE_ROOT = ['global', 'focus'];

export interface IFocusState {
  currentlyFocused: string | null;
  stack: List<string>;
}

export const initialState: IFocusState = {
  currentlyFocused: null,
  stack: List<string>(),
};

export const reducer = handleActions<
  Readonly<IFocusState>,
  (string | null) | // focusedElement
  void              // unfocusedElement, saveFocus, restoreFocus
>({
  [focusedElement.toString()]: (state, { payload }: Action<string | null>) =>
    ({...state, currentlyFocused: payload}),

  [unfocusedElement.toString()]: (state) =>
    ({...state, currentlyFocused:  null}),

  [saveFocus.toString()]: (state) =>
    ({...state, stack: state.stack.push(state.currentlyFocused)}),

  [restoreFocus.toString()]: (state) =>
    ({currentlyFocused: state.stack.last(), stack: state.stack.pop()}),
}, initialState);

export function getCurrentlyFocused(state: IAppStateRecord): string | null {
  return state.getIn(STATE_ROOT).currentlyFocused;
}
