import { List } from 'immutable';
import React from 'react';
import { IFlagModel } from '../../../../../models';

export interface IFlagsProps {
  flags: List<IFlagModel>;
}

export interface IFlagsState {}

interface IAllFlags {
    [key: string]: number;
}

export class Flags extends React.PureComponent<IFlagsProps, IFlagsState> {

  // Comparator function for doing a primary sort by descending flag count and a
  // secondary sort by ascending flag label.
  static flagComparator([aLabel, aCount]: [string, number], [bLabel, bCount]: [string, number]) {
    if (aCount != bCount) {
      return bCount - aCount ;
    }
    if (aLabel < bLabel) {
      return -1;
    }
    if (bLabel > aLabel) {
      return 1;
    }
    return 0;
  }

  formatFlags(flags: List<IFlagModel>) {
    // Build a frequency map of the flag labels.
    let allFlags: IAllFlags = {};
    flags.forEach(flag => {
      flag.get('labels').forEach((label: string) => {
        if (label in allFlags) {
          allFlags[label] += 1;
        } else {
          allFlags[label] = 1;
        }
      })
    });

    let flagData: [string, number][] = [];
    Object.keys(allFlags).forEach(function (label) {
      const count = allFlags[label];
      flagData.push([label, count]);
    })
    flagData.sort(Flags.flagComparator)

    let output = ''
    flagData.map(function ([label, count], i) {
      output += `${label} (${count})` + (i < flagData.length-1 ? ', ' : '');
    })
    return output;
  }

  render() {
    return (
      <div>Flag labels: {this.formatFlags(this.props.flags)}</div>
    );
  }
}
