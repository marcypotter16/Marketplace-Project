import React = require('react');
import { db } from '../firebase';
import { Home } from './Home';

export function Account({ user }) {
  function adduser() {
    db.collection('users').doc(user.uid).set(
      {
        displayName: user.displayName,
        email: user.email,
        image: user.photoURL,
      },
      { merge: true }
    );
  }
  if (user) {
    return (
      <>
        <h1>Ciao, {user.displayName}</h1>
        <button onClick={adduser}>Add User to DB</button>
      </>
    );
  } else {
    return <Home />;
  }
}
