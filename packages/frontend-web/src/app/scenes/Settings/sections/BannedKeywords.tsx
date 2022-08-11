import { css } from "../../../utilx";
import { SETTINGS_STYLES } from "../settingsStyles";

export interface ISection {
  styles?: any;
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
                <th key="keywordWordColumn" {...css(SETTINGS_STYLES.userTableCell)}>
                  Keyword
                </th>
                <th key="keywordActionColumn" {...css(SETTINGS_STYLES.userTableCell)}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              
        {TEMP_KEYWORDS.map((keyword)=> (
        <tr key={`banned-keyword-${keyword}`} {...css(SETTINGS_STYLES.userTableCell)}>
          <td {...css(SETTINGS_STYLES.userTableCell)}>
            {keyword}
          </td>
          <td {...css(SETTINGS_STYLES.userTableCell)}>
            Put severity selector here.
          </td>
        </tr>))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
