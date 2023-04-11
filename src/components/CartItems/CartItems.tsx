import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { CartItem } from "~/models/CartItem";
import { formatAsPrice } from "~/utils/utils";
import AddProductToCart from "~/components/AddProductToCart/AddProductToCart";
import { useAvailableProducts } from "~/queries/products";

type CartItemsProps = {
  items: CartItem[];
  isEditable: boolean;
};

export default function CartItems({ items, isEditable }: CartItemsProps) {
  const { data: products = [] } = useAvailableProducts();

  const getProductPrice = (productId: string) => {
    return products.find((product) => product.id === productId)?.price || 0;
  };

  const totalPrice: number = items.reduce(
    (total, item) => item.count * getProductPrice(item.productId) + total,
    0
  );

  return (
    <>
      <List disablePadding>
        {items.map((cartItem: CartItem) => {
          const product = products.find(
            (product) => product.id === cartItem.productId
          );
          return (
            <ListItem
              sx={{ padding: (theme) => theme.spacing(1, 0) }}
              key={cartItem.productId}
            >
              {isEditable && product && <AddProductToCart product={product} />}
              <ListItemText
                primary={product?.title}
                secondary={product?.description}
              />
              <Typography variant="body2">
                {formatAsPrice(product?.price || 0)} x {cartItem.count} ={" "}
                {formatAsPrice((product?.price || 0) * cartItem.count)}
              </Typography>
            </ListItem>
          );
        })}
        <ListItem sx={{ padding: (theme) => theme.spacing(1, 0) }}>
          <ListItemText primary="Shipping" />
          <Typography variant="body2">Free</Typography>
        </ListItem>
        <ListItem sx={{ padding: (theme) => theme.spacing(1, 0) }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {formatAsPrice(totalPrice)}
          </Typography>
        </ListItem>
      </List>
    </>
  );
}
