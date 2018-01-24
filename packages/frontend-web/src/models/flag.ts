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
