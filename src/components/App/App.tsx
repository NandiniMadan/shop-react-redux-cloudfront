import { Routes, Route } from "react-router-dom";
import MainLayout from "~/components/MainLayout/MainLayout";
import PageProductForm from "~/components/pages/PageProductForm/PageProductForm";
import PageOrders from "~/components/pages/PageOrders/PageOrders";
import PageOrder from "~/components/pages/PageOrder/PageOrder";
import PageProductImport from "~/components/pages/admin/PageProductImport/PageProductImport";
import PageCart from "~/components/pages/PageCart/PageCart";
import PageProducts from "~/components/pages/PageProducts/PageProducts";
import { Typography } from "@mui/material";
import SecureRoute from "~/components/SecureRoute/SecureRoute";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route
          path="/"
          element={
            <SecureRoute>
              <PageProducts />
            </SecureRoute>
          }
        />
        <Route
          path="cart"
          element={
            <SecureRoute>
              <PageCart />
            </SecureRoute>
          }
        />
        <Route path="admin/orders">
          <Route index element={<PageOrders />} />
          <Route path=":id" element={<PageOrder />} />
        </Route>
        <Route path="admin/products" element={<PageProductImport />} />
        <Route path="admin/product-form">
          <Route index element={<PageProductForm />} />
          <Route path=":id" element={<PageProductForm />} />
        </Route>
        <Route
          path="*"
          element={
            <Typography variant="h1" align="center">
              Page you are looking for does not exist
            </Typography>
          }
        />
      </Routes>
    </MainLayout>
  );
}

export default App;
