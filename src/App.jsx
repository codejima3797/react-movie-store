import { Routes, Route } from 'react-router-dom';
import "../styles/style.css";
import { CartProvider } from './context/cartContext';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Cart from './pages/Cart';
import Nav from '/src/components/Nav';
import Footer from './components/Footer';

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