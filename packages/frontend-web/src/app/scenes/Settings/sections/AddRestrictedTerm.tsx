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
  handleNewTermLevelChange(e: ChangeEvent<HTMLInputElement>) {
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

        <div onChange={this.handleNewTermLevelChange}>
          <input
            type="radio"
            id="new-restricted-term-warn"
            name="new-restricted-term-level"
            value="warn"
            checked={this.state.newTermLevel === "warn"}
          />
          <label htmlFor="new-restricted-term-warn">Warn</label>

          <input
            type="radio"
            id="new-restricted-term-defer"
            name="new-restricted-term-level"
            value="defer"
            checked={this.state.newTermLevel === "defer"}
          />
          <label htmlFor="new-restricted-term-defer">Defer</label>
          <input
            type="radio"
            id="new-restricted-term-reject"
            name="new-restricted-term-level"
            value="reject"
            checked={this.state.newTermLevel === "reject"}
          />
          <label htmlFor="new-restricted-term-reject">Reject</label>
        </div>
        <button onClick={this.handleAddNewTerm}>add</button>
      </div>
    );
  }
}

export default AddRestrictedTerm;
