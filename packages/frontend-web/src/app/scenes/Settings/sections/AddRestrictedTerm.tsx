import { Component, ChangeEvent } from "react";
import { autobind } from "core-decorators";

import { globalRestrictedTerms } from "../../../platform/restrictedTermsService";

export interface IRestrictedTermsState {
  newTerm: string;
  newTermScore: string;
}

export class AddRestrictedTerm extends Component<{}, IRestrictedTermsState> {
  state = {
    newTermScore: "warn",
    newTerm: "",
  };

  @autobind
  handleNewTermScoreChange(e: ChangeEvent<HTMLSelectElement>) {
    console.log(e.target.value);
    this.setState({ newTermScore: e.target.value });
  }

  @autobind
  handleNewTermChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState({ newTerm: e.target.value });
  }

  @autobind
  async handleAddNewTerm() {
    console.log("add occurred");
    await globalRestrictedTerms.add({
      term: this.state.newTerm,
      level: this.state.newTermScore,
    });
    const response = await globalRestrictedTerms.get();
    console.log(response);
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
          <option value="warn">Warn</option>
          <option value="defer">Defer</option>
          <option value="reject">Reject</option>
        </select>
        <button onClick={this.handleAddNewTerm}>add</button>
      </div>
    );
  }
}

export default AddRestrictedTerm;
