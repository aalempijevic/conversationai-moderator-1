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

import { storiesOf } from '@storybook/react';
import { List } from 'immutable';
import { fakeRuleModel, fakeTagModel } from '../../../../../models/fake';
import { ArticleRuleRow } from './ArticleRuleRow';

const tags = List([
  fakeTagModel({ id: '1', label: 'Tag 1' }),
  fakeTagModel({ id: '2', label: 'Tag 2' }),
  fakeTagModel({ id: '3', label: 'Tag 3' }),
  fakeTagModel({ id: '4', label: 'Tag 4' }),
  fakeTagModel({ id: '5', label: 'Tag 5' }),
  fakeTagModel({ id: '6', label: 'Tag 6' }),
]);

const rangeBottom = 0;
const rangeTop = 100;

storiesOf('RuleRow', module)
  .add('Rule Row', () => {
    return (
      <ArticleRuleRow
        tags={tags}
        rangeBottom={rangeBottom}
        rangeTop={rangeTop}
        
        rule={fakeRuleModel({ id: '1' })}

      />
    );
  });
