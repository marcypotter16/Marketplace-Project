import * as React from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { db, fv } from '../firebase';
import { Product, productConverter } from '../classes/Product';
import { Navigate } from 'react-router-dom';

export function Products({ user }) {
  const query = db.collection('products').withConverter(productConverter);
  const [products] = useCollectionData<Product>(query);
  return (
    <div>
      <h1 className="text-gray-100 text-xl font-bold text-center py-2">
        Products Page
      </h1>
      <div className="grid grid-cols-3 m-2 rounded flex flex-col justify-center border shadow">
        {products &&
          products.map((product) => {
            return (
              <ProductCard product={product} user={user} key={product.id} />
            );
          })}
      </div>
    </div>
  );
}

export function ProductCard({ product, user }) {
  const [selectedQuantity, setSelectedQuantity] = React.useState(0);
  const [navigateToSignIn, setNavigateToSignIn] = React.useState(false);
  const [showMessage, setShowMessage] = React.useState(false);
  function addToCart() {
    if (user) {
      db.collection('users')
        .doc(user.uid)
        .update({
          cart: fv.arrayUnion({
            id: product.id,
            name: product.name,
            quantity: selectedQuantity,
            publisherId: product.publisherId,
          }),
        })
        .then((res) => {
          setShowMessage(true);
        });
    } else {
      alert('Devi prima effettuare il login.');
      setNavigateToSignIn(true);
    }
  }
  return (
    <div className="bg-gray-500 p-2 rounded-lg m-2 flex">
      <div className="bg-gray-800 mr-4 border py-1 px-3 text-center rounded">
        <h3 className="text-xl font-bold text-center bg-blue-400 rounded-lg shadow-inner px-3">
          {product.name}
        </h3>
        <p className="bg-gray-800 text-sm text-gray-400">{product.description}</p>
        <h4 className="bg-gray-800 text-gray-400 text-sm">Prezzo: {product.price} €</h4>
        <p className="bg-gray-800 text-gray-400 text-sm">Disponibili: {product.quantity}</p>
        <h4 className="bg-gray-800 text-gray-400 text-sm">
          {product.quantity > 0 ? 'disponibile' : 'non disponibile'}
        </h4>
      </div>
      <div className="flex flex-col border p-1">
        <p className="text-center text-white font-bold">{selectedQuantity}</p>
        <div className="flex justify-evenly">
          <button
            className="border rounded-full text-white hover:bg-blue-500 hover:shadow px-2 my-2"
            onClick={() => {
              if (selectedQuantity < product.quantity)
                setSelectedQuantity(selectedQuantity + 1);
            }}
          >
            +
          </button>
          <button
            className="border rounded-full text-white hover:bg-blue-500 hover:shadow px-2 my-2"
            onClick={() => {
              if (selectedQuantity > 0)
                setSelectedQuantity(selectedQuantity - 1);
            }}
          >
            -
          </button>
        </div>
        <button
          className="border rounded-full text-white hover:bg-blue-500 hover:shadow px-2 my-2"
          onClick={addToCart}
        >
          Add to cart
        </button>
      </div>
      {showMessage && (
        <p className="text-white">Elemento aggiunto al carrello.</p>
      )}
      {navigateToSignIn && <Navigate to="/" />}
    </div>
  );
}
