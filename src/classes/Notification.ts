// Una classe fatta per esprimere una notifica di ordine di un prodotto da parte di un compratore.
export class Request {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  buyerId: string;
  message: string;

  constructor(pid = '', pn = '', q = 0, up = 0, bid = '', msg = '') {
    this.productId = pid;
    this.productName = pn;
    this.quantity = q;
    this.unitPrice = up;
    this.buyerId = bid;
    this.message = msg;
  }
}

export const requestConverter = {
  toFirestore: (n: Request) => {
    return {
      productId: n.productId,
      productName: n.productName,
      quantity: n.quantity,
      unitPrice: n.unitPrice,
      buyerId: n.buyerId,
      message: n.message,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Request(
      data.productId,
      data.productName,
      data.quantity,
      data.unitPrice,
      data.buyerId,
      data.message
    );
  },
};
