import * as React from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { db, fv, storage } from '../firebase';
import { Product, productConverter } from '../classes/Product';
import { Navigate, NavLink } from 'react-router-dom';

export function Products({ user }) {
  const query = db.collection('products').withConverter(productConverter);
  const [products] = useCollectionData<Product>(query);
  return (
    <div>
      <h1 className="text-gray-100 text-xl font-bold text-center py-2">
        Products Page
      </h1>
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
    <div className="bg-gray-500 p-2 rounded-lg m-2 flex justify-evenly">
      <div className="bg-gray-800 mr-4 border py-1 px-3 text-center rounded">
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
        <NavLink
          to={`/products/${product.id}`}
          className="text-xl text-white bg-transparent font-bold text-center px-3"
        >
          {product.name}
        </NavLink>
        <h4 className="bg-gray-800 text-gray-400 text-3xl">
          {product.price} €
        </h4>
        <p className="bg-gray-800 text-gray-400 text-sm">
          Disponibili: {product.quantity}
        </p>
      </div>
      <div className="flex flex-col border p-1 rounded">
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
