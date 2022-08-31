import { css } from "../../../utilx";
import { SETTINGS_STYLES } from "../settingsStyles";

export interface ISection {
  styles?: any;
  settingsState: any;
  setSettingsState: any;
}

const TEMP_KEYWORDS = [
  "dog",
  "basketball",
  "soccer",
  "carrot",
  "lamp",
  "tree",
  "continent",
];

export default function ({ styles }: ISection) {
  return (
    <div key="bannedKeywordsSection">
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
                <th
                  key="keywordWordColumn"
                  {...css(SETTINGS_STYLES.userTableCell)}
                >
                  Keyword
                </th>
                <th
                  key="keywordActionColumn"
                  {...css(SETTINGS_STYLES.userTableCell)}
                >
                  Level
                </th>
                <th
                  key="keywordDeleteColumn"
                  {...css(SETTINGS_STYLES.userTableCell)}
                >
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {TEMP_KEYWORDS.map((keyword) => (
                <tr
                  key={`banned-keyword-${keyword}`}
                  {...css(SETTINGS_STYLES.userTableCell)}
                >
                  <td {...css(SETTINGS_STYLES.userTableCell)}>{keyword}</td>
                  <td {...css(SETTINGS_STYLES.userTableCell)}>
                    <input
                      type="radio"
                      id={`${keyword}-reject`}
                      name={`keyword-${keyword}-level`}
                      value="reject"
                    />
                    <label htmlFor={`${keyword}-reject`}>Reject</label>
                    <input
                      type="radio"
                      id={`${keyword}-defer`}
                      name={`keyword-${keyword}-level`}
                      value="defer"
                    />
                    <label htmlFor={`${keyword}-reject`}>Defer</label>
                    <input
                      type="radio"
                      id={`${keyword}-warn`}
                      name={`keyword-${keyword}-level`}
                      value="warn"
                    />
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
          <div>
            <label htmlFor="new-keyword">New Keyword</label>
            <input type="text" id="new-keyword" />
            <input type="button" value="add" />
          </div>
      </div>
    </div>
  );
}
