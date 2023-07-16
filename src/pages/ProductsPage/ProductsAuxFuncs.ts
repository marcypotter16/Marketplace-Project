import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../../firebase"
import { Product, productConverter } from "../../classes/Product"

export const queryProducts = ((queryString: string, setProductsData: React.Dispatch<React.SetStateAction<Product[]>>) => {
    // USE THIS IF YOU WANT A PARTIAL MATCH
    const queryPromise = query(collection(db, "products"), where("name", ">=", queryString), where("name", "<", queryString + "\uf8ff")).withConverter(productConverter)
    // USE THIS IF YOU WANT AN EXACT MATCH
    // const queryPromise = query(collection(db, "products"), where("name", "==", queryString)).withConverter(productConverter)
    getDocs(queryPromise).then((querySnapshot) => {
        const products: Product[] = []
        querySnapshot.forEach((doc) => {
            products.push(doc.data())
        })
        setProductsData(products)
        console.log(products)
    })
})