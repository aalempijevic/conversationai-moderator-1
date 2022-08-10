import { css } from "../../../utilx";

export interface ISection {
  styles?: any;
}

export default function ({ styles }: ISection) {
  return (
    <div key="bannedKeywordsSection">
      <div key="heading" {...css(styles.heading)}>
        <h2 {...css(styles.headingText)}>BannedKeywords</h2>
      </div>
      <div key="body" {...css(styles.section)}>
        {/* Temporary wording. May need updating */}
        <p>These keywords are banned and will cause a comment to be flagged.</p>
      </div>
    </div>
  );
}
