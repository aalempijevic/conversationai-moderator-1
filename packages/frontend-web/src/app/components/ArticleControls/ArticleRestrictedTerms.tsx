import { ChangeEvent, Component } from "react";
import { autobind } from "core-decorators";

import { IRestrictedTermAttributes } from "../../../models";
import { css } from "../../utilx";
import { SETTINGS_STYLES } from "../../scenes/Settings/settingsStyles";
import { RestrictedTermLevels } from "../../scenes/Settings/sections/AddRestrictedTerm";
import { IArticleControlIconState } from "./ArticleControls";

export interface IArticleRestrictedTermsProps {
  controlState: IArticleControlIconState;
  restrictedTerms: IRestrictedTermAttributes[];
  setControlState: any;
  style: any;
}

export class ArticleRestrictedTerms extends Component<IArticleRestrictedTermsProps, {}> {
  @autobind
  updateTermHelper(term: IRestrictedTermAttributes) {
    const copiedTerms = [...this.props.restrictedTerms];
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

  render() {
    const { controlState, style } = this.props;
    return (
      <div {...css(style.restrictedTermsSection)}>
        <h2 {...css(style.settingsHeader)}>Restricted Terms</h2>
        <table>
          <thead>
            <tr>
              <th key="termWordColumn" {...css(SETTINGS_STYLES.userTableCell)}>
                Term
              </th>
              <th key="termLevelColumn" {...css(SETTINGS_STYLES.userTableCell)}>
                Level
              </th>
              <th key="termDeleteColumn" {...css(SETTINGS_STYLES.userTableCell)}>
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {controlState.restrictedTerms.map((term) => (
              <tr {...css(SETTINGS_STYLES.userTableCell)} key={`banned-term-${term.id}`}>
                <td {...css(SETTINGS_STYLES.userTableCell, SETTINGS_STYLES.label)}>{term.term}</td>
                <td {...css(SETTINGS_STYLES.userTableCell)}>
                  <select
                    {...css({ ...SETTINGS_STYLES.selectBox, width: "90px" })}
                    name="new-restricted-term-score"
                    onChange={(event) => this.updateTermScore(event, term)}
                    value={term.score}
                  >
                    <option value={RestrictedTermLevels.warn}>Warn</option>
                    <option value={RestrictedTermLevels.defer}>Defer</option>
                    <option value={RestrictedTermLevels.reject}>Reject</option>
                  </select>
                </td>
                <td {...css(SETTINGS_STYLES.userTableCell)}>
                  <button {...css(SETTINGS_STYLES.deleteButton)} onClick={() => this.deleteTerm(term)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
