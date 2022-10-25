import React from "react";

import { Badge } from "@material-ui/core";

import { css } from "../../utilx";
import { GREY_COLOR, NICE_CONTROL_BLUE, RED } from "../../styles";
import * as icons from "../Icons";

interface IIControlFlagProps {
  isCommentingEnabled?: boolean;
  isAutoModerated?: boolean;
  isModerationOverridden?: boolean;
  isRestrictedTermsOverridden?: boolean;
}

export class ControlFlag extends React.Component<IIControlFlagProps> {
  render() {
    let style: any;
    let Icon: any;

    if (this.props.isAutoModerated) {
      Icon = icons.SpeechBubbleIconCircle;
    } else {
      Icon = icons.SpeechBubbleIcon;
    }

    if (this.props.isCommentingEnabled) {
      if (this.props.isModerationOverridden) {
        style = { color: RED };
      } else {
        style = { color: NICE_CONTROL_BLUE };
      }
    } else {
      style = { color: GREY_COLOR };
    }
    if (this.props.isModerationOverridden) {
      style = { color: RED };
    }
    return (
      <Badge
        color="secondary"
        invisible={!this.props.isRestrictedTermsOverridden}
        badgeContent={"R"}
        variant="standard"
      >
        <Icon {...css(style)} />
      </Badge>
    );
  }
}
