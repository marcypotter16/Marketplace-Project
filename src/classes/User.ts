export class User {
  displayName: string;
  email: string;
  cart: [];
  uid: string;

  constructor(dn, e, c, uid) {
    this.displayName = dn;
    this.email = e;
    this.cart = c;
    this.uid = uid;
  }
}
