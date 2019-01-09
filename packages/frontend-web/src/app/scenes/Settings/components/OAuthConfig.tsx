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

import React, { useCallback, useState } from 'react';

import {
  Button,
  makeStyles,
  TextField,
} from '@material-ui/core';

import { API_URL } from '../../../config';
import { IApiConfiguration } from '../../../platform/dataService';

export interface IOAuthConfigProps extends IApiConfiguration {
  onClickDone(config: IApiConfiguration): any;
}

const useStyles = makeStyles((_theme) => ({
  textField: {
    width: '40vw',
  },
}));

export function OAuthConfig(props: IOAuthConfigProps) {
  const [id, setId] = useState(props.id);
  const [secret, setSecret] = useState(props.secret);
  const classes = useStyles();

  const idHandler = useCallback((e) => setId(e.target.value), [setId]);
  const secretHandler = useCallback((e) => setSecret(e.target.value), [setSecret]);
  function submitHandler() {
    props.onClickDone({id, secret});
  }

  return (
    <div>
      <p>Configure your connection to the Google Authentication service.</p>
      <p>
        To allocate and view tokens, visit <a
          href="https://console.developers.google.com/apis/credentials"
          target="_blank"
          style={{color: 'inherit', fontWeight: 'bold', textDecoration: 'underline'}}
        >the Google API console</a>.
        If you haven't yet got an appropriate <b>OAuth Client ID</b> yet, or want to allocate a new one,
        you can do so by clicking the <b>Create Credentials</b> button and selecting the <b>OAuth</b> entry.
      </p>
      <p>
        When asked for an application type, choose <b>Web application</b>.
        Set the <b>Authorised redirect URI</b> to <b>{API_URL}/auth/callback/google</b>.
        (If you want to connect to YouTube, you'll also need to add a second redirect URI
        of <b>{API_URL}/youtube/callback</b>.)
      </p>
      <p>
        Once allocated, copy the client id and secret into the fields below.
      </p>
      <div style={{textAlign: 'center'}}>
        <TextField
          className={classes.textField}
          label="Client ID"
          value={id}
          onChange={idHandler}
          margin="normal"
          variant="outlined"
        />
        <TextField
          className={classes.textField}
          label="Client Secret"
          value={secret}
          onChange={secretHandler}
          margin="normal"
          variant="outlined"
        />
        <div style={{textAlign: 'right', marginTop: '2vh', marginRight: '9vw'}}>
          <Button
            variant="contained"
            color="primary"
            onClick={submitHandler}
            disabled={!(id.length > 0 && secret.length > 0)}
          >
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}
