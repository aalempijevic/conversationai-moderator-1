import { Component, ChangeEvent } from "react";
import { autobind } from "core-decorators";
import { Button } from "../Button";
import { css } from "../../utilx";
import { SETTINGS_STYLES } from "../../scenes/Settings/settingsStyles";
import { RestrictedTermLevels } from "../../scenes/Settings/sections/AddRestrictedTerm";
import { INewRestrictedTerm } from "../../../models";

const STYLES = {
  label: {
    marginRight: "10px",
  },
};

export interface IArticleAddRestrictedTermProps {
  toggleDisplayAddTerm: () => void;
  addTerm: (termToAdd: INewRestrictedTerm) => void;
}

export interface IArticleAddRestrictedTermState {
  newTermScore: string;
  newTerm: string;
}

export class ArticleAddRestrictedTerm extends Component<
  IArticleAddRestrictedTermProps,
  IArticleAddRestrictedTermState
> {
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
    this.props.addTerm({ term: this.state.newTerm, score: parseFloat(this.state.newTermScore) });
  }

  @autobind
  handleCloseMenu() {
    this.props.toggleDisplayAddTerm();
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
          <option value={RestrictedTermLevels.warn}>Warn</option>
          <option value={RestrictedTermLevels.defer}>Defer</option>
          <option value={RestrictedTermLevels.reject}>Reject</option>
        </select>
        <Button key="add" label="Add" buttonStyles={SETTINGS_STYLES.save} onClick={this.handleAddNewTerm} />
        <Button
          key="cancel"
          label="Cancel"
          buttonStyles={SETTINGS_STYLES.cancel}
          onClick={this.props.toggleDisplayAddTerm}
        />
      </div>
    );
  }
}

export default ArticleAddRestrictedTerm;
