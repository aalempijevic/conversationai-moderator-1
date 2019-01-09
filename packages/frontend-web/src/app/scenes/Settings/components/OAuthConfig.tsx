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

import { autobind } from 'core-decorators';
import React from 'react';

import { Button } from '../../../components/Button';
import { RejectIcon } from '../../../components/Icons';
import { OverflowContainer } from '../../../components/OverflowContainer';
import { IOAuthConfiguration } from '../../../platform/dataService';
import {
  DARK_COLOR,
  GUTTER_DEFAULT_SPACING,
  PALE_COLOR,
  SCRIM_Z_INDEX,
} from '../../../styles';
import { partial } from '../../../util/partial';
import { css, stylesheet } from '../../../utilx';
import { SETTINGS_STYLES } from '../settingsStyles';
import {API_URL} from '../../../config';

const STYLES = stylesheet({
  heading: {
    fontSize: '18px',
  },

  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  closeButton: {
    background: 'none',
    border: 'none',
    position: 'absolute',
    right: GUTTER_DEFAULT_SPACING,
    top: GUTTER_DEFAULT_SPACING,
    cursor: 'pointer',
    zIndex: SCRIM_Z_INDEX,
    ':focus': {
      outline: 'none',
      background: PALE_COLOR,
    },
  },
});

export interface IOAuthConfigProps {
  clientId: string;
  onClickClose(e: React.FormEvent<any>): any;
  onClickDone(config: IOAuthConfiguration): any;
}

export interface IOAuthConfigState {
  id: string;
  secret: string;
}

export class OAuthConfig extends React.Component<IOAuthConfigProps, IOAuthConfigState> {
  state = {
    id: this.props.clientId,
    secret: '',
  };

  isDisabled() {
    return !(this.state.id.length > 0 && this.state.secret.length > 0);
  }

  @autobind
  onValueChange(inputType: string, e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    this.setState({
      [inputType]: e.target.value,
    } as any);
  }

  @autobind
  onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    this.props.onClickDone({id: this.state.id, secret: this.state.secret});
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <OverflowContainer
          header={(
            <div {...css(STYLES.headerRow)}>
              <h1 {...css(STYLES.heading)}>Google OAuth server config</h1>
              <button key="close button" type="button" {...css(STYLES.closeButton)} aria-label="Close" onClick={this.props.onClickClose}>
                <RejectIcon style={{fill: DARK_COLOR}} />
              </button>
            </div>
          )}
          body={(
            <div>
              <p>Configure your connection to the Google OAuth server here.</p>
              <p>
                To allocate and view tokens, visit <a href="https://console.developers.google.com/apis/credentials" target="_blank">the
                Google API console</a>.  If you haven't yet got an appropriate <b>OAuth client ID</b> yet, or want to allocate a new one,
                you can do so by clicking the <b>Create Credentials</b> button and selecting the <b>OAuth</b> entry.
              </p>
              <p>
                When asked for an application type, choose <b>Web application</b>.
                Set the <b>Authorised redirect URI</b> to <b>{API_URL}/auth/callback/google</b>.
                (If you want to connect to YouTube, you'll also need to add an alternate redirect URI of
                <b>{API_URL}/youtube/callback</b>.)
              </p>
              <p>
                Once allocated, copy the client id and secret into the fields below.
              </p>
              <div key="name" {...css(SETTINGS_STYLES.row)}>
                <label htmlFor="name" {...css(SETTINGS_STYLES.label, {minWidth: '60px'})}>Client ID</label>
                <input
                  id="id"
                  type="text"
                  {...css(SETTINGS_STYLES.input, {width: '100%'})}
                  value={this.state.id}
                  onChange={partial(this.onValueChange, 'id')}
                />
              </div>
              <div key="email" {...css(SETTINGS_STYLES.row)}>
                <label htmlFor="email" {...css(SETTINGS_STYLES.label, {minWidth: '60px'})}>Secret</label>
                <input
                  id="secret"
                  type="text"
                  {...css(SETTINGS_STYLES.input, {width: '100%'})}
                  value={this.state.secret}
                  onChange={partial(this.onValueChange, 'secret')}
                />
              </div>
            </div>
          )}
          footer={(
            <Button disabled={this.isDisabled()} label="Save"/>
          )}
        />
      </form>
    );
  }
}
