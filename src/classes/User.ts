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

export const userConverter = {
  toFirestore: (user: User) => {
    return {
      displayName: user.displayName,
      email: user.email,
      uid: user.uid,
      cart: user.cart,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    const user = new User(data.displayName, data.email, data.cart, snapshot.id);
    return user;
  },
};
