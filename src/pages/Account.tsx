import React = require('react');
import {
  useDocumentData,
  useDocumentDataOnce,
} from 'react-firebase-hooks/firestore';
import { User, userConverter } from '../classes/User';
import { db } from '../firebase';
import { Home } from './Home';

export function Account({ user }) {
  if (user) {
    const query = db
      .collection('users')
      .withConverter(userConverter)
      .doc(user.uid);
    const [userDoc] = useDocumentData<User>(query);
    return (
      <div className="m-2 rounded border">
        <h1 className="text-white">Ciao, {user.displayName}</h1>

        <h4>Notifiche</h4>
        {userDoc && userDoc.notifications.map((n) => <p>{n}</p>)}
      </div>
    );
  } else {
    return <Home />;
  }
}
