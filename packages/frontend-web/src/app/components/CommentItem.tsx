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

import React from 'react';

import {
  Switch,
} from '@material-ui/core';
import { OpenInNew } from '@material-ui/icons/';

import {
  IArticleModel,
  IAuthorAttributes,
  ICategoryModel,
  ICommentModel,
  ModelId,
} from '../../models';
import { ITopScore } from '../../types';
import { Avatar } from './Avatar';
import { CommentText } from './CommentText';
import { FlagsSummary } from './FlagsSummary';
import { MagicTimestamp } from './MagicTimestamp';

export function CommentItemArticle(props: {
  category: ICategoryModel;
  article: IArticleModel;
}) {
  const {category, article} = props;
  return (
    <div key="article">
      <div key="title">
        {article.title}
      </div>
      {article.categoryId && (
        <div key="category">
          {category.label}
        </div>
      )}
      Published:  <MagicTimestamp key="timestamp" timestamp={article.sourceCreatedAt}/>
      {article.url && (
        <div key="link">
            <a href={article.url} target="_blank">
                <OpenInNew fontSize="small"/>
            </a>
        </div>
      )}
    </div>
  );
}

export function CommentItemAuthor(props: {
  author: IAuthorAttributes,
}) {
  const {author} = props;

  return (
    <div key="author">
      {author.avatar && <Avatar target={author} size={30}/>}
      <div key="name">{author.name}</div>
      {author.location && <div key="location">{author.location}</div>}
    </div>
  );
}

export function CommentItem(props: {
  categories: Map<ModelId, ICategoryModel>;
  article: IArticleModel,
  comment: ICommentModel,
  showArticle?: boolean,
  topScore?: ITopScore;
  setHighlighted(commentId: ModelId): void,
}) {
  const {categories, article, comment} = props;

  function setHighlighted() {
    props.setHighlighted(comment.id);
  }
  return (
    <div key={`comment-${comment.id}`}>
      {props.showArticle && article &&
        <CommentItemArticle category={categories.get(article.categoryId)} article={article}/>
      }
      <div key="comment">
        {comment.author && <CommentItemAuthor author={comment.author}/>}
        <MagicTimestamp timestamp={comment.sourceCreatedAt}/>
        <div key="text">
          <CommentText text={comment.text} highlight={props.topScore}/>
        </div>
        <div key="flags">
          Highlighted: <Switch checked={comment.isHighlighted} color="primary" onChange={setHighlighted}/>
          {comment.unresolvedFlagsCount > 0 && (<span>User Flags: <FlagsSummary comment={comment}/></span>)}
        </div>
      </div>
    </div>
  );
}
