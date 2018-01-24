/*
Copyright 2018 New York Times Company.

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

import { fromJS, Record } from 'immutable';
import { TypedRecord } from 'typed-immutable-record';

export interface IFlagAttributes {
  id: string;
  commentId: string;
  labels: Array<string>;
}

export interface IFlagModel extends TypedRecord<IFlagModel>, IFlagAttributes {}

export const FlagModelRecord = Record({
  id: null,
  commentId: null,
  labels: null,
});

export function FlagModel(keyValuePairs?: IFlagAttributes): IFlagModel {
  let immutableKeyValuePairs = fromJS(keyValuePairs);

  const extra = immutableKeyValuePairs.get('extra');
  let labels = [];
  try {
    const parsedExtra = JSON.parse(extra);
    labels = parsedExtra && parsedExtra.completeTags || [];
  }
  finally {}

  immutableKeyValuePairs = immutableKeyValuePairs.set('labels', labels);

  return new FlagModelRecord(immutableKeyValuePairs) as IFlagModel;
}
