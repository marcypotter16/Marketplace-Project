// import { DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_FORM_ACTIONS } from 'react';

import { GeoPoint } from "firebase/firestore";

export class Product {
  name: string;
  description: string;
  price: number;
  quantity: number;
  quantityType: string;
  location: { lat: number; lng: number};
  publishDate: Date;
  deleteAfterAWeek: boolean;
  readonly id: string;
  image: string;
  category: string[];
  publisherId: string;

  constructor(
    n = '',
    d = '',
    p = 0,
    q = 0,
    qtyType = 'pz',
    loc: { lat: number; lng: number} = { lat: 0, lng: 0 },
    pubDate = new Date(),
    delWeek = false,
    id = '',
    im = '',
    c = [],
    pid = '',
  ) {
    this.name = n;
    this.price = p;
    this.description = d;
    this.quantity = q;
    this.quantityType = qtyType;
    this.location = loc;
    this.publishDate = pubDate;
    this.deleteAfterAWeek = delWeek;
    this.id = id;
    this.image = im;
    this.category = c;
    this.publisherId = pid;
  }
}

export const productConverter = {
  toFirestore: (product: Product) => {
    return {
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      quantityType: product.quantityType,
      location: new GeoPoint(product.location.lat, product.location.lng),
      publishDate: product.publishDate,
      deleteAfterAWeek: product.deleteAfterAWeek,
      category: product.category,
      publisherId: product.publisherId,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Product(
        data.name,
        data.description,
        data.price,
        data.quantity,
        data.quantityType,
        data.location,
        data.publishDate,
        data.deleteAfterAWeek,
        snapshot.id,
        data.image,
        data.category,
        data.publisherId,
    );
  },
};
