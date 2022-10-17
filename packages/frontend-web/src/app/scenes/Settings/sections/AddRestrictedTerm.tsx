import { Component, ChangeEvent } from "react";
import { autobind } from "core-decorators";
import { Button } from "../../../components";
import { css } from "../../../utilx";
import { SETTINGS_STYLES } from "../settingsStyles";

import { globalRestrictedTerms } from "../../../platform/restrictedTermsService";
import { RestrictedTermLevels } from "../../../../models";

export interface IAddRestrictedTermProps {
  getTerms: () => Promise<void>;
  toggleDisplayAddTerm: () => void;
}

export interface IRestrictedTermsState {
  newTerm: string;
  newTermScore: string;
  errorMessage: string;
}

const STYLES = {
  label: {
    marginRight: "10px",
  },
};

export class AddRestrictedTerm extends Component<IAddRestrictedTermProps, IRestrictedTermsState> {
  state = {
    newTermScore: RestrictedTermLevels.warn,
    newTerm: "",
    errorMessage: "",
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
      this.props.toggleDisplayAddTerm();
      this.setState({ errorMessage: "" });
    } catch (error) {
      console.error("error occurred trying to add a new term", error.response);
      this.setState({ errorMessage: error.response.data });
    }
    await this.props.getTerms();
  }

  @autobind
  handleCloseMenu() {
    this.props.toggleDisplayAddTerm();
    this.setState({ errorMessage: "" });
  }

  render() {
    return (
      <div>
        <label htmlFor="new-restricted-term" {...css(STYLES.label)}>
          New Restricted Term
        </label>
        <input
          {...css(SETTINGS_STYLES.input)}
          type="text"
          id="new-restricted-term"
          value={this.state.newTerm}
          onChange={this.handleNewTermChange}
        />
        <label htmlFor="new-restricted-term-score" {...css(STYLES.label)}>
          Score
        </label>
        <select
          {...css({ ...SETTINGS_STYLES.selectBox, width: "90px" })}
          name="new-restricted-term-score"
          onChange={this.handleNewTermScoreChange}
          value={this.state.newTermScore}
        >
          <option value={RestrictedTermLevels.approve}>Approve</option>
          <option value={RestrictedTermLevels.highlight}>Hightlight</option>
          <option value={RestrictedTermLevels.reject}>Reject</option>
        </select>
        <Button key="add" label="Add" buttonStyles={SETTINGS_STYLES.save} onClick={this.handleAddNewTerm} />
        <Button
          key="cancel"
          label="Cancel"
          buttonStyles={SETTINGS_STYLES.cancel}
          onClick={this.props.toggleDisplayAddTerm}
        />
        <div>{this.state.errorMessage}</div>
      </div>
    );
  }
}

export default AddRestrictedTerm;
