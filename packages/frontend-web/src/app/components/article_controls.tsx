/*
Copyright 2019 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { getTags } from '../stores/tags';
import React from 'react';

import {
  ClickAwayListener,
  DialogTitle,
  Popper,
  Switch,
} from '@material-ui/core';

import { IArticleModel, IRuleModel, IServerAction, ITagModel, RuleModel, SERVER_ACTION_ACCEPT, TagModel } from '../../models';
import {
  GREY_COLOR,
  GUTTER_DEFAULT_SPACING,
  NICE_CONTROL_BLUE,
  SCRIM_STYLE,
} from '../styles';
import {
  big,
  ICON_STYLES,
} from '../stylesx';
import { css } from '../utilx';
import * as icons from './Icons';
import { ArticleRuleRow } from '../scenes/Settings/components/ArticleRuleRow';
import { List } from 'immutable';
import { partial } from '../util';
import { AddButton } from '../scenes/Settings/components/AddButton';

interface IIControlFlagProps {
  isCommentingEnabled?: boolean;
  isAutoModerated?: boolean;
  isModerationOverriden?: boolean;
}

let placeholderId = -1;
export class ControlFlag extends React.Component<IIControlFlagProps> {
  render() {
    let style: any;
    let Icon: any;

    if (this.props.isAutoModerated) {
      Icon = icons.SpeechBubbleIconCircle;
    }
    else {
      Icon = icons.SpeechBubbleIcon;
    }

    if (this.props.isCommentingEnabled) {
      style = {color: NICE_CONTROL_BLUE};
    }
    else {
      style = {color: GREY_COLOR};
    }
    // todo add styling to indicate overrides
    return (<Icon {...css(style)}/>);
  }
}

export interface IIControlPopupProps {
  article: IArticleModel;
  tags: List<ITagModel>;
  clearPopups(): void;
  saveControls(isCommentingEnabled: boolean, isAutoModerated: boolean, isModerationOverriden: boolean, moderationRules: Array<IRuleModel>): void;
}

export interface IIControlPopupState {
  isCommentingEnabled: boolean;
  isAutoModerated: boolean;
  isModerationOverriden: boolean;
  moderationRules: Array<IRuleModel>;
}

export class ArticleControlPopup extends React.Component<IIControlPopupProps, IIControlPopupState> {
  constructor(props: Readonly<IIControlPopupProps>) {
    super(props);
    this.state = {
      isCommentingEnabled: this.props.article.isCommentingEnabled,
      isAutoModerated: this.props.article.isAutoModerated,
      isModerationOverriden: this.props.article.moderationRules && this.props.article.moderationRules?.length > 0,
      moderationRules: this.props.article.moderationRules,
    };
  }

  @autobind
  handleCommentingEnabledClicked() {
    this.setState({isCommentingEnabled: !this.state.isCommentingEnabled});
  }

  @autobind
  handleAutoModeratedClicked() {
    if (!this.state.isCommentingEnabled) {
      return;
    }
    this.setState({isAutoModerated: !this.state.isAutoModerated});
  }

  @autobind
  handleModerationRulesOverride() {
    this.setState({isModerationOverriden: !this.state.isModerationOverriden});
  }

  @autobind
  saveControls() {
    this.props.saveControls(this.state.isCommentingEnabled, this.state.isAutoModerated, this.state.isModerationOverriden, this.state.moderationRules);
  }

  @autobind
  handleAutomatedRuleChange(attribute: string, rule: IRuleModel, value: number | string) {
    let updatedRules = [...this.state.moderationRules];
    let idx = updatedRules.findIndex((r) => r.equals(rule));
    updatedRules[idx] = updatedRules[idx].set(attribute, value);
    this.setState({
      moderationRules: updatedRules
    });
  }

  @autobind
  handleModerateButtonClick(rule: IRuleModel, action: IServerAction) {
    let updatedRules = [...this.state.moderationRules];
    let idx = updatedRules.findIndex((r) => r.equals(rule));
    updatedRules[idx] = updatedRules[idx].set('action', action);
    this.setState({
      moderationRules: updatedRules
    });
  }

  @autobind
  handleAutomatedRuleDelete(rule: IRuleModel) {
    let updatedRules = [...this.state.moderationRules];
    let idx = updatedRules.findIndex((r) => r.equals(rule));
    updatedRules.splice(idx, 1)
    this.setState({
      moderationRules: updatedRules
    });
  }

  @autobind
  handleAddAutomatedRule(event: React.FormEvent<any>) {
    event.preventDefault();
    const newValue = RuleModel(
      {
        id: (placeholderId--).toString(),
        createdBy: null,
        articleId: this.props.article.id,
        tagId: '15',
        lowerThreshold: .8,
        upperThreshold: 1,
        action: SERVER_ACTION_ACCEPT,
      },
    );
    const updatedRules = this.state.moderationRules || [];
    updatedRules.push(newValue)
    this.setState({ moderationRules: updatedRules });
  }


  render() {
    return (
      <ClickAwayListener onClickAway={this.props.clearPopups}>
        <div tabIndex={0} {...css(SCRIM_STYLE.popupMenu, {padding: '20px'})}>
          <DialogTitle id="article-controls">Moderation settings</DialogTitle>
          <table key="main" {...css({width: 'compute(100% - 50px)', margin: '4px 9px 4px 25px'})}>
            <tbody>
            <tr key="comments" onClick={this.handleCommentingEnabledClicked}>
              <td key="icon">
                <ControlFlag isCommentingEnabled={this.state.isCommentingEnabled}/>
              </td>
              <td key="text" {...css({textAlign: 'left', padding: '15px 4px'})}>
                <label {...css(SCRIM_STYLE.popupContent)}>
                  Comments Enabled
                </label>
              </td>
              <td key="toggle" {...css({textAlign: 'right'})}>
                <Switch checked={this.state.isCommentingEnabled} color="primary"/>
              </td>
            </tr>
            <tr key="automod" onClick={this.handleAutoModeratedClicked} {...css(this.state.isCommentingEnabled ? {} : {opacity: 0.5})}>
              <td key="icon">
                <ControlFlag isCommentingEnabled={this.state.isCommentingEnabled} isAutoModerated={this.state.isAutoModerated}/>
              </td>
              <td key="text"  {...css({textAlign: 'left', padding: '15px 4px'})}>
                <label {...css(SCRIM_STYLE.popupContent)}>
                  Auto Moderation Enabled
                </label>
              </td>
              <td key="toggle" {...css({textAlign: 'right'})}>
                <Switch checked={this.state.isAutoModerated} disabled={!this.state.isCommentingEnabled} color="primary"/>
              </td>
            </tr>
            <tr key="moderationOverride" onClick={this.handleModerationRulesOverride}>
              <td key="icon">
                <ControlFlag isCommentingEnabled={this.state.isCommentingEnabled}/>
              </td>
              <td key="text" {...css({textAlign: 'left', padding: '15px 4px'})}>
                <label {...css(SCRIM_STYLE.popupContent)}>
                  Rules Override
                </label>
              </td>
              <td key="toggle" {...css({textAlign: 'right'})}>
                <Switch checked={this.state.isModerationOverriden} color="primary"/>
              </td>
            </tr>
            <tr>
      <td key="editRulesSection">
        
          {this.state.moderationRules && this.state.moderationRules.map((rule, i) => (
            <ArticleRuleRow
              key={i}
              onDelete={this.handleAutomatedRuleDelete}
              rule={rule}
              onTagChange={partial(this.handleAutomatedRuleChange, 'tagId', rule)}
              onLowerThresholdChange={partial(this.handleAutomatedRuleChange, 'lowerThreshold', rule)}
              onUpperThresholdChange={partial(this.handleAutomatedRuleChange, 'upperThreshold', rule)}
              rangeBottom={Math.round(rule.lowerThreshold * 100)}
              rangeTop={Math.round(rule.upperThreshold * 100)}
              selectedTag={rule.tagId}
              selectedAction={rule.action}
              hasTagging
              onModerateButtonClick={this.handleModerateButtonClick}
              tags={this.props.tags}
            />
          ))}
          <AddButton
            width={44}
            onClick={this.handleAddAutomatedRule}
            label="Add an automated rule"
            buttonStyles={{margin: `${GUTTER_DEFAULT_SPACING}px 0`}}
          />
      </td>
    </tr>
            </tbody>
          </table>
          <div key="footer" {...css({textAlign: 'right', margin: '35px 25px 30px 25px'})}>
            <span onClick={this.props.clearPopups} {...css({marginRight: '30px', opacity: '0.5'})}>Cancel</span>
            <span onClick={this.saveControls} {...css({color: NICE_CONTROL_BLUE})}>Save</span>
          </div>
        </div>
      </ClickAwayListener>
    );
  }
}

interface IArticleControlIconProps {
  article: IArticleModel;
  tags: List<ITagModel>;
  open: boolean;
  whiteBackground?: boolean;

  clearPopups(): void;

  openControls(article: IArticleModel): void;

  saveControls(isCommentingEnabled: boolean, isAutoModerated: boolean, isModerationRuleOveridden: boolean, moderationRules: Array<IRuleModel>): void;
}

function mapStateToProps(state: any, ownProps: any): any {
  const tags = getTags(state)
  return {
    ...ownProps,
    tags,
  }
}

class LazyArticleControlIcon extends React.Component<IArticleControlIconProps> {
  anchorElement: any;

  @autobind
  setOpen() {
    const {article, open, clearPopups, openControls} = this.props;
    if (open) {
      clearPopups();
    }
    else {
      openControls(article);
    }
  }

  render() {
    const {article, tags: tagsFromProps, open, whiteBackground, saveControls, clearPopups} = this.props;
    console.log(`TAGS FROM PROPS = ${JSON.stringify(tagsFromProps)}`);
    // todo [SEO-2339] temporary solution for PoC - tags need to be properly passed.
    const tags = tagsFromProps ? tagsFromProps : List<ITagModel>([TagModel({id: "15", label: "Summary Score"})]);
    return (
      <div key="aci">
        <div
          key="icon"
          {...css(open || whiteBackground ? ICON_STYLES.iconBackgroundCircle : big)}
          ref={(node) => {
            this.anchorElement = node;
          }}
        >
          <div onClick={this.setOpen} {...css(ICON_STYLES.iconCenter)}>
            <ControlFlag isCommentingEnabled={article.isCommentingEnabled} isAutoModerated={article.isAutoModerated}/>
          </div>
        </div>
        <Popper
          key="popper"
          open={open}
          anchorEl={this.anchorElement}
          placement="left"
          modifiers={{
            preventOverflow: {
              enabled: true,
              boundariesElement: 'viewport',
            },
          }}
        >
          <ArticleControlPopup
            article={article}
            tags={tags}
            saveControls={saveControls}
            clearPopups={clearPopups}
          />
        </Popper>
      </div>
    );
  }
}

export const ArticleControlIcon: React.ComponentClass<IArticleControlIconProps> = connect(
  mapStateToProps,
)(LazyArticleControlIcon);