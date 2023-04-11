import Typography from "@mui/material/Typography";
import { Product } from "~/models/Product";
import CartIcon from "@mui/icons-material/ShoppingCart";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import { useCart, useInvalidateCart, useUpsertCart } from "~/queries/cart";
import { AxiosError } from "axios";
import { useRef, useState } from "react";
import LoginModal from "~/components/LoginModal/LoginModal";

type AddProductToCartProps = {
  product: Product;
};

export default function AddProductToCart({ product }: AddProductToCartProps) {
  const { data = [], isFetching } = useCart();
  const { mutate: upsertCart } = useUpsertCart();
  const invalidateCart = useInvalidateCart();
  const [loginModalOpened, setLoginModalOpened] = useState(false);
  const actionRepeaterRef = useRef<() => void>();

  const cartItem = data.find(({ productId }) => productId === product.id);

  const handleError = (repeater: () => void) => (error: AxiosError) => {
    if (error.response?.status && [401, 403].includes(error.response?.status)) {
      actionRepeaterRef.current = repeater;
      setLoginModalOpened(true);
    }
  };

  const addProduct = () => {
    upsertCart(
      { productId: product.id, count: cartItem ? cartItem.count + 1 : 1 },
      { onSuccess: invalidateCart, onError: handleError(addProduct) }
    );
  };

  const removeProduct = () => {
    if (cartItem) {
      upsertCart(
        { ...cartItem, count: cartItem.count - 1 },
        { onSuccess: invalidateCart }
      );
    }
  };

  const handleLoginModalClose = () => {
    setLoginModalOpened(false);
  };

  const handleLoginSuccess = () => {
    if (actionRepeaterRef.current) {
      actionRepeaterRef.current();
      actionRepeaterRef.current = undefined;
    }
  };

  return (
    <>
      {cartItem ? (
        <>
          <IconButton
            disabled={isFetching}
            onClick={removeProduct}
            size="large"
          >
            <Remove color={"secondary"} />
          </IconButton>
          <Typography align="center">{cartItem.count}</Typography>
          <IconButton disabled={isFetching} onClick={addProduct} size="large">
            <Add color={"secondary"} />
          </IconButton>
        </>
      ) : (
        <IconButton disabled={isFetching} onClick={addProduct} size="large">
          <CartIcon color={"secondary"} />
        </IconButton>
      )}
      <LoginModal
        open={loginModalOpened}
        onClose={handleLoginModalClose}
        onLogin={handleLoginSuccess}
      />
    </>
  );
}
