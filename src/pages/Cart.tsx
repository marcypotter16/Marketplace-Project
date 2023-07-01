import React = require('react');
import {
  useCollectionData,
  useDocumentData,
} from 'react-firebase-hooks/firestore';
import { useParams } from 'react-router-dom';
import { Order, orderConverter } from '../classes/Order';
import { Product } from '../classes/Product';
import { User, userConverter } from '../classes/User';
import { db, fv } from '../firebase';

export function Cart() {
  const params = useParams();
  const query = db
    .collection('users')
    .doc(params.id)
    .withConverter(userConverter);
  const [value, loading, error] = useDocumentData<User>(query);

  function notifyOwnersOfCart() {
    // Update each product quantity
    value.cart.forEach((p: Product) => {
      console.log(p.id);
      const productRef = db.collection('products').doc(p.id);
      productRef.get().then((snapshot) => {
        const data = snapshot.data();
        if (data.quantity > p.quantity) {
          productRef.update({
            quantity: fv.increment(-p.quantity),
          });
        }
      });
    });

    // Add order to the orders collection
    db.collection('orders')
      .withConverter<Order>(orderConverter)
      .add(new Order('', params.id, value.cart))
      .then((snapshot) => {
        // Notify all owners that you ordered stuff
        const idList = value.cart.map(
          (simpleProduct) => simpleProduct.publisherId
        );
        console.warn(idList, value.cart);
        idList.forEach((id: string) => {
          db.collection('users')
            .doc(id)
            .set({
              notifications: fv.arrayUnion(snapshot.id),
            });
        });
      });

    // Empty cart
    const userRef = db.collection('users').doc(params.id);
    userRef.update({
      cart: [],
    });
  }
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
