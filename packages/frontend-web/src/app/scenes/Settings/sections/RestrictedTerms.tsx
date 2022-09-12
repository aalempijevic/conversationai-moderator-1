import { Component } from "react";

import AddRestrictedTerm, { RestrictedTermLevels } from "./AddRestrictedTerm";

import { globalRestrictedTerms } from "../../../platform/restrictedTermsService";

import { css } from "../../../utilx";
import { SETTINGS_STYLES } from "../settingsStyles";
import { autobind } from "core-decorators";

export interface ISectionProps {
  styles: any;
  settingsState: any;
  setSettingsState: any;
}

export interface IRestrictedTermsState {
  // terms: Array<IRestrictedTermAttributes |>
  terms: any;
}

// const TEMP_TERMS = ["dog", "basketball", "soccer", "carrot", "lamp", "tree", "continent"];

export class RestrictedTerms extends Component<ISectionProps, IRestrictedTermsState> {
  state = {
    terms: [],
  };

  @autobind
  async getTerms() {
    // get rid of Try/Catch when done with dev
    try {
      const terms = await globalRestrictedTerms.get();
      console.log("terms recieved", terms);
      this.setState({ terms: terms });
    } catch (err) {
      console.log("error getting terms", err);
    }
  }

  @autobind
  async deleteTerm(termId: string) {
    try {
      const response = await globalRestrictedTerms.delete(termId);
      console.log("delete response", response);
    } catch (err) {
      console.log("error occurred deleting a term", err);
    }
  }

  componentDidMount() {
    this.getTerms();
  }

  render() {
    const { styles } = this.props;

    return (
      <div key="restrictedTermsSection">
        <div key="heading" {...css(styles.heading)}>
          <h2 {...css(styles.headingText)}>Restricted Terms</h2>
        </div>
        <div key="body" {...css(styles.section)}>
          {/* Temporary wording. May need updating */}
          <p>These terms are restricted and will cause a comment to be flagged.</p>
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
                {this.state.terms.map(({ id, term, score }) => (
                  <tr key={`banned-term-${term}`} {...css(SETTINGS_STYLES.userTableCell)}>
                    <td {...css(SETTINGS_STYLES.userTableCell)}>{term}</td>
                    <td {...css(SETTINGS_STYLES.userTableCell)}>
                      <select
                        name="new-restricted-term-score"
                        // onChange={this.handleNewTermScoreChange}
                        value={score}
                      >
                        <option value={RestrictedTermLevels.warn}>Warn</option>
                        <option value={RestrictedTermLevels.defer}>Defer</option>
                        <option value={RestrictedTermLevels.reject}>Reject</option>
                      </select>
                    </td>
                    <td {...css(SETTINGS_STYLES.userTableCell)}>
                      <button onClick={() => this.deleteTerm(id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AddRestrictedTerm />
        </div>
      </div>
    );
  }
}

export default RestrictedTerms;
