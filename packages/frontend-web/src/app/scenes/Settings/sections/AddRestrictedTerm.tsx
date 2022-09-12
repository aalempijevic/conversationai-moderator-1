import { Component, ChangeEvent } from "react";
import { autobind } from "core-decorators";

import { globalRestrictedTerms } from "../../../platform/restrictedTermsService";

export enum RestrictedTermLevels {
  warn = "0.1",
  defer = "0.5",
  reject = "0.9",
}

export interface IRestrictedTermsState {
  newTerm: string;
  newTermScore: string;
}

export class AddRestrictedTerm extends Component<{}, IRestrictedTermsState> {
  state = {
    newTermScore: RestrictedTermLevels.warn,
    newTerm: "",
  };

  @autobind
  handleNewTermScoreChange(e: ChangeEvent<HTMLSelectElement>) {
    this.setState({ newTermScore: e.target.value });
  }

  @autobind
  handleNewTermChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState({ newTerm: e.target.value });
  }

  @autobind
  async handleAddNewTerm() {
    await globalRestrictedTerms.add({
      term: this.state.newTerm,
      score: parseFloat(this.state.newTermScore),
    });
  }

  render() {
    return (
      <div>
        <label htmlFor="new-restricted-term">New Restricted Term</label>
        <input type="text" id="new-restricted-term" value={this.state.newTerm} onChange={this.handleNewTermChange} />
        <label htmlFor="new-restricted-term-score">Select Score: </label>
        <select
          name="new-restricted-term-score"
          onChange={this.handleNewTermScoreChange}
          value={this.state.newTermScore}
        >
          <option value={RestrictedTermLevels.warn}>Warn</option>
          <option value={RestrictedTermLevels.defer}>Defer</option>
          <option value={RestrictedTermLevels.reject}>Reject</option>
        </select>
        <button onClick={this.handleAddNewTerm}>add</button>
        <div>Add Error Messages</div>
      </div>
    );
  }
}

export default AddRestrictedTerm;
