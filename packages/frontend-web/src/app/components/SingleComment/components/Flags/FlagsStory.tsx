import { FlagModelRecord, IFlagModel } from '../../../../../models';
import { Flags } from '../Flags';

import { List } from 'immutable';

import { storiesOf } from '@kadira/storybook';

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
