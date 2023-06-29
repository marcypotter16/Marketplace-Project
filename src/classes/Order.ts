export class Order {
  readonly id: string;
  requesterID: string;
  requestedID: string;
  cart: [];

  constructor(id, requesterID, requestedID, cart) {
    this.id = id;
    this.requesterID = requesterID;
    this.requestedID = requestedID;
    this.cart = cart;
  }
}

export const orderConverter = {
  toFirestore: (order: Order) => {
    return {
      requesterID: order.requesterID,
      requestedID: order.requestedID,
      cart: order.cart,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    const order = new Order(
      snapshot.id,
      data.requesterID,
      data.requestedID,
      data.cart
    );
    return order;
  },
};
