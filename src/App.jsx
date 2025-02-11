import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/home";
import Movies from "./pages/movies";
import Cart from "./pages/cart";
import Nav from "./components/nav";
import Footer from "./components/footer";

function App() {
  return (
    <>
      <CartProvider>
        <Nav />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
          <Footer />
        </div>
      </CartProvider>
    </>
  );
}

export default App;
