import { Component, ChangeEvent } from "react";
import { autobind } from "core-decorators";
import { Button } from "../Button";
import { css } from "../../utilx";
import { SETTINGS_STYLES } from "../../scenes/Settings/settingsStyles";
import { INewArticleRestrictedTerm, IRestrictedTermAttributes, RestrictedTermLevels } from "../../../models";

const STYLES = {
  label: {
    marginRight: "10px",
  },
};

export interface IArticleAddRestrictedTermProps {
  addTerm: (termToAdd: INewArticleRestrictedTerm) => void;
  articleId: string;
  globalRestrictedTerms: IRestrictedTermAttributes[];
  toggleDisplayAddTerm: () => void;
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
    newTermScore: RestrictedTermLevels.approve,
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
    this.props.addTerm({
      id: "-1",
      term: this.state.newTerm,
      score: parseFloat(this.state.newTermScore),
      articleId: this.props.articleId,
    });
    this.props.toggleDisplayAddTerm();
  }

  @autobind
  handleCloseMenu() {
    this.props.toggleDisplayAddTerm();
  }

  render() {
    console.table(this.props.globalRestrictedTerms);
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
      </div>
    );
  }
}

export default ArticleAddRestrictedTerm;
