export type CartItem = {
  id: string;
  productId: string;
  count: number;
};

export type Cart = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  items: CartItem[];
};