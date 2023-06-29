import { DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_FORM_ACTIONS } from 'react';

export class Product {
  name: string;
  description: string;
  price: number;
  quantity: number;
  readonly id: string;
  image: string;
  category: string[];

  constructor(n, d, p, q, id, im, c) {
    this.name = n;
    this.price = p;
    this.description = d;
    this.quantity = q;
    this.id = id;
    this.image = im;
    this.category = c;
  }

  stringifyCategory() {
    return this.category.join('-');
  }

  static arrayfyStringedCategory(stringedCategory: string) {
    if (stringedCategory) return stringedCategory.split('-');
    return null;
  }
}
