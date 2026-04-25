import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import Nak from "./pages/testNak";
import Logo from "./pages/Logo"

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/products/:id", element: <ProductDetails /> },
      { path: "/cart", element: <Cart /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "/testNak", element: <Nak/>},
      { path: "/logo" , element: <Logo/>},

      // ✅ Auth UI
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },

      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;