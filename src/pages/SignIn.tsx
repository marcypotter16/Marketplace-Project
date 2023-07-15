import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User, userConverter } from '../classes/User';
import { db } from '../firebase';
import '../style.css';
import { Context, createContext } from 'react';

export var loggedUser: Context<User | undefined> | Context<User>;

export function SignIn({ signInWithGoogle }) {
  function signIn() {
    signInWithGoogle().then((value) => {
      const user = value.user;
      // const userRef = db.collection('users').doc(user.uid).withConverter(userConverter);
      const userRef = doc(db, 'users', user.uid).withConverter(userConverter);
      const userObject = {
        displayName: user.displayName,
        email: user.email,
        image: user.photoURL,
        cart: [],
        notifications: [],
      };
      
      getDoc(userRef).then((snapshot) => {
        if (!snapshot.exists) {
          setDoc(userRef, 
            userObject,
            { merge: true }
          );
          loggedUser = createContext(new User(user.displayName, user.email, [], user.uid, [], user.photoURL))
        } else {
          loggedUser = createContext(snapshot.data())
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
