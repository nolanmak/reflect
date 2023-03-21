import {useState} from "react";
import awsExports from "../aws-exports";
import { Amplify, API, graphqlOperation } from 'aws-amplify'
import { createEntry} from '../graphql/mutations.js';
import { listEntries } from '../graphql/queries.js';
import config from '../aws-exports';
import {motion, AnimatePresence, LayoutGroup} from "framer-motion";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import { withAuthenticator } from '@aws-amplify/ui-react';

Amplify.configure(awsExports);


export default function Main() {
  return (
    <Authenticator loginMechanisms={['email']} variation="modal">
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user.username}</h1>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}