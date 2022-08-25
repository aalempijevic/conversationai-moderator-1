import { autobind } from "core-decorators";
import React from "react";

import { ClickAwayListener, DialogTitle, Switch } from "@material-ui/core";

import { ControlFlag, IArticleControlIconState } from "./ArticleControls";

import {
  IArticleModel,
  IRuleModel,
  IServerAction,
  ITagModel,
  RuleModel,
  SERVER_ACTION_ACCEPT,
} from "../../models";
import {
  GUTTER_DEFAULT_SPACING,
  NICE_CONTROL_BLUE,
  SCRIM_STYLE,
} from "../styles";
import { css } from "../utilx";
import { ArticleRuleRow } from "../scenes/Settings/components/ArticleRuleRow";
import { List } from "immutable";
import { partial } from "../util";
import { AddButton } from "../scenes/Settings/components/AddButton";

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
    moderationRules: Array<IRuleModel>
  ): void;
}

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
      isModerationOverriden: !this.props.controlState.isModerationOverriden,
    });
  }

  @autobind
  handleAutomatedRuleChange(
    attribute: string,
    rule: IRuleModel,
    value: number | string
  ) {
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
      tagId: "15",
      lowerThreshold: 0.8,
      upperThreshold: 1,
      action: SERVER_ACTION_ACCEPT,
    });
    const updatedRules = this.props.controlState.moderationRules || [];
    updatedRules.push(newValue);
    this.props.setControlState({ moderationRules: updatedRules });
  }

  @autobind
  isModerationRuleEditingEnabled() {
    return (
      this.props.controlState.isCommentingEnabled &&
      this.props.controlState.isAutoModerated &&
      this.props.isAdmin
    );
  }

  render() {
    const { isAdmin, tags, clearPopups, saveControls } = this.props;

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
                  <ControlFlag
                    isCommentingEnabled={
                      this.props.controlState.isCommentingEnabled
                    }
                  />
                </td>
                <td
                  key="text"
                  {...css({ textAlign: "left", padding: "15px 4px" })}
                >
                  <label {...css(SCRIM_STYLE.popupContent)}>
                    Comments Enabled
                  </label>
                </td>
                <td key="toggle" {...css({ textAlign: "right" })}>
                  <Switch
                    checked={this.props.controlState.isCommentingEnabled}
                    color="primary"
                  />
                </td>
              </tr>
              <tr
                key="automod"
                onClick={this.handleAutoModeratedClicked}
                {...css(
                  this.props.controlState.isCommentingEnabled
                    ? {}
                    : { opacity: 0.5 }
                )}
              >
                <td key="icon">
                  <ControlFlag
                    isCommentingEnabled={
                      this.props.controlState.isCommentingEnabled
                    }
                    isAutoModerated={this.props.controlState.isAutoModerated}
                  />
                </td>
                <td
                  key="text"
                  {...css({ textAlign: "left", padding: "15px 4px" })}
                >
                  <label {...css(SCRIM_STYLE.popupContent)}>
                    Auto Moderation Enabled
                  </label>
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
                {...css(
                  this.isModerationRuleEditingEnabled() ? {} : { opacity: 0.5 }
                )}
              >
                <td key="icon">
                  <ControlFlag
                    isCommentingEnabled={
                      this.props.controlState.isCommentingEnabled
                    }
                    isModerationOverriden={
                      this.props.controlState.isModerationOverriden
                    }
                    isAutoModerated={this.props.controlState.isAutoModerated}
                  />
                </td>
                <td
                  key="text"
                  {...css({ textAlign: "left", padding: "15px 4px" })}
                >
                  <label {...css(SCRIM_STYLE.popupContent)}>
                    Rules Override {!isAdmin && "(read only)"}
                  </label>
                </td>
                <td key="toggle" {...css({ textAlign: "right" })}>
                  <Switch
                    checked={this.props.controlState.isModerationOverriden}
                    color="primary"
                    disabled={!this.isModerationRuleEditingEnabled()}
                  />
                </td>
              </tr>
              <tr>
                <td key="editRulesSection">
                  {this.props.controlState.moderationRules &&
                    this.props.controlState.moderationRules.map((rule, i) => (
                      <ArticleRuleRow
                        disabled={!this.isModerationRuleEditingEnabled()}
                        key={i}
                        onDelete={this.handleAutomatedRuleDelete}
                        rule={rule}
                        onTagChange={partial(
                          this.handleAutomatedRuleChange,
                          "tagId",
                          rule
                        )}
                        onLowerThresholdChange={partial(
                          this.handleAutomatedRuleChange,
                          "lowerThreshold",
                          rule
                        )}
                        onUpperThresholdChange={partial(
                          this.handleAutomatedRuleChange,
                          "upperThreshold",
                          rule
                        )}
                        rangeBottom={Math.round(rule.lowerThreshold * 100)}
                        rangeTop={Math.round(rule.upperThreshold * 100)}
                        selectedTag={rule.tagId}
                        selectedAction={rule.action}
                        hasTagging
                        onModerateButtonClick={this.handleModerateButtonClick}
                        tags={tags}
                      />
                    ))}
                  {this.isModerationRuleEditingEnabled() &&
                    this.props.controlState.isModerationOverriden && (
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
            </tbody>
          </table>
          <div
            key="footer"
            {...css({ textAlign: "right", margin: "35px 25px 30px 25px" })}
          >
            <span
              onClick={clearPopups}
              {...css({ marginRight: "30px", opacity: "0.5" })}
            >
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
