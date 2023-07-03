import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { Product } from './classes/Product';
import { User } from './classes/User';

firebase.initializeApp({
  apiKey: 'AIzaSyBv3LVTlzNV4PsXlYbT4Eg8Y24o7n4lhvY',

  authDomain: 'react-marketplace-b3171.firebaseapp.com',

  projectId: 'react-marketplace-b3171',

  storageBucket: 'react-marketplace-b3171.appspot.com',

  messagingSenderId: '320185275256',

  appId: '1:320185275256:web:39c6b5c8be3cab6fc32e8d',

  measurementId: 'G-MENL2CHTCE',
});

export const db = firebase.firestore();
export const auth = firebase.auth();
export const fv = firebase.firestore.FieldValue;

function emptyCollection(collectionName) {
  db.collection(collectionName)
    .get()
    .then((docs) => {
      docs.forEach((doc) => {
        doc.ref.delete();
      });
    });
}

// emptyCollection('orders');
