import React = require('react');
import { db } from '../firebase';
import { Home } from './Home';

export function Account({ user }) {
  if (user) {
    return (
      <>
        <h1>Ciao, {user.displayName}</h1>
      </>
    );
  } else {
    return <Home />;
  }
}
