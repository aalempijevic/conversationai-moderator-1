import { Component, ChangeEvent } from "react";
import { autobind } from "core-decorators";

import { globalRestrictedTerms } from "../../../platform/restrictedTermsService";

export interface IRestrictedTermsState {
  newTerm: string;
  newTermLevel: string;
}

export class AddRestrictedTerm extends Component<{}, IRestrictedTermsState> {
  state = {
    newTermLevel: "warn",
    newTerm: "",
  };

  @autobind
  handleNewTermLevelChange(e: ChangeEvent<HTMLSelectElement>) {
    console.log(e.target.value);
    this.setState({ newTermLevel: e.target.value });
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
      level: this.state.newTermLevel,
    });
    const response = await globalRestrictedTerms.get();
    console.log(response);
  }

  render() {
    return (
      <div>
        <label htmlFor="new-restricted-term">New Restricted Term</label>
        <input type="text" id="new-restricted-term" value={this.state.newTerm} onChange={this.handleNewTermChange} />
        <label htmlFor="new-restricted-term-level">Select Level:</label>
        <select
          name="new-restricted-term-level"
          onChange={this.handleNewTermLevelChange}
          value={this.state.newTermLevel}
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
