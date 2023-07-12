import React = require('react');
import { useParams } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { User, userConverter } from '../classes/User';
import { db } from '../firebase';

export function Account() {
  const params = useParams();
  const query = db
    .collection('users')
    .doc(params.id)
    .withConverter(userConverter);
  const [user, loading, error] = useDocumentData<User>(query);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {user && (
        <div>
          <p>{user.displayName}</p>
          <img src={user.image} alt="Foto" />
        </div>
      )}
    </div>
  );
}
