import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import { Product, productConverter } from "../../classes/Product";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { createContext, useEffect, useRef, useState } from "react";
import { collection, limit, query } from "firebase/firestore";
import { ProductCard } from "./ProductCard";
import { queryProducts } from "./ProductsAuxFuncs";
import { v4 } from "uuid";

export var productsGlobal: React.Context<Product[]>;

export function Products({ user }) {
	const [searchQuery, setSearchQuery] = useState("");
	const searchQueryRef = useRef<HTMLInputElement>(null);
	/* const query = db
    .collection('products')
    .limit(9)
    .withConverter(productConverter); */
	const q = query(collection(db, "products"), limit(9)).withConverter(
		productConverter
	);
	const [productsData] = useCollectionData<Product>(q);
	const [products, setProducts] = useState(productsData);
	productsGlobal = createContext(products);
	useEffect(() => {
		if (productsData) {
			setProducts(
				productsData.filter((product) =>
					product.name.toLowerCase().match(searchQuery.toLowerCase())
				)
			);
		}
	}, [searchQuery, productsData]);
	return (
		<div className='flex flex-col items-center py-10 mx-2'>
			<h1 className='text-gray-100 text-3xl font-semibold text-center py-2'>
				La Piazza
			</h1>
			<div className='flex'>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						queryProducts(searchQueryRef.current.value, setProducts);
					}}
				>
					<input
						type='text'
						className='border rounded-l w-5/6 p-1 px-2 text-white'
						ref={searchQueryRef}
					/>
					<button
						type='submit'
						className='bg-gray-500 flex items-center justify-center rounded-r px-3'
					>
						<MagnifyingGlassIcon className='w-4 h-4 bg-transparent' />
					</button>
				</form>
			</div>
			<div className='relative px-10 py-2 flex flex-wrap justify-around min-w-fit bg-slate-800 lg:grid lg:grid-flow-col sm:flex-col mx-20 my-5 rounded-3xl'>
				{products &&
					products.map((product) => {
						return <ProductCard product={product} user={user} key={v4()} />;
					})}
			</div>
		</div>
	);
}
