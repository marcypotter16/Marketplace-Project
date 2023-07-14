import { useState } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useParams } from 'react-router-dom';
import { TrashIcon, WrenchIcon } from '@heroicons/react/20/solid';
import { Order, orderConverter } from '../classes/Order';
import { Product } from '../classes/Product';
import { User, userConverter } from '../classes/User';
import { db, fv, storage } from '../firebase';
import { BellAlertIcon } from '@heroicons/react/24/outline';

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
      const productRef = db.collection('products').doc(p.id);
      productRef.get().then((snapshot) => {
        const data = snapshot.data();
        if (data.quantity > p.quantity) {
          console.log('incremento', fv.increment(-p.quantity));
          productRef.update({
            quantity: fv.increment(-p.quantity),
          });
        } else {
          alert('Hai ordinato un numero troppo alto di: ' + p.name);
          return;
        }
      });
    });

    // Add order to the orders collection
    db.collection('orders')
      .withConverter<Order>(orderConverter)
      .add(new Order('', params.id, value.cart))
      .then((snapshot) => {
        // Notify all owners that you ordered stuff
        // delete this
        const idList = value.cart.map(
          (simpleProduct) => simpleProduct.publisherId
        );
        console.warn(idList, value.cart);
        value.cart.forEach((product) => {
          db.collection('users')
            .doc(product.publisherId)
            .set(
              {
                notifications: fv.arrayUnion({
                  productId: product.id,
                  productName: product.name,
                  quantity: product.quantity,
                  unitPrice: product.price,
                  buyerId: params.id,
                  message: 'richiesta di ciboh',
                }),
              },
              { merge: true }
            );
        });
      });

    // Empty cart
    const userRef = db.collection('users').doc(params.id);
    userRef.update({
      cart: [],
    });

    alert('Ordine piazzato');
  }
  return (
    <div className="px-4 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl text-white font-semibold">Carrello</h1>
      {loading && <h4>Loading...</h4>}
      {error && <h4 style="color: red">Error!</h4>}
      {value && (
        <div
          className={`max-w-3xl mx-auto grid grid-cols-${Math.floor(
            Math.sqrt(value.cart.length + 1)
          )}`}
        >
          {value.cart.map((product) => (
            <SimpleProductCard
              simpleProduct={product}
              userId={params.id}
              key={product.id}
            />
          ))}
        </div>
      )}
      {/* <button onClick={() => console.log(value)}>_printvalue</button> */}
      <button
        onClick={notifyOwnersOfCart}
        className="flex bg-teal-700 rounded-md py-2 px-4 mt-5 text-white hover:bg-teal-600"
      >
        <p className="bg-transparent">
          Notifica i proprietari che ti impegni a comprare i prodotti nel
          carrello
        </p>
        <BellAlertIcon className="h-10 w-10 bg-transparent text-black ml-2" />
      </button>
    </div>
  );
}

function SimpleProductCard({ simpleProduct, userId }) {
  const [imageURLs, setImageURLs] = useState([]);
  function remove() {
    db.collection('users')
      .doc(userId)
      .update({
        cart: fv.arrayRemove(simpleProduct),
      });
  }
  const today = new Date();
  React.useEffect(() => {
    const imageRef = storage.ref(
      `${today.getFullYear()}/${simpleProduct.publisherId}/${simpleProduct.id}`
    );
    imageRef.list({ maxResults: 1 }).then((images) => {
      images.items[0]
        .getDownloadURL()
        .then((url) => setImageURLs((prev) => [...prev, url]));
    });
  }, []);
  return (
    <div className="bg-gray-500 p-2 max-w-md rounded-lg m-2 flex justify-evenly">
      <div className="bg-gray-800 max-w-xs mr-4 border text-center rounded">
        {imageURLs && (
          <div className={`flex flex-row bg-transparent`}>
            {imageURLs.map((url) => (
              <img
                src={url}
                className="w-full overflow-hidden rounded m-1 mb-3 shadow-xl"
              />
            ))}
          </div>
        )}

        <h3 className="text-xl bg-transparent font-semibold text-center text-white px-3">
          {simpleProduct.name}
        </h3>

        <h4 className="bg-gray-800 text-gray-400 text-3xl">
          {simpleProduct.price} €
        </h4>
        <p className="bg-gray-800 text-gray-400 text-sm mb-2">
          Nel carrello: {simpleProduct.quantity}
        </p>
      </div>
      <div className="bg-transparent flex flex-col justify-around">
        <button
          onClick={remove}
          className="rounded-full p-4 hover:bg-red-800 hover:text-white"
        >
          <TrashIcon className="h-5 w-5 bg-transparent" aria-hidden="true" />
        </button>
        <button
          onClick={() => {
            alert('EDIT item not yet supported');
            console.log('EDIT');
          }}
          className="rounded-full p-4 hover:bg-yellow-800 hover:text-white"
        >
          <WrenchIcon className="h-5 w-5 bg-transparent" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
