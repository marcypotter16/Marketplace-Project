import * as React from 'react';
import './Products.css';
import { Link } from 'react-router-dom';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { db, productConverter, fv } from '../firebase';
import { Product } from '../classes/Product';

export function Products({ user }) {
  const query = db.collection('products').withConverter(productConverter);
  const [products] = useCollectionData<Product>(query);
  if (products) {
    console.log(products);
  }
  return (
    <>
      <h1>Products Page</h1>
      {products &&
        products.map((product) => {
          return (
            <div className="productsWrapper">
              <ProductCard product={product} user={user} />
            </div>
          );
        })}
    </>
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
            name: product.name,
            quantity: selectedQuantity,
          }),
        });
    }
  }
  return (
    <div className="productCard">
      <div className="productCardLeftPanel">
        <h3>{product.name}</h3>
        {product.description}
        <h4>Prezzo: {product.price} €</h4>
        Disponibili: {product.quantity}
        <h4>{product.quantity > 0 ? 'disponibile' : 'non disponibile'}</h4>
      </div>
      <div className="productCardRightPanel">
        {selectedQuantity}
        <button
          onClick={() => {
            if (selectedQuantity < product.quantity)
              setSelectedQuantity(selectedQuantity + 1);
          }}
        >
          +
        </button>
        <button
          onClick={() => {
            if (selectedQuantity > 0) setSelectedQuantity(selectedQuantity - 1);
          }}
        >
          -
        </button>
        <button onClick={addToCart}>Add to cart</button>
      </div>
    </div>
  );
}
