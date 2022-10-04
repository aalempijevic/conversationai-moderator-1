import { autobind } from "core-decorators";
import React from "react";
import { List } from "immutable";

import { ClickAwayListener, DialogTitle, Switch } from "@material-ui/core";

import { IArticleControlIconState } from "./ArticleControls";
import { ControlFlag } from "../ControlFlag";
import { ArticleRestrictedTerms } from "./ArticleRestrictedTerms";

import {
  IArticleAttributes,
  IArticleModel,
  IRuleModel,
  IServerAction,
  ITagModel,
  RuleModel,
  SERVER_ACTION_ACCEPT,
} from "../../../models";
import { GUTTER_DEFAULT_SPACING, NICE_CONTROL_BLUE, SCRIM_STYLE } from "../../styles";
import { css } from "../../utilx";
import { ArticleRuleRow } from "../../scenes/Settings/components/ArticleRuleRow";
import { partial } from "../../util";
import { AddButton } from "../../scenes/Settings/components/AddButton";

let placeholderId = -1;

interface IArticleControlMenuProps {
  isAdmin?: boolean;
  article: IArticleModel;
  tags: List<ITagModel>;
  controlState: IArticleControlIconState;
  setControlState: any;

  clearPopups(): void;
  saveControls(
    isCommentingEnabled: boolean,
    isAutoModerated: boolean,
    isModerationRuleOveridden: boolean,
    moderationRules: Array<IRuleModel>,
    isRestrictedTermsOverridden: boolean,
    restrictedTerms: Array<IArticleAttributes>
  ): void;
}

const STYLE = {
  settingsHeader: {
    fontFamily: "LibreFranklin-Medium, sans-serif",
    fontSize: "14px",
  },
};

export class ArticleControlMenu extends React.Component<IArticleControlMenuProps> {
  @autobind
  handleCommentingEnabledClicked() {
    this.props.setControlState({
      isCommentingEnabled: !this.props.controlState.isCommentingEnabled,
    });
  }

  @autobind
  handleAutoModeratedClicked() {
    if (!this.props.controlState.isCommentingEnabled) {
      return;
    }
    this.props.setControlState({
      isAutoModerated: !this.props.controlState.isAutoModerated,
    });
  }

  @autobind
  handleModerationRulesOverride() {
    if (
      !this.props.controlState.isCommentingEnabled ||
      !this.props.controlState.isAutoModerated ||
      !this.props.isAdmin
    ) {
      return;
    }
    this.props.setControlState({
      isModerationOverridden: !this.props.controlState.isModerationOverridden,
    });
  }

  @autobind
  handleRestrictedTermsOverride() {
    if (
      !this.props.controlState.isCommentingEnabled ||
      !this.props.controlState.isAutoModerated ||
      !this.props.isAdmin
    ) {
      return;
    }
    this.props.setControlState({
      isRestrictedTermsOverriden: !this.props.controlState.isRestrictedTermsOverridden,
    });
  }

  @autobind
  handleAutomatedRuleChange(attribute: string, rule: IRuleModel, value: number | string) {
    let updatedRules = [...this.props.controlState.moderationRules];
    let idx = updatedRules.findIndex((r) => r.equals(rule));
    updatedRules[idx] = updatedRules[idx].set(attribute, value);
    this.props.setControlState({
      moderationRules: updatedRules,
    });
  }

  @autobind
  handleModerateButtonClick(rule: IRuleModel, action: IServerAction) {
    let updatedRules = [...this.props.controlState.moderationRules];
    let idx = updatedRules.findIndex((r) => r.equals(rule));
    updatedRules[idx] = updatedRules[idx].set("action", action);
    this.props.setControlState({
      moderationRules: updatedRules,
    });
  }

  @autobind
  handleAutomatedRuleDelete(rule: IRuleModel) {
    let updatedRules = [...this.props.controlState.moderationRules];
    let idx = updatedRules.findIndex((r) => r.equals(rule));
    updatedRules.splice(idx, 1);
    this.props.setControlState({
      moderationRules: updatedRules,
    });
  }

  @autobind
  handleAddAutomatedRule(event: React.FormEvent<any>) {
    if (!this.isModerationRuleEditingEnabled()) {
      return;
    }
    event.preventDefault();
    const newValue = RuleModel({
      id: (placeholderId--).toString(),
      createdBy: null,
      articleId: this.props.article.id,
      // Find the id for summary score tag to use as default or otherwise fallback to current prod ID value
      tagId: `${
        this.props.tags.find((tag) => {
          return tag.label === "Summary Score";
        }).id || 16
      }`,
      lowerThreshold: 0,
      upperThreshold: 0.2,
      action: SERVER_ACTION_ACCEPT,
    });
    const updatedRules = this.props.controlState.moderationRules || [];
    updatedRules.push(newValue);
    this.props.setControlState({ moderationRules: updatedRules });
  }

  @autobind
  isModerationRuleEditingEnabled() {
    return this.props.controlState.isCommentingEnabled && this.props.controlState.isAutoModerated && this.props.isAdmin;
  }

  render() {
    const { article, isAdmin, tags, clearPopups, saveControls } = this.props;
    console.log("control state moderation rules", this.props.controlState.moderationRules);
    return (
      <ClickAwayListener onClickAway={clearPopups}>
        <div tabIndex={0} {...css(SCRIM_STYLE.popupMenu, { padding: "20px" })}>
          <DialogTitle id="article-controls">Moderation settings</DialogTitle>
          <table
            key="main"
            {...css({
              width: "compute(100% - 50px)",
              margin: "4px 9px 4px 25px",
            })}
          >
            <tbody>
              <tr key="comments" onClick={this.handleCommentingEnabledClicked}>
                <td key="icon">
                  <ControlFlag isCommentingEnabled={this.props.controlState.isCommentingEnabled} />
                </td>
                <td key="text" {...css({ textAlign: "left", padding: "15px 4px" })}>
                  <label {...css(SCRIM_STYLE.popupContent)}>Comments Enabled</label>
                </td>
                <td key="toggle" {...css({ textAlign: "right" })}>
                  <Switch checked={this.props.controlState.isCommentingEnabled} color="primary" />
                </td>
              </tr>
              <tr
                key="automod"
                onClick={this.handleAutoModeratedClicked}
                {...css(this.props.controlState.isCommentingEnabled ? {} : { opacity: 0.5 })}
              >
                <td key="icon">
                  <ControlFlag
                    isCommentingEnabled={this.props.controlState.isCommentingEnabled}
                    isAutoModerated={this.props.controlState.isAutoModerated}
                  />
                </td>
                <td key="text" {...css({ textAlign: "left", padding: "15px 4px" })}>
                  <label {...css(SCRIM_STYLE.popupContent)}>Auto Moderation Enabled</label>
                </td>
                <td key="toggle" {...css({ textAlign: "right" })}>
                  <Switch
                    checked={this.props.controlState.isAutoModerated}
                    disabled={!this.props.controlState.isCommentingEnabled}
                    color="primary"
                  />
                </td>
              </tr>
              <tr
                key="moderationOverride"
                onClick={this.handleModerationRulesOverride}
                {...css(this.isModerationRuleEditingEnabled() ? {} : { opacity: 0.5 })}
              >
                <td key="icon">
                  <ControlFlag
                    isCommentingEnabled={this.props.controlState.isCommentingEnabled}
                    isModerationOverridden={this.props.controlState.isModerationOverridden}
                    isAutoModerated={this.props.controlState.isAutoModerated}
                  />
                </td>
                <td key="text" {...css({ textAlign: "left", padding: "15px 4px" })}>
                  <label {...css(SCRIM_STYLE.popupContent)}>Rules Override {!isAdmin && "(read only)"}</label>
                </td>
                <td key="toggle" {...css({ textAlign: "right" })}>
                  <Switch
                    checked={this.props.controlState.isModerationOverridden}
                    color="primary"
                    disabled={!this.isModerationRuleEditingEnabled()}
                  />
                </td>
              </tr>
              <tr key="restrictedTerms" onClick={this.handleRestrictedTermsOverride}>
                <td key="icon">
                  <ControlFlag
                    isCommentingEnabled={this.props.controlState.isCommentingEnabled}
                    isModerationOverridden={this.props.controlState.isModerationOverridden}
                    isAutoModerated={this.props.controlState.isAutoModerated}
                    isRestrictedTermsOverridden={this.props.controlState.isRestrictedTermsOverridden}
                  />
                </td>
                <td key="text" {...css({ textAlign: "left", padding: "15px 4px" })}>
                  <label {...css(SCRIM_STYLE.popupContent)}>Restricted Terms {!isAdmin && "(read only)"}</label>
                </td>
                <td key="toggle" {...css({ textAlign: "right" })}>
                  <Switch
                    checked={this.props.controlState.isRestrictedTermsOverridden}
                    color="primary"
                    disabled={!this.isModerationRuleEditingEnabled()}
                  />
                </td>
              </tr>
              {this.props.controlState.isModerationOverridden && (
                <>
                  <tr>
                    <td>
                      <h2 {...css(STYLE.settingsHeader)}>Moderation Rules</h2>
                    </td>
                  </tr>
                  <tr>
                    <td key="editRulesSection">
                      {this.props.controlState.moderationRules.map((rule, i) => (
                        <ArticleRuleRow
                          disabled={!this.isModerationRuleEditingEnabled()}
                          key={i}
                          onDelete={this.handleAutomatedRuleDelete}
                          rule={rule}
                          onTagChange={partial(this.handleAutomatedRuleChange, "tagId", rule)}
                          onLowerThresholdChange={partial(this.handleAutomatedRuleChange, "lowerThreshold", rule)}
                          onUpperThresholdChange={partial(this.handleAutomatedRuleChange, "upperThreshold", rule)}
                          rangeBottom={Math.round(rule.lowerThreshold * 100)}
                          rangeTop={Math.round(rule.upperThreshold * 100)}
                          selectedTag={rule.tagId}
                          selectedAction={rule.action}
                          hasTagging
                          onModerateButtonClick={this.handleModerateButtonClick}
                          tags={tags}
                        />
                      ))}
                      {this.isModerationRuleEditingEnabled() && this.props.controlState.isModerationOverridden && (
                        <AddButton
                          width={44}
                          onClick={this.handleAddAutomatedRule}
                          label="Add an automated rule"
                          buttonStyles={{
                            margin: `${GUTTER_DEFAULT_SPACING}px 0`,
                          }}
                        />
                      )}
                    </td>
                  </tr>
                </>
              )}
              <tr>
                <td>
                  <ArticleRestrictedTerms restrictedTerms={article.restrictedTerms} style={STYLE} />
                </td>
              </tr>
            </tbody>
          </table>
          <div key="footer" {...css({ textAlign: "right", margin: "35px 25px 30px 25px" })}>
            <span onClick={clearPopups} {...css({ marginRight: "30px", opacity: "0.5" })}>
              Cancel
            </span>
            <span
              //@ts-ignore
              onClick={saveControls}
              {...css({ color: NICE_CONTROL_BLUE })}
            >
              Save
            </span>
          </div>
        </div>
      </ClickAwayListener>
    );
  }
}
