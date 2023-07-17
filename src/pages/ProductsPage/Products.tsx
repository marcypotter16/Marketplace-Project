import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import { Product, productConverter } from "../../classes/Product";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { createContext, useEffect, useRef, useState } from "react";
import { collection, getDocs, limit, query, orderBy } from "firebase/firestore";
import { ProductCard } from "./ProductCard";
import {
	loadNext9Products,
	loadPrev9Products,
	queryProducts,
} from "./ProductsAuxFuncs";
import { v4 } from "uuid";
import { ArrowRightIcon } from "@heroicons/react/20/solid";

export var productsGlobal: React.Context<Product[]>;

export function Products({ user }) {
	// const [searchQuery, setSearchQuery] = useState("");
	const searchQueryRef = useRef<HTMLInputElement>(null);
	const [pageCount, setPageCount] = useState(1);
	const [lastDoc, setLastDoc] = useState(null);
	const [firstDoc, setFirstDoc] = useState(null);
	const [disableNext, setDisableNext] = useState(false);
	/* const [productsCount, setProductsCount] = useState(0);
	const [numPages, setNumPages] = useState(0); */
	/* const query = db
    .collection('products')
    .limit(9)
    .withConverter(productConverter); */
	/* const q = query(
		collection(db, "products"),
		limit(9),
		orderBy("publishDate", "desc")
	).withConverter(productConverter); */
	const q = query(
		collection(db, "products"),
		orderBy("name"),
		limit(9)
	).withConverter(productConverter);
	const [productsData] = useCollectionData<Product>(q);
	const [products, setProducts] = useState(productsData);
	productsGlobal = createContext(products);
	/* useEffect(() => {
		getDoc(doc(db, "products", "product-count")).then((snapshot) => {
			setProductsCount(snapshot.data().count);
			setNumPages(Math.ceil(snapshot.data().count / 9));
		});
	}, []); */
	useEffect(() => {
		getDocs(q).then((docSnapshots) => {
			if (docSnapshots.docs.length > 0) {
				setLastDoc(docSnapshots.docs[docSnapshots.docs.length - 1]);
				if (docSnapshots.docs.length < 9) {
					setDisableNext(true);
				} else {
					setDisableNext(false);
				}
				setFirstDoc(docSnapshots.docs[0]);
			} else {
				setDisableNext(true);
			}
			console.log(
				"lastDoc: ",
				lastDoc,
				"firstDoc: ",
				firstDoc,
				"disableNext: ",
				disableNext,
				"docSnapshots.docs.length: ",
				docSnapshots.docs.length
			);
		});
	}, [pageCount]);
	useEffect(() => {
		if (productsData) {
			setProducts(productsData);
		}
	}, [productsData]);
	return (
		<div className='relative flex flex-col items-center py-10 mx-2'>
			{/** PAGE COUNT */}
			<div className='flex justify-center items-center text-slate-400 text-sm absolute top-5 right-8'>
				<h4>Pagina {pageCount}</h4>
			</div>
			<h1 className='text-gray-100 text-3xl font-semibold text-center py-2'>
				La Piazza
			</h1>

			{/** SEARCH BAR */}
			<div className='flex'>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						queryProducts(searchQueryRef.current.value, setProducts);
					}}
					className='flex flex-nowrap w-full'
				>
					<input
						type='text'
						className='border rounded-l w-5/6 p-1 px-2 text-white'
						ref={searchQueryRef}
					/>
					<label htmlFor='search' className='sr-only text-sm text-slate-400'>
						Ricerca per nome
					</label>
					<button
						type='submit'
						className='bg-gray-500 flex items-center justify-center rounded-r px-3'
					>
						<MagnifyingGlassIcon className='w-4 h-4 bg-transparent' />
					</button>
				</form>
			</div>

			{/** PRODUCTS */}
			<div className='relative px-10 py-2 justify-around min-w-fit bg-slate-800 lg:grid lg:grid-cols-3 sm:flex sm:flex-col mx-20 my-5 rounded-3xl'>
				{products && products.length > 0 ? (
					products.map((product) => {
						return <ProductCard product={product} user={user} key={v4()} />;
					})
				) : (
					<h1 className='text-gray-100 bg-transparent text-3xl font-semibold text-center py-2'>
						Nessun prodotto trovato
					</h1>
				)}
			</div>

			{/** PAGINATION */}
			<div className='flex justify-center'>
				<button
					className='bg-slate-500 rounded px-3 py-1 mx-2 shadow-md disabled:opacity-30 disabled:shadow-none'
					onClick={() => {
						console.warn("clicked prev", firstDoc);

						loadPrev9Products(firstDoc, setProducts);
						setPageCount(pageCount - 1);
					}}
					disabled={pageCount === 1}
				>
					<ArrowRightIcon className='w-4 h-4 bg-transparent transform rotate-180' />
				</button>
				<button
					className='bg-gray-500 rounded px-3 py-1 shadow-md disabled:opacity-30 disabled:shadow-none'
					onClick={() => {
						console.warn("clicked next", lastDoc);

						loadNext9Products(lastDoc, setProducts);
						setPageCount(pageCount + 1);
					}}
					disabled={disableNext}
				>
					<ArrowRightIcon className='w-4 h-4 bg-transparent' />
				</button>
			</div>
		</div>
	);
}
