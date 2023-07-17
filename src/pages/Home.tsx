import { createContext, useEffect } from "react";
import { Product, productConverter } from "../classes/Product";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../Utils/firebase.ts";
import { NavLink } from "react-router-dom";

export function Home() {
	return (
		<div>
			<h1>Home Page</h1>
			<NavLink to='/signin'>Sign In</NavLink>
		</div>
	);
}
