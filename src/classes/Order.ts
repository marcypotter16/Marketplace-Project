export class Order {
  readonly id: string;
  requesterID: string;
  cart: [];

  constructor(id, requesterID, cart) {
    this.id = id;
    this.requesterID = requesterID;
    this.cart = cart;
  }
}

export const orderConverter = {
  toFirestore: (order: Order) => {
    return {
      requesterID: order.requesterID,
      cart: order.cart,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    const order = new Order(snapshot.id, data.requesterID, data.cart);
    return order;
  },
};
