import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

firebase.initializeApp({
  // Your keys
});

export const db = firebase.firestore();
export const auth = firebase.auth();
export const fv = firebase.firestore.FieldValue;
export const storage = firebase.storage();
export const te = firebase.storage.TaskEvent;

function emptyCollection(collectionName) {
  db.collection(collectionName)
    .get()
    .then((docs) => {
      docs.forEach((doc) => {
        doc.ref.delete();
      });
    });
}

// emptyCollection('products');
