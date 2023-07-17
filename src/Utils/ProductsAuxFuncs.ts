import {collection, endBefore, getDocs, limit, orderBy, query, startAfter, where} from "firebase/firestore"
import { db } from "./firebase.ts"
import { Product, productConverter } from "../classes/Product.ts"
import {createContext, Dispatch, SetStateAction} from "react"
import { setProductsGlobal } from "../App.tsx"
import firebase from "firebase/compat";

export const queryProducts = ((queryString: string, setProductsData: Dispatch<SetStateAction<Product[]>>) => {
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
        setProductsGlobal(products)
    })
})

export const queryProductsByCategory = ((category: string, setProductsData: Dispatch<SetStateAction<Product[]>>) => {
    // TODO
})

export const queryProductsByPrice = ((minPrice: number, maxPrice: number, setProductsData: Dispatch<SetStateAction<Product[]>>) => {
    // TODO
})

export const queryProductsByLocation = ((location: { lat: number; lng: number }, setProductsData: Dispatch<SetStateAction<Product[]>>) => {
    // TODO
})

export const queryProductsByProvincia = ((provincia: string, setProductsData: Dispatch<SetStateAction<Product[]>>, setCurrentQuery) => {
    const queryPromise = query(collection(db, "products"), where("provincia", "==", provincia), orderBy('name'), limit(9)).withConverter(productConverter)
    getDocs(queryPromise).then((querySnapshot) => {
        const products: Product[] = []
        querySnapshot.forEach((doc) => {
            products.push(doc.data())
        })
        setProductsData(products)
        setCurrentQuery(queryPromise)
    })
})

export const loadNext9Products = ((lastProduct, setProductsData: Dispatch<SetStateAction<Product[]>>, currentQuery) => {
    // const queryPromise = query(collection(db, "products"), startAfter(lastProduct), limit(9)).withConverter(productConverter)
    const queryPromise = query(currentQuery, startAfter(lastProduct), limit(9)).withConverter(productConverter)
    getDocs(queryPromise).then((querySnapshot) => {
        const products: Product[] = []
        querySnapshot.forEach((doc) => {
            products.push(doc.data())
        })
        setProductsData(products)
        console.log(products)
    })
})

export const loadPrev9Products = ((firstProduct, setProductsData: Dispatch<SetStateAction<Product[]>>) => {
    const queryPromise = query(collection(db, "products"), endBefore(firstProduct), limit(9)).withConverter(productConverter)
    getDocs(queryPromise).then((querySnapshot) => {
        const products: Product[] = []
        querySnapshot.forEach((doc) => {
            products.push(doc.data())
        })
        setProductsData(products)
        console.log(products)
    })
})