import * as React from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { db, fv } from '../firebase';
import { Product, productConverter } from '../classes/Product';

export function Products({ user }) {
  const query = db.collection('products').withConverter(productConverter);
  const [products] = useCollectionData<Product>(query);
  return (
    <div className="px-2">
      <h1 className="text-white text-xl">Products Page</h1>
      {products &&
        products.map((product) => {
          return (
            <div className="flex" key={product.id}>
              <ProductCard product={product} user={user} />
            </div>
          );
        })}
    </div>
  );
}

export function ProductCard({ product, user }) {
  const [selectedQuantity, setSelectedQuantity] = React.useState(0);
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
        });
    }
  }
  return (
    <div className="bg-white p-2 rounded-lg m-2 flex">
      <div className="mr-4 border p-1">
        <h3 className="text-xl bg-blue-100 rounded px-1 shadow">
          {product.name}
        </h3>
        {product.description}
        <h4>Prezzo: {product.price} €</h4>
        Disponibili: {product.quantity}
        <h4>{product.quantity > 0 ? 'disponibile' : 'non disponibile'}</h4>
      </div>
      <div className="flex flex-col border p-1">
        <p className="text-center">{selectedQuantity}</p>
        <div className="flex justify-evenly">
          <button
            className="border hover:shadow-inner px-2 my-2"
            onClick={() => {
              if (selectedQuantity < product.quantity)
                setSelectedQuantity(selectedQuantity + 1);
            }}
          >
            +
          </button>
          <button
            className="border hover:shadow-inner px-2 my-2"
            onClick={() => {
              if (selectedQuantity > 0)
                setSelectedQuantity(selectedQuantity - 1);
            }}
          >
            -
          </button>
        </div>
        <button className="border px-2 hover:shadow-inner" onClick={addToCart}>
          Add to cart
        </button>
      </div>
    </div>
  );
}
