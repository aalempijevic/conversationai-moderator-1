// import { Record } from 'immutable';
import { TypedRecord } from "typed-immutable-record";
import { ModelId } from "./common";

export interface IRestrictedTermAttributes {
  id: ModelId;
  articleId?: string;
  term: string;
  score: number;
}

// Unsure if needed.
export interface IRestrictedTermModel extends TypedRecord<IRestrictedTermModel>, IRestrictedTermAttributes {}

// I do not think the code below is needed.
// Mimicked other settings types at first.
// Restricted terms api endpoints are so different from the other settings.

// const RestrictedTermModelRecord = Record({
//   id: null,
//   term: null,
//   score: null,
// });

// export function RestrictedTermModel(keyValuePairs?:IRestrictedTermAttributes): IRestrictedTermModel {
//   return new RestrictedTermModelRecord(keyValuePairs) as IRestrictedTermModel;
// }
