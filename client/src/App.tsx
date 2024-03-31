import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components";
// import AdminPanel from "./pages/AdminPanel";
import SharedLayout from "./pages/SharedLayout";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";

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

        </Route>
        {/* <Route path="/register" element={<Register />} /> */}
        <Route index element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/admin" element={<AdminPanel />} /> */}
        {/* <Route
          path="/product"
          element={
            <ProtectedRoute>
              <ProductList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;
