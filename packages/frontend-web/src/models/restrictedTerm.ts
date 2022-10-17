import { Record } from "immutable";
import { TypedRecord } from "typed-immutable-record";
import { ModelId } from "./common";

export interface IRestrictedTermAttributes {
  id: ModelId;
  articleId?: string;
  term: string;
  score: number;
}

export interface INewArticleRestrictedTerm {
  id: "-1";
  articleId: string;
  score: number;
  term: string;
}

export enum RestrictedTermLevels {
  approve = "0.1",
  highlight = "0.5",
  reject = "0.9",
}

// Keeping code below until restricted term global and article level controls are complete
export interface IRestrictedTermModel extends TypedRecord<IRestrictedTermModel>, IRestrictedTermAttributes {}

const RestrictedTermModelRecord = Record({
  id: null,
  term: null,
  score: null,
});

export function RestrictedTermModel(keyValuePairs?: IRestrictedTermAttributes): IRestrictedTermModel {
  return new RestrictedTermModelRecord(keyValuePairs) as IRestrictedTermModel;
}
