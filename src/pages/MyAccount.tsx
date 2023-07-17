import { useDocumentData } from 'react-firebase-hooks/firestore';
import { User, userConverter } from '../classes/User';
import { db } from '../Utils/firebase.ts';
import { loggedUser } from './SignIn';
import { doc } from 'firebase/firestore';

console.log(loggedUser);

/* function AccountVero() {
  // if (user) {
  const query = db
    .collection('users')
    .withConverter(userConverter)
    .doc(loggedUser.uid);
  const [userDoc, loading, error] = useDocumentData<User>(query);
  return (
    <div className="m-2 rounded border">
      <h1 className="text-white">Ciao, {loggedUser.displayName}</h1>
      {userDoc && loggedUser.displayName}

      <h4>Notifiche</h4>
      {error && error}
      {loading && <p>Loading...</p>}
      {userDoc &&
        userDoc.notifications.map((n) => (
          <OrderCard notification={n} key={n.name} />
        ))}
    </div>
  );
  // } else {
  //   return <Home />;
  //}
} */

// ONLY FOR DEVELOPMENT PURPOSES, THE REAL FUNCTION IS THE ONE ABOVE, TO ACTIVATE IT REMOVE THE EXPORT KEYWORD FROM THIS FUNCTION, EXPORT THE OTHER FUNCTION AND RENAME IT TO MyAccount (and delete this function or rename it to something else).
export function MyAccount() {
  // if (user) {
  /* const query = db
    .collection('users')
    .withConverter(userConverter)
    .doc('awFfIe1GvzZiGQpBZtXNu45Sa7u2'); */
  const query = doc(db, 'users', 'awFfIe1GvzZiGQpBZtXNu45Sa7u2').withConverter(userConverter);
  const [userDoc, loading, error] = useDocumentData<User>(query);
  return (
    <div className="m-2 rounded border">
      <h1 className="text-white">Ciao</h1>

      <h4>Notifiche</h4>
      {error && error.message}
      {loading && <p>Loading...</p>}
      {userDoc &&
        userDoc.notifications.map((n) => (
          <OrderCard notification={n} key={n.name} />
        ))}
    </div>
  );
  // } else {
  //   return <Home />;
  //}
}

function OrderCard({ notification }) {
  /* const requesterQuery = db
    .collection('users')
    .withConverter(userConverter)
    .doc(notification.buyerId); */
  const requesterQuery = doc(db, 'users', notification.buyerId).withConverter(userConverter);
  const [buyer, loading, error] = useDocumentData<User>(requesterQuery);

  return (
    <div className="flex justify-evenly border flex-row text-center text-white p-2 m-2">
      <div className="flex border flex-col text-center text-white p-2 m-2">
        <p>Prodotto: {notification.productName}</p>
        <p>Quantità: {notification.quantity}</p>
        <p>
          Prezzo totale:{' '}
          {(notification.quantity * notification.unitPrice).toFixed(2)} €
        </p>
        <p>Prezzo unitario: {Number(notification.unitPrice).toFixed(2)} €</p>
        <div className="flex space-x-2">
          <button>Pagato</button>
        </div>
      </div>
      <div className="flex border flex-col text-center justify-center text-white p-2 m-2">
        <p>Richiedente: </p>
        {error && <p className="text-red-700">Errore</p>}
        {loading && <p className="text-yellow-500">Loading...</p>}
        {buyer ? <a>{buyer.displayName}</a> : <a>???</a>}
        {buyer && (
          <img src={buyer.image} className="rounded-lg border shadow-xl" />
        )}
      </div>
    </div>
  );
}
