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
