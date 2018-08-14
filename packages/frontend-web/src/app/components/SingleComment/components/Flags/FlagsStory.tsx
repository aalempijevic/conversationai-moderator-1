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

import { List } from 'immutable';
import { storiesOf } from '@kadira/storybook';

import { FlagModelRecord, IFlagModel } from '../../../../../models';
import { Flags } from '../Flags';

const getFlag = (id: string, labels: Array<string>) => {
  return FlagModelRecord({
    id,
    commentId: 1,
    labels,
  }) as IFlagModel;
};

storiesOf('Flags', {})
  .add('default list', () => {
    const flags = List([
      getFlag('1', ['foo']),
      getFlag('2', ['bar']),
      getFlag('3', ['foo', 'bar']),
      getFlag('4', ['bar', 'baz']),
    ]);

    return (
      <Flags flags={flags} />
    );
  });
