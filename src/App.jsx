import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/cartContext';
import Home from '/src/pages/Home';
import Movies from '/src/pages/Movies';
import Cart from '/src/pages/Cart';
import Nav from '/src/components/Nav';
import Footer from '/src/components/Footer';

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