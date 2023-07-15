import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { Product, productConverter } from '../classes/Product';
import { doc } from 'firebase/firestore';

export function ProductPage() {
  const params = useParams();
  /* const productRef = db
    .collection('products')
    .doc(params.id)
    .withConverter(productConverter); */
  const productRef = doc(db, 'products', params.id).withConverter(productConverter);  
  const [product, loading, error] = useDocumentData<Product>(productRef);

  return (
    <div className="">
      {loading && <h1>Loading...</h1>}
      {error && <h1>Error</h1>}
      {product && (
        <div className="px-2 py-20 text-white space-y-4">
          <p>{product.name}</p>
          <p>{product.description}</p>
          <p>{product.publisherId}</p>
        </div>
      )}
    </div>
  );
}
