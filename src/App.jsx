import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/cartContext';
import Home from './pages/home';
import Movies from './pages/movies';
import Cart from './pages/cart';
import Footer from './components/footer';
import Nav from './components/nav';
function App() {
    return (
      <>
        <CartProvider>
          <Nav />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/cart" element={<Cart />} />
            </Routes>
        <Footer />
        </CartProvider>
      </>
    );
}

export default App;