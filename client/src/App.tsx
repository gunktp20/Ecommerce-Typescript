import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HandlerDirect, ProtectedRoute } from "./components";
// import AdminPanel from "./pages/AdminPanel";
import SharedLayout from "./pages/SharedLayout";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useAppSelector } from "./app/hook";

function App() {

  const authStorage = useAppSelector(state => state.auth)

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
          <Route index element={<Landing/>}/>
        </Route>
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/home" element={<Landing />} />
        <Route path="/register" element={
          <HandlerDirect>
            <Register />
          </HandlerDirect>
        } />
        <Route path="/login" element={<HandlerDirect>
          <Login />
        </HandlerDirect>} />
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
