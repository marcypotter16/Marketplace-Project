import * as React from 'react';
import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { Link, Route, Routes } from 'react-router-dom';
import { auth } from './firebase';
import { Account } from './pages/Account';
import { Cart } from './pages/Cart';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { SignIn } from './pages/SignIn';
import './style.css';

export default function App() {
  const [SignInWithGoogle, info, loading, error] = useSignInWithGoogle(auth);
  const signOut = () => {
    auth.signOut();
  };
  return (
    <>
      <div>
        <ul>
          <li>
            <Link to="/products">Products</Link>
          </li>
          <li>
            <Link to="/">Home</Link>
          </li>
          {info && (
            <>
              <li>
                <button onClick={signOut}>Sign Out</button>
              </li>
              <li>
                <Link to={`/account/${info.user.uid}`}>Account</Link>
              </li>
              <li>
                <Link to={`/account/${info.user.uid}/cart`}>Cart</Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            info ? <Home /> : <SignIn signInWithGoogle={SignInWithGoogle} />
          }
        />
        <Route
          path="/products"
          element={<Products user={info ? info.user : null} />}
        />
        <Route
          path="/account/:id"
          element={<Account user={info ? info.user : null} />}
        />
        <Route
          path="/account/:id/cart"
          element={<Cart />}
        />
      </Routes>
    </>
  );
}
