import React = require('react');
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { Product, productConverter } from '../classes/Product';

export function ProductPage() {
  const productId = useParams();
  const productRef = db
    .collection('products')
    .withConverter(productConverter)
    .doc(productId);
  cosnt[(product, loading, error)] = useDocumentData<Product>(productRef);

  return (
    <div>
      <h1>{product && product.name}</h1>
    </div>
  );
}
