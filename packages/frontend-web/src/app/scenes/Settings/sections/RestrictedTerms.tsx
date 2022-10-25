import { ChangeEvent, Component } from "react";

import AddRestrictedTerm from "./AddRestrictedTerm";
import { AddButton } from "../components/AddButton";

import { globalRestrictedTerms } from "../../../platform/restrictedTermsService";
import { IRestrictedTermAttributes, RestrictedTermLevels } from "../../../../models";

import { css } from "../../../utilx";
import { SETTINGS_STYLES } from "../settingsStyles";
import { autobind } from "core-decorators";

export interface ISectionProps {
  styles: any;
  settingsState: any;
  setSettingsState: any;
}

export interface IRestrictedTermsState {
  terms: IRestrictedTermAttributes[];
  displayAddTerm: boolean;
  disableMenu: boolean;
}

export class RestrictedTerms extends Component<ISectionProps, IRestrictedTermsState> {
  state: IRestrictedTermsState = {
    terms: [],
    displayAddTerm: false,
    disableMenu: false,
  };

  @autobind
  toggleDisableMenu() {
    this.setState({ disableMenu: !this.state.disableMenu });
  }

  @autobind
  async getTerms() {
    try {
      const terms = await globalRestrictedTerms.get();
      this.setState({ terms: terms });
    } catch (err) {
      console.error("error getting terms", err);
    }
  }

  @autobind
  async deleteTerm(termId: string) {
    try {
      this.toggleDisableMenu();
      await globalRestrictedTerms.delete(termId);
      await this.getTerms();
    } catch (err) {
      console.error("error occurred deleting a term", err);
    }
    this.toggleDisableMenu();
  }

  @autobind
  async updateTermScore(event: ChangeEvent<HTMLSelectElement>, term: IRestrictedTermAttributes) {
    this.toggleDisableMenu();
    const updatedTerm = {
      ...term,
      score: parseFloat(event.target.value),
    };
    try {
      await globalRestrictedTerms.update(updatedTerm);
      this.getTerms();
    } catch (error) {
      console.error("error occurred updating a term", error);
    }
    this.toggleDisableMenu();
  }

  @autobind
  toggleDisplayAddTerm() {
    this.setState({ displayAddTerm: !this.state.displayAddTerm });
  }

  componentDidMount() {
    this.getTerms();
  }

  render() {
    const { styles } = this.props;

    return (
      <div key="restrictedTermsSection" {...css(this.state.disableMenu && SETTINGS_STYLES.disableMenu)}>
        <div key="heading" {...css(styles.heading)}>
          <h2 {...css(styles.headingText)}>Restricted Terms</h2>
        </div>
        <div key="body" {...css(styles.section)}>
          <p>
            Comments containing these terms will receive Restricted Term tags with scoring corresponding to their
            assigned level.
          </p>
          <div {...css(SETTINGS_STYLES.row)}>
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
                {this.state.terms.map((term) => (
                  <tr {...css(SETTINGS_STYLES.userTableCell)} key={`banned-term-${term.id}`}>
                    <td {...css(SETTINGS_STYLES.userTableCell, SETTINGS_STYLES.label)}>{term.term}</td>
                    <td {...css(SETTINGS_STYLES.userTableCell)}>
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
                    <td {...css(SETTINGS_STYLES.userTableCell)}>
                      <button {...css(SETTINGS_STYLES.deleteButton)} onClick={() => this.deleteTerm(term.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {this.state.displayAddTerm ? (
            <AddRestrictedTerm getTerms={this.getTerms} toggleDisplayAddTerm={this.toggleDisplayAddTerm} />
          ) : (
            <AddButton width={44} label="add new term" onClick={() => this.toggleDisplayAddTerm()} />
          )}
        </div>
      </div>
    );
  }
}

export default RestrictedTerms;
