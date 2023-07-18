import { initializeApp } from 'firebase/app';
import { getFirestore, FieldValue } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

initializeApp({
  // Your web app's Firebase configuration
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