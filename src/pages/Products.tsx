import {
  useCollectionData,
  useDocumentData,
} from 'react-firebase-hooks/firestore';
import { db, storage } from '../firebase';
import { Product, productConverter } from '../classes/Product';
import { User, userConverter } from '../classes/User';
import { NavLink, Navigate } from 'react-router-dom';
import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { v4 } from 'uuid';
import { createContext, useEffect, useState } from 'react';
import { arrayUnion, collection, doc, limit, query, updateDoc } from 'firebase/firestore';
import { getDownloadURL, list, ref } from 'firebase/storage';

export var productsGlobal: React.Context<Product[]>;

export function Products({ user }) {
  const [searchQuery, setSearchQuery] = useState('');
  /* const query = db
    .collection('products')
    .limit(9)
    .withConverter(productConverter); */
  const q = query(collection(db, 'products'), limit(9)).withConverter(productConverter);
  const [productsData] = useCollectionData<Product>(q);
  const [products, setProducts] = useState(productsData);
  productsGlobal = createContext(products);
  useEffect(() => {
    if (productsData) {
      setProducts(
        productsData.filter((product) =>
          product.name.toLowerCase().match(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, productsData]);
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
      <div className="relative px-10 py-2 flex flex-wrap justify-around min-w-fit bg-slate-800 lg:grid lg:grid-flow-col sm:flex-col mx-20 my-5 rounded-3xl">
        {/*<div id="cerchio-1" className='absolute border w-96 h-96 top-40 left-2 rounded-full bg-purple-600 mix-blend-multiply'>
          </div>
        <div id="cerchio-2" className='absolute w-64 h-64 top-0 left-0 rounded-full blur-xl bg-orange-500 mix-blend-multiply'></div>
        <div id="cerchio-3" className='absolute w-80 h-80 top-2 right-0 blur-xl rounded-full bg-yellow-400 mix-blend-multiply'></div> */}
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
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [navigateToSignIn, setNavigateToSignIn] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [imageURLs, setImageURLs] = useState([]);

  /* const query = db
    .collection('users')
    .doc(product.publisherId)
    .withConverter(userConverter); */
  const publisherRef = doc(db, 'users', product.publisherId).withConverter(userConverter);
  const [publisher, loading, error] = useDocumentData<User>(publisherRef);
  console.warn(loading, error)
  const today = new Date();
  useEffect(() => {
    const imageRef = ref(storage,
      `${today.getFullYear()}/${product.publisherId}/${product.id}`
    );
    list(imageRef, { maxResults: 1 }).then((images) => {
      images.items.forEach((image) => {
          getDownloadURL(image)
          .then((url) => setImageURLs((prev) => [...prev, url]));
      });
    });
  }, []);
  function addToCart() {
    if (user) {
      /* db.collection('users')
        .doc(user.uid)
        .update({
          cart: arrayUnion({
            id: product.id,
            name: product.name,
            quantity: selectedQuantity,
            publisherId: product.publisherId,
            price: product.price,
          }),
        }) */
        updateDoc(doc(db, 'users', user.uid), {
          cart: arrayUnion({
            id: product.id,
            name: product.name,
            quantity: selectedQuantity,
            publisherId: product.publisherId,
            price: product.price,
          }),
        })
        .then((_res) => {
          setShowMessage(true);
          console.log(showMessage);
        });
    } else {
      alert('Devi prima effettuare il login.');
      setNavigateToSignIn(true);
    }
  }
  return (
    // Container

    <div className="flex flex-col border-white relative w-64 h-56 bg-transparent rounded-3xl mx-4 mt-2 mb-4 shadow-2xl shadow-zinc-950">
      <NavLink to={`/products/${product.id}`} className={"flex-1"}>
        <div className="rounded-3xl bg-gray-800 text-center basis-1/2">
          {imageURLs && (
            <div className='bg-transparent'>
              {imageURLs.map((url) => (
                  <img
                    src={url}
                    className="h-28 w-full brightness-[.8] object-contain rounded-t-3xl mb-1 hover:brightness-100 transition duration-500 ease-in-out"
                    alt={product.name}
                    key={v4()}
                  />
              ))}
            </div>
          )}
          <div className="flex flex-col bg-slate-700 justify-around items-center">
            <p className="text-white font-semibold text-xl bg-inherit px-2">
              {product.name}
            </p>
            <div className="flex items-center bg-inherit gap-x-4">
              <h4 className="bg-inherit text-gray-200 md:text-3xl">
                {product.price} €
              </h4>
              <p className="bg-inherit text-gray-400 text-sm pr-2">
                Disponibili: {product.quantity} {product.quantityType}
              </p>
            </div>
          </div>
        </div>
      </NavLink>

      {/** USER ICON */}
      <div className="absolute -top-3 -left-3 flex-none flex justify-center items-center w-12 h-12 rounded-full 
      bg-gradient-to-tr from-yellow-400 to-red-700 transform hover:scale-150 transition ease-in-out duration-200
      ">
        {publisher && (
          <NavLink
            to={`/accounts/${product.publisherId}`}
            className="flex-none"
          >
            <img
              src={publisher.image}
              alt={publisher.displayName}
              className="h-10 w-10 rounded-full border-4 border-gray-900 transform transition duration-200 ease-in-out hover:rotate-12"
            />
          </NavLink>
        )}
      </div>

      {/* --- SIDE PANEL --- */}
      <div className="flex-1 flex bg-slate-600 justify-around items-center py-1 rounded-b-xl">
        <input
          type="number"
          step={product.quantityType === 'kg' ? '0.01' : '1'}
          className="border rounded text-center text-white shadow-xl font-bold mx-2 w-16 bg-transparent"
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
          className="flex border border-slate-400 shadow rounded-full text-white justify-center items-center hover:bg-sky-500 hover:shadow-xl p-1 transition ease-in-out duration-200  hover:drop-shadow-2xl hover:ring-2 hover:ring-sky-700 hover:ring-offset-2 hover:ring-opacity-50"
          onClick={addToCart}
        >
          <ShoppingCartIcon className="w-5 h-5 bg-transparent" />
        </button>
      </div>
      {/* <div className='flex-1 bg-transparent'>
      {showMessage && (
        <p className="text-white">Elemento aggiunto al carrello.</p>
      )}
      {navigateToSignIn && <Navigate to="/" />}
      </div> */}
      {navigateToSignIn && <Navigate to="/" />}
    </div>
  );
}
