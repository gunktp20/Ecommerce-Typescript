import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HandlerDirect, ProtectedRoute } from "./components";
import SharedLayout from "./pages/SharedLayout";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProductList from "./pages/ProductList/index.tsx";
import ManageProduct from "./pages/Admin/ManageProduct.tsx";
import AddProduct from "./pages/Admin/AddProduct.tsx";
import EditProduct from "./pages/Admin/EditProduct.tsx";
import RequireAdmin from "./components/RequireAdmin.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Landing />} />
          <Route path="product" element={<ProductList />} />
          <Route path="product/:product_id" />
          <Route path="cart" />
        </Route>
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <SharedLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<ManageProduct />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="product/:productID" element={<EditProduct />} />
        </Route>
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/home" element={<Landing />} />
        <Route
          path="/register"
          element={
            <HandlerDirect>
              <Register />
            </HandlerDirect>
          }
        />
        <Route
          path="/login"
          element={
            <HandlerDirect>
              <Login />
            </HandlerDirect>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
