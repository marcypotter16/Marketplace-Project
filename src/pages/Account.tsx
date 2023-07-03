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
    console.log(user.uid == 'awFfIe1GvzZiGQpBZtXNu45Sa7u2');
    const query = db
      .collection('users')
      .withConverter(userConverter)
      .doc(user.uid);
    const [userDoc, loading, error] = useDocumentData<User>(query);
    return (
      <div className="m-2 rounded border">
        <h1 className="text-white">Ciao, {user.displayName}</h1>
        {userDoc && user.displayName}

        <h4>Notifiche</h4>
        {error && error}
        {loading && <p>Loading...</p>}
        {userDoc &&
          userDoc.notifications.map((n) => (
            <OrderCard notification={n} key={n.id} />
          ))}
      </div>
    );
  } else {
    return <Home />;
  }
}

function OrderCard({ notification }) {
  return (
    <div className="flex border flex-col text-center text-white p-2">
      <p>Prodotto: {notification.name}</p>
      <p>Quantità: {notification.quantity}</p>
      <p>Prezzo totale: {notification.quantity * notification.price}</p>
      <p>Prezzo unitario: {notification.price}</p>
    </div>
  );
}
