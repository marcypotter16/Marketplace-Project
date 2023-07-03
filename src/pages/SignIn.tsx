import React = require('react');
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { User, userConverter } from '../classes/User';
import { db } from '../firebase';
import '../style.css';

export function SignIn({ signInWithGoogle }) {
  const query = db.collection('users').withConverter(userConverter);
  const [data] = useCollectionData<User>(query);

  function signIn() {
    signInWithGoogle().then((value) => {
      const user = value.user;
      const userRef = db.collection('users').doc(user.uid);
      userRef.get().then((snapshot) => {
        if (!snapshot.exists) {
          userRef.set(
            {
              displayName: user.displayName,
              email: user.email,
              image: user.photoURL,
              notifications: [],
            },
            { merge: true }
          );
        }
      });
    });
  }
  return (
    <div className="container mx-auto flex flex-col text-center justify-center p-4">
      <h1 className="text-gray-200 uppercase font-bold my-5">Sign In</h1>
      <button
        className="text-gray-400 px-2 py-1 hover:text-white hover:bg-blue-700 hover:shadow-xl rounded-md"
        onClick={signIn}
      >
        Sign in with Google
      </button>
    </div>
  );
}
