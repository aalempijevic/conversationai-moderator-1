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

const TEMP_KEYWORDS = ["dog", "basketball", "soccer", "carrot", "lamp", "tree", "continent"];

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
          <h2 {...css(styles.headingText)}>Banned Keywords</h2>
        </div>
        <div key="body" {...css(styles.section)}>
          {/* Temporary wording. May need updating */}
          <p>These keywords are banned and will cause a comment to be flagged.</p>
          <div {...css(SETTINGS_STYLES.row)}>
            <table>
              <thead>
                <tr>
                  <th key="keywordWordColumn" {...css(SETTINGS_STYLES.userTableCell)}>
                    Keyword
                  </th>
                  <th key="keywordActionColumn" {...css(SETTINGS_STYLES.userTableCell)}>
                    Level
                  </th>
                  <th key="keywordDeleteColumn" {...css(SETTINGS_STYLES.userTableCell)}>
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody>
                {TEMP_KEYWORDS.map((keyword) => (
                  <tr key={`banned-keyword-${keyword}`} {...css(SETTINGS_STYLES.userTableCell)}>
                    <td {...css(SETTINGS_STYLES.userTableCell)}>{keyword}</td>
                    <td {...css(SETTINGS_STYLES.userTableCell)}>
                      <input type="radio" id={`${keyword}-reject`} name={`keyword-${keyword}-level`} value="reject" />
                      <label htmlFor={`${keyword}-reject`}>Reject</label>
                      <input type="radio" id={`${keyword}-defer`} name={`keyword-${keyword}-level`} value="defer" />
                      <label htmlFor={`${keyword}-reject`}>Defer</label>
                      <input type="radio" id={`${keyword}-warn`} name={`keyword-${keyword}-level`} value="warn" />
                      <label htmlFor={`${keyword}-reject`}>Warn</label>
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
