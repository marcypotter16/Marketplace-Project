import React = require('react');
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { User, userConverter } from '../classes/User';
import { db } from '../firebase';

export function SignIn({ signInWithGoogle }) {
  const query = db.collection('users').withConverter(userConverter);
  const [data] = useCollectionData<User>(query);

  function signIn() {
    signInWithGoogle().then((value) => {
      console.log('Log 8 ', value);
      const user = value.user;
      const userRef = db.collection('users').doc(user.uid)
      userRef.get().then((snapshot) => {
        if (!snapshot.exists) {
          userRef.set(
            {
              displayName: user.displayName,
              email: user.email,
              image: user.photoURL,
              notifications: []
            },
            { merge: true }
          );
        }
      })
    });
  }
  return (
    <>
      <h1>Sign In</h1>
      <button onClick={signIn}>Sign in with Google</button>
    </>
  );
}