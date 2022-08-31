import { Record } from 'immutable';
import { TypedRecord } from 'typed-immutable-record';
import { ModelId } from './common';

export interface IRestrictedTermAttributes {
  id: ModelId;
  articleId?: string;
  term: string;
  score: number;
}

export interface IRestrictedTermModel extends TypedRecord<IRestrictedTermModel>, IRestrictedTermAttributes {};

const RestrictedTermModelRecord = Record({
  id: null,
  term: null,
  score: null,
});

export function RestrictedTermModel(keyValuePairs?:IRestrictedTermAttributes): IRestrictedTermModel {
  return new RestrictedTermModelRecord(keyValuePairs) as IRestrictedTermModel;
}