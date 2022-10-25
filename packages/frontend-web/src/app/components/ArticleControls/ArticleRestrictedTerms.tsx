import { ChangeEvent, Component } from "react";
import { autobind } from "core-decorators";

import { Chip } from "@material-ui/core";

import { AddButton } from "../../scenes/Settings/components/AddButton";
import { ArticleAddRestrictedTerm } from "./ArticleAddRestrictedTerm";

import { INewArticleRestrictedTerm, IRestrictedTermAttributes, RestrictedTermLevels } from "../../../models";
import { css } from "../../utilx";
import { SETTINGS_STYLES } from "../../scenes/Settings/settingsStyles";
import { IArticleControlIconState } from "./ArticleControls";

export interface IArticleRestrictedTermsProps {
  articleId: string;
  controlState: IArticleControlIconState;
  globalRestrictedTerms: Array<string>;
  restrictedTerms: IRestrictedTermAttributes[];
  setControlState: any;
  style: any;
}

export interface IArticleRestrictedTermsState {
  showAddTermControls: boolean;
}

export class ArticleRestrictedTerms extends Component<IArticleRestrictedTermsProps, IArticleRestrictedTermsState> {
  state = {
    showAddTermControls: false,
  };

  @autobind
  updateTermHelper(term: IRestrictedTermAttributes) {
    const copiedTerms = [...this.props.controlState.restrictedTerms];
    const termIndex = copiedTerms.findIndex((copiedTerm) => copiedTerm.id === term.id);

    return { copiedTerms, termIndex };
  }

  @autobind
  updateTermScore(event: ChangeEvent<HTMLSelectElement>, termToUpdate: IRestrictedTermAttributes) {
    const { copiedTerms, termIndex } = this.updateTermHelper(termToUpdate);
    copiedTerms[termIndex] = { ...termToUpdate, score: parseFloat(event.target.value) };
    this.props.setControlState({ restrictedTerms: copiedTerms });
  }

  @autobind
  deleteTerm(termToDelete: IRestrictedTermAttributes) {
    const { copiedTerms, termIndex } = this.updateTermHelper(termToDelete);
    copiedTerms.splice(termIndex, 1);
    this.props.setControlState({ restrictedTerms: copiedTerms });
  }

  @autobind
  addTerm(termToAdd: INewArticleRestrictedTerm) {
    this.props.setControlState({ restrictedTerms: [...this.props.controlState.restrictedTerms, termToAdd] });
  }

  @autobind
  toggleDisplayAddTerm() {
    this.setState({ showAddTermControls: !this.state.showAddTermControls });
  }

  @autobind
  isGlobalTerm(term: string): boolean {
    const isGlobalTerm = 0 <= this.props.globalRestrictedTerms.findIndex((globalTerm) => globalTerm === term);
    return isGlobalTerm;
  }

  render() {
    const { controlState, style } = this.props;

    return (
      <div {...css(style.overrideSection)}>
        <h2 {...css(style.settingsHeader)}>Restricted Terms</h2>
        <table>
          <tbody>
            {controlState.restrictedTerms.map((term) => (
              <tr key={`banned-term-${term.id}`}>
                <td {...css(style.cell)}>{term.term}</td>
                <td {...css(style.cell)}>
                  {this.isGlobalTerm(term.term) && <Chip color="secondary" label="Global" />}
                </td>
                <td {...css(style.cell)}>
                  <select
                    {...css({ ...SETTINGS_STYLES.selectBox, width: "90px" })}
                    name="new-restricted-term-score"
                    onChange={(event) => this.updateTermScore(event, term)}
                    value={term.score}
                  >
                    <option value={RestrictedTermLevels.allow}>Allow</option>
                    <option value={RestrictedTermLevels.highlight}>Highlight</option>
                    <option value={RestrictedTermLevels.reject}>Reject</option>
                  </select>
                </td>
                <td>
                  <button {...css(SETTINGS_STYLES.deleteButton)} onClick={() => this.deleteTerm(term)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {this.state.showAddTermControls ? (
          <ArticleAddRestrictedTerm
            addTerm={this.addTerm}
            articleId={this.props.articleId}
            globalRestrictedTerms={this.props.globalRestrictedTerms}
            isGlobalTerm={this.isGlobalTerm}
            toggleDisplayAddTerm={this.toggleDisplayAddTerm}
          />
        ) : (
          <AddButton width={44} label="add new term" onClick={() => this.toggleDisplayAddTerm()} />
        )}
      </div>
    );
  }
}
