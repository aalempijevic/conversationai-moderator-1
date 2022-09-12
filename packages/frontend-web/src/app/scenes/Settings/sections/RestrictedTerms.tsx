import { Component } from "react";

import AddRestrictedTerm from "./AddRestrictedTerm";

import { globalRestrictedTerms } from "../../../platform/restrictedTermsService";
// import { IRestrictedTermModel } from "../../../../models";

import { css } from "../../../utilx";
import { SETTINGS_STYLES } from "../settingsStyles";

export interface ISectionProps {
  styles: any;
  settingsState: any;
  setSettingsState: any;
}

export interface IRestrictedTermsState {}

const TEMP_TERMS = ["dog", "basketball", "soccer", "carrot", "lamp", "tree", "continent"];

async function getTerms() {
  // get rid of Try/Catch when done with dev
  try {
    const terms = await globalRestrictedTerms.get();
    console.log("terms recieved", terms);
  } catch (err) {
    console.log("error getting terms", err);
  }
}

export class RestrictedTerms extends Component<ISectionProps, IRestrictedTermsState> {
  state = {};

  componentDidMount() {
    getTerms();
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
                {TEMP_TERMS.map((term) => (
                  <tr key={`banned-term-${term}`} {...css(SETTINGS_STYLES.userTableCell)}>
                    <td {...css(SETTINGS_STYLES.userTableCell)}>{term}</td>
                    <td {...css(SETTINGS_STYLES.userTableCell)}>
                      <input type="radio" id={`${term}-reject`} name={`term-${term}-level`} value="reject" />
                      <label htmlFor={`${term}-reject`}>Reject</label>
                      <input type="radio" id={`${term}-defer`} name={`term-${term}-level`} value="defer" />
                      <label htmlFor={`${term}-reject`}>Defer</label>
                      <input type="radio" id={`${term}-warn`} name={`term-${term}-level`} value="warn" />
                      <label htmlFor={`${term}-reject`}>Warn</label>
                    </td>
                    <td {...css(SETTINGS_STYLES.userTableCell)}>
                      <input type="button" value="delete" />
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
