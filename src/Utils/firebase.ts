import { initializeApp } from 'firebase/app';
import { getFirestore, FieldValue } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

initializeApp({
  apiKey: 'AIzaSyBv3LVTlzNV4PsXlYbT4Eg8Y24o7n4lhvY',

  authDomain: 'react-marketplace-b3171.firebaseapp.com',

  projectId: 'react-marketplace-b3171',

  storageBucket: 'react-marketplace-b3171.appspot.com',

  messagingSenderId: '320185275256',

  appId: '1:320185275256:web:39c6b5c8be3cab6fc32e8d',

  measurementId: 'G-MENL2CHTCE',
});

export const db = getFirestore();
export const auth = getAuth();
export const fv = FieldValue;
export const storage = getStorage();
// export const te = firebase.storage.TaskEvent;

/* function emptyCollection(collectionName) {
  db.collection(collectionName)
    .get()
    .then((docs) => {
      docs.forEach((doc) => {
        doc.ref.delete();
      });
    });
} */

// emptyCollection('products');
