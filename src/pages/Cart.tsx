import React = require('react');
import {
  useCollectionData,
  useDocumentData,
} from 'react-firebase-hooks/firestore';
import { useParams } from 'react-router-dom';
import { User } from '../classes/User';
import { db, userConverter, fv } from '../firebase';

export function Cart() {
  const params = useParams();
  const query = db
    .collection('users')
    .doc(params.id)
    .withConverter(userConverter);
  const [value, loading, error] = useDocumentData<User>(query);

  function notifyOwnersOfCart() {}
  return (
    <>
      <h1>Cart</h1>
      {loading && <h4>Loading...</h4>}
      {error && <h4 style="color: red">Error!</h4>}
      {value &&
        value.cart.map((product) => (
          <SimpleProductCard simpleProduct={product} userId={params.id} />
        ))}
      <button onClick={() => console.log(value)}>_printvalue</button>
      <button onClick={notifyOwnersOfCart}>
        Notifica i proprietari che ti impegni a comprare i prodotti nel carrello
      </button>
    </>
  );
}

function SimpleProductCard({ simpleProduct, userId }) {
  function remove() {
    db.collection('users')
      .doc(userId)
      .update({
        cart: fv.arrayRemove(simpleProduct),
      });
  }
  return (
    <>
      <h2>
        {simpleProduct.name}: {simpleProduct.quantity}
      </h2>
      <button onClick={remove}>Rimuovi</button>
    </>
  );
}
