import * as React from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { Link, NavLink, Route, Routes } from 'react-router-dom';
import { auth } from './firebase';
import { Account } from './pages/Account';
import { Cart } from './pages/Cart';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { Publish } from './pages/Publish';
import { SignIn } from './pages/SignIn';
import './style.css';

export default function App() {
  const [SignInWithGoogle, info, loading, error] = useSignInWithGoogle(auth);
  const signOut = () => {
    auth.signOut();
  };
  return (
    <>
      <div className="flex flex-row p-2 bg-blue-900 text-gray-400">
        <NavLink
          to="/products"
          className="px-2 hover:text-white hover:bg-blue-700 hover:shadow-xl rounded-md"
        >
          Products
        </NavLink>
        <NavLink
          to="/"
          className="px-2 hover:text-white hover:bg-blue-700 hover:shadow-xl rounded-md"
        >
          Home
        </NavLink>
        {info && (
          <>
            <button
              onClick={signOut}
              className="px-2 hover:text-white hover:bg-blue-700 hover:shadow-xl rounded-md"
            >
              Sign Out
            </button>
            <Link
              to={`/account/${info.user.uid}`}
              className="px-2 hover:text-white hover:bg-blue-700 hover:shadow-xl rounded-md"
            >
              Account
            </Link>

            <Link
              to={`/account/${info.user.uid}/cart`}
              className="px-2 hover:text-white hover:bg-blue-700 hover:shadow-xl rounded-md"
            >
              Cart
            </Link>

            <Link
              to={`/account/${info.user.uid}/publish`}
              className="px-2 hover:text-white hover:bg-blue-700 hover:shadow-xl rounded-md"
            >
              Publish
            </Link>
          </>
        )}
      </div>
      <main>
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
          <Route path="/account/:id/cart" element={<Cart />} />
          <Route path="/account/:id/publish" element={<Publish />} />
        </Routes>
      </main>
    </>
  );
}
