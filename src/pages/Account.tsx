import React = require('react');
import { useParams } from 'react-router-dom';
import {
  useCollectionData,
  useDocumentData,
} from 'react-firebase-hooks/firestore';
import { User, userConverter } from '../classes/User';
import { db } from '../firebase';
import { Product, productConverter } from '../classes/Product';
import { ProductCard, productsGlobal } from './Products';

export function Account() {
  const params = useParams();
  const getUser = db
    .collection('users')
    .doc(params.id)
    .withConverter(userConverter);
  const [user, loading, error] = useDocumentData<User>(getUser);
  /* const getUserProducts = db
    .collection('products')
    .where('publisherId', '==', params.id)
    .withConverter(productConverter);
  const [products, productsLoading, productsError] =
    useCollectionData<Product>(getUserProducts); */

  // I AM THE GENIUS
  var products;
  if (productsGlobal) {
    products = React.useContext(productsGlobal);
  } else {
    // TODO
  }
  if (products == null) {
  }

  return (
    <div>
      {loading && <p>Loading...</p>}
      {user && (
        <div>
          <p>{user.displayName}</p>
          <img src={user.image} alt="Foto" />
        </div>
      )}
      <div className="flex flex-wrap min-w-fit lg:flex-row sm:flex-col mx-20 my-5 m-2 rounded border">
        {products &&
          products
            .filter((p) => p.publisherId == params.id)
            .map((product) => (
              <ProductCard product={product} user={user} key={product.id} />
            ))}
      </div>
    </div>
  );
}
