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

import { connect } from "react-redux";
import { autobind } from "core-decorators";
import { getTags } from "../../stores/tags";
import { getCurrentUserIsAdmin } from "../../stores/users";
import React from "react";

import { Popper } from "@material-ui/core";

import { IArticleModel, IRuleModel, ITagModel } from "../../../models";
import { big, ICON_STYLES } from "../../stylesx";
import { css } from "../../utilx";
import { List } from "immutable";

import { ArticleControlMenu } from "./ArticleControlsMenu";
import { ControlFlag } from "../ControlFlag";

export interface IArticleControlIconState {
  isCommentingEnabled: boolean;
  isAutoModerated: boolean;
  isModerationOverriden: boolean;
  moderationRules: Array<IRuleModel>;
}

interface IArticleControlIconProps {
  isAdmin?: boolean;
  article: IArticleModel;
  tags: List<ITagModel>;
  open: boolean;
  whiteBackground?: boolean;

  clearPopups(): void;

  openControls(article: IArticleModel): void;

  saveControls(
    isCommentingEnabled: boolean,
    isAutoModerated: boolean,
    isModerationRuleOveridden: boolean,
    moderationRules: Array<IRuleModel>
  ): void;
}

function mapStateToProps(state: any, ownProps: any): any {
  const tags = getTags(state);
  const isAdmin = getCurrentUserIsAdmin(state);
  return {
    ...ownProps,
    tags,
    isAdmin,
  };
}

class LazyArticleControlIcon extends React.Component<
  IArticleControlIconProps,
  IArticleControlIconState
> {
  anchorElement: any;
  constructor(props: Readonly<IArticleControlIconProps>) {
    super(props);
    this.state = {
      isCommentingEnabled: this.props.article.isCommentingEnabled,
      isAutoModerated: this.props.article.isAutoModerated,
      isModerationOverriden:
        this.props.article.moderationRules &&
        this.props.article.moderationRules?.length > 0,
      moderationRules: this.props.article.moderationRules,
    };
  }

  @autobind
  setOpen() {
    const { article, open, clearPopups, openControls } = this.props;
    if (open) {
      clearPopups();
    } else {
      openControls(article);
    }
  }

  @autobind
  handleCommentingEnabledClicked() {
    this.setState({ isCommentingEnabled: !this.state.isCommentingEnabled });
  }

  @autobind
  handleAutoModeratedClicked() {
    if (!this.state.isCommentingEnabled) {
      return;
    }
    this.setState({ isAutoModerated: !this.state.isAutoModerated });
  }

  @autobind
  saveControls() {
    this.props.saveControls(
      this.state.isCommentingEnabled,
      this.state.isAutoModerated,
      this.state.isModerationOverriden,
      this.state.moderationRules
    );
  }

  render() {
    const { isAdmin, article, tags, open, whiteBackground, clearPopups } =
      this.props;

    return (
      <div key="aci">
        <div
          key="icon"
          {...css(
            open || whiteBackground ? ICON_STYLES.iconBackgroundCircle : big
          )}
          ref={(node) => {
            this.anchorElement = node;
          }}
        >
          <div onClick={this.setOpen} {...css(ICON_STYLES.iconCenter)}>
            <ControlFlag
              isCommentingEnabled={article.isCommentingEnabled}
              isAutoModerated={article.isAutoModerated}
              isModerationOverriden={article.moderationRules?.length > 0}
            />
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
              boundariesElement: "viewport",
            },
          }}
        >
          <ArticleControlMenu
            isAdmin={isAdmin}
            article={article}
            tags={tags}
            controlState={this.state}
            setControlState={(state: any) => this.setState(state)}
            clearPopups={clearPopups}
            saveControls={this.saveControls}
          />
        </Popper>
      </div>
    );
  }
}

export const ArticleControlIcon: React.ComponentClass<IArticleControlIconProps> =
  connect(mapStateToProps)(LazyArticleControlIcon);
