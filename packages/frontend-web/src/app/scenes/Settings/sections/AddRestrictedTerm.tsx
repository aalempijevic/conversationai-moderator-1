import { Component, ChangeEvent } from "react";
import { autobind } from "core-decorators";
import { css } from "../../../utilx";
import { STYLES } from "../../Settings/components/RuleRow/RuleRow";
import { SETTINGS_STYLES } from "../settingsStyles";

import { globalRestrictedTerms } from "../../../platform/restrictedTermsService";

export enum RestrictedTermLevels {
  warn = "0.1",
  defer = "0.5",
  reject = "0.9",
}

export interface IAddRestrictedTermProps {
  getTerms: () => Promise<void>;
}

export interface IRestrictedTermsState {
  newTerm: string;
  newTermScore: string;
}

export class AddRestrictedTerm extends Component<IAddRestrictedTermProps, IRestrictedTermsState> {
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
    try {
      await globalRestrictedTerms.add({
        term: this.state.newTerm,
        score: parseFloat(this.state.newTermScore),
      });
    } catch (error) {
      console.log("error occurred trying to add a new term", error);
    }
    await this.props.getTerms();
    console.log("After handle new term has an error");
  }

  render() {
    return (
      <div>
        <label htmlFor="new-restricted-term">New Restricted Term</label>
        <input
          {...css(SETTINGS_STYLES.input)}
          type="text"
          id="new-restricted-term"
          value={this.state.newTerm}
          onChange={this.handleNewTermChange}
        />
        <label htmlFor="new-restricted-term-score">Select Score: </label>
        <select
          {...css({ ...SETTINGS_STYLES.selectBox, width: "90px" })}
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
