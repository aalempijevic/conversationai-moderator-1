import React from "react";

import { css } from "../../utilx";
import { GREY_COLOR, NICE_CONTROL_BLUE, RED } from "../../styles";
import * as icons from "../Icons";

interface IIControlFlagProps {
  isCommentingEnabled?: boolean;
  isAutoModerated?: boolean;
  isModerationOverriden?: boolean;
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
      style = { color: NICE_CONTROL_BLUE };
    } else {
      style = { color: GREY_COLOR };
    }
    if (this.props.isModerationOverriden) {
      style = { color: RED };
    }
    return <Icon {...css(style)} />;
  }
}
