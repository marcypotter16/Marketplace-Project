import {productsGlobal} from "../../App.tsx";
import {ArrowPathIcon, MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {queryProducts} from "../../Utils/ProductsAuxFuncs.ts";
import {provincie} from "../../Utils/ProvincieLoader.ts";

export const ProductsTop = ({ pageCount, setRefreshProducts, refreshProducts, searchQueryRef, setProducts }) => {
	return (
		<>
		{/** PAGE COUNT */}
			<div className='flex justify-center items-center text-slate-400 text-sm absolute top-5 right-8'>
				<h4>Pagina {pageCount}</h4>
			</div>
			<h1 className='text-gray-100 text-3xl font-semibold text-center py-2'>
				La Piazza
			</h1>

			{/** REFRESH PRODUCTS */}
			<button
				className='absolute top-5 left-8 text-white'
				onClick={() => {
					setRefreshProducts(!refreshProducts);
					console.log("clicked refresh products");
					console.log("products global: ", productsGlobal);
				}}
			>
				<ArrowPathIcon className='w-4 h-4 bg-transparent' />
			</button>

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
					<button onClick={() => {console.log('provincie: ', provincie)}}>Print provincie</button>
				</form>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						queryProductsByProvincia(searchQueryRef.current.value, setProducts);
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
					<button onClick={() => {console.log('provincie: ', provincie)}}>Print provincie</button>
				</form>
			</div>
			</>
	)
}