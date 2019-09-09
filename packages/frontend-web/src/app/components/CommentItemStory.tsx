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

import { storiesOf } from '@storybook/react';
import faker from 'faker';
import { List } from 'immutable';
import React from 'react';
import { MemoryRouter } from 'react-router';

import {IAuthorModel, ModelId} from '../../models';
import { fakeArticleModel, fakeCategoryModel, fakeCommentModel } from '../../models/fake';
import { CommentItem, CommentItemArticle, CommentItemAuthor } from './CommentItem';

const category = fakeCategoryModel({label: 'ChuChu TV Nursery Rhymes & Kids Songs', unmoderatedCount: 2});
const article1 = fakeArticleModel({
  title: 'IMF chief Christine Lagarde warns Britain on Brexit: ‘It will never be as good as it is now’',
  categoryId: category.id,
});

const categories = new Map([
  [category.id, category],
]);

const author = {
  email: 'name@email.com',
  location: 'NYC',
  name: 'Bridie Skiles V',
  avatar: faker.internet.avatar(),
} as IAuthorModel;

const comment = fakeCommentModel({
  author: author,
  article: article1,
  articleId: article1.id,
  unresolvedFlagsCount: 1,
  flagsSummary: new Map([['red', List([1, 1, 0])]]),
});

function setHighlighted(_commentId: ModelId) {
  /* */
}

storiesOf('CommentItem', module)
  .addDecorator((story) => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('CommentItemArticle', () => {
    return ([
      <CommentItemArticle key="test1" article={article1} category={category}/>,
    ]);
  })
  .add('CommentItemAuthor', () => {
    return ([
      <CommentItemAuthor key="test1" author={author}/>,
    ]);
  }).add('CommentItem', () => {
    return ([
      <CommentItem key="test1" showArticle categories={categories} article={article1} comment={comment} setHighlighted={setHighlighted}/>,
      <hr key="sep1" style={{margin: '20px'}}/>,
      <CommentItem key="test2" categories={categories} article={article1} comment={comment} setHighlighted={setHighlighted}/>,
    ]);
  });
