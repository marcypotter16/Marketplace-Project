import { useContext } from "react";
import { useParams } from "react-router-dom";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { User, userConverter } from "../classes/User";
import { doc } from "firebase/firestore";
import { db } from "../Utils/firebase.ts";
import { productsGlobal } from "../App";
import { ProductCard } from "./ProductsPage/ProductCard";

export function Account() {
	const params = useParams();
	const getUser = doc(db, "users", params.id).withConverter(userConverter);
	const [user, loading] = useDocumentData<User>(getUser);
	/* const getUserProducts = db
    .collection('products')
    .where('publisherId', '==', params.id)
    .withConverter(productConverter);
  const [products, productsLoading, productsError] =
    useCollectionData<Product>(getUserProducts); */

	// I AM THE GENIUS
	var products;
	if (productsGlobal) {
		products = useContext(productsGlobal);
	} else {
		// TODO
	}
	if (products == null) {
	}

	return (
		<div>
			{loading && <p>Loading...</p>}
			{user && (
				<div>
					<p>{user.displayName}</p>
					<img src={user.image} alt='Foto' />
				</div>
			)}
			<div className='flex flex-wrap min-w-fit lg:flex-row sm:flex-col mx-20 my-5 m-2 rounded border'>
				{products &&
					products
						.filter((p) => p.publisherId == params.id)
						.map((product) => (
							<ProductCard product={product} user={user} key={product.id} />
						))}
			</div>
		</div>
	);
}
