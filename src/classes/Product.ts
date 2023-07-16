// import { DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_FORM_ACTIONS } from 'react';

export class Product {
  name: string;
  description: string;
  price: number;
  quantity: number;
  quantityType: 'kg' | 'g' | 'l' | 'ml' | 'pz';
  readonly id: string;
  image: string;
  category: string[];
  publisherId: string;
  photoURLs: string[];

  constructor(
    n = '',
    d = '',
    p = 0,
    q = 0,
    qtyType = '',
    id = '',
    im = '',
    c = [],
    pid = '',
    purls = []
  ) {
    this.name = n;
    this.price = p;
    this.description = d;
    this.quantity = q;
    this.quantityType = qtyType;
    this.id = id;
    this.image = im;
    this.category = c;
    this.publisherId = pid;
    this.photoURLs = purls;
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
      category: product.category,
      publisherId: product.publisherId,
      photoURLs: product.photoURLs,
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
        snapshot.id,
        data.image,
        data.category,
        data.publisherId,
        data.photoURLs
    );
  },
};
