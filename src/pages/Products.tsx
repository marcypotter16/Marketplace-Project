import * as React from 'react';
import {
  useCollectionData,
  useDocumentData,
} from 'react-firebase-hooks/firestore';
import { db, fv, storage } from '../firebase';
import { Product, productConverter } from '../classes/Product';
import { User, userConverter } from '../classes/User';
import { Navigate, NavLink } from 'react-router-dom';
import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { v4 } from 'uuid';

export function Products({ user }) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const query = db
    .collection('products')
    .limit(9)
    .withConverter(productConverter);
  const [productsData] = useCollectionData<Product>(query);
  const [products, setProducts] = React.useState(productsData);
  React.useEffect(() => {
    if (productsData && searchQuery) {
      setProducts(
        productsData.filter((product) => product.name.match(searchQuery))
      );
    }
  }, [searchQuery]);
  return (
    <div className="flex flex-col items-center py-10 mx-2">
      <h1 className="text-gray-100 text-3xl font-semibold text-center py-2">
        La Piazza
      </h1>
      <div className="flex">
        <input
          type="text"
          className="border rounded-l w-5/6 p-1 px-2 text-white"
          onChange={(e) => {
            setSearchQuery(e.target.value);
            console.log(searchQuery);
          }}
        />
        <div className="bg-gray-500 flex items-center justify-center rounded-r px-3">
          <MagnifyingGlassIcon className="w-4 h-4 bg-transparent" />
        </div>
      </div>
      <div className="grid md:grid-cols-3 sm:grid-cols-1 mx-10 my-5 m-2 rounded border shadow">
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
  const [imageURLs, setImageURLs] = React.useState([]);

  const query = db
    .collection('users')
    .doc(product.publisherId)
    .withConverter(userConverter);
  const [publisher, loading, error] = useDocumentData<User>(query);
  const today = new Date();
  React.useEffect(() => {
    const imageRef = storage.ref(
      `${today.getFullYear()}/${product.publisherId}/${product.id}`
    );
    imageRef.list({ maxResults: 4 }).then((images) => {
      images.items.forEach((image) => {
        image
          .getDownloadURL()
          .then((url) => setImageURLs((prev) => [...prev, url]));
      });
    });
  }, []);
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
            price: product.price,
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
    // Container
    <div className="bg-gray-500 p-2 rounded-lg m-2 flex flex-col justify-evenly">
      <div className="bg-gray-800 h-11/12 border text-center rounded-t-xl">
        {imageURLs && (
          <div className={`flex flex-row bg-transparent`}>
            {imageURLs.map((url) => (
              <img
                src={url}
                className="w-full border border-black overflow-hidden rounded-t-xl mb-1 shadow-xl"
                key={v4()}
              />
            ))}
          </div>
        )}
        <div className="flex bg-gray-800 justify-around items-center">
          <NavLink
            to={`/products/${product.id}`}
            className="text-xl text-white font-bold text-center px-3"
          >
            {product.name}
          </NavLink>
          <h4 className="bg-gray-800 text-gray-400 text-3xl">
            {product.price} €
          </h4>
          <p className="bg-gray-800 text-gray-400 text-sm">
            Disponibili: {product.quantity}
          </p>
          {publisher && (
            <NavLink to={`/accounts/${product.publisherId}`}>
              <img
                src={publisher.image}
                alt={publisher.displayName}
                className="my-1 h-12  rounded-full border-4 border-gray-900 hover:border-gray-200"
              />
            </NavLink>
          )}
        </div>
      </div>

      {/* --- SIDE PANEL --- */}
      <div className="flex h-1/12 justify-around items-center border py-1 rounded-b-xl">
        <input
          type="number"
          className="border rounded text-center text-white font-bold focus:border-teal-400"
          placeholder={`${selectedQuantity}`}
          onChange={(e) => {
            if (
              Number(e.target.value) <= product.quantity &&
              Number(e.target.value) >= 0
            )
              setSelectedQuantity(Number(e.target.value));
          }}
        />
        <button
          className="flex w-12 h-12 border rounded-full text-white justify-center items-center hover:bg-blue-500 hover:shadow p-3 my-2"
          onClick={addToCart}
        >
          <ShoppingCartIcon className="w-8 h-8 bg-transparent" />
        </button>
      </div>
      {showMessage && (
        <p className="text-white">Elemento aggiunto al carrello.</p>
      )}
      {navigateToSignIn && <Navigate to="/" />}
    </div>
  );
}
