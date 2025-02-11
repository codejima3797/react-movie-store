import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
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
                <Route path="/Movies" element={<Movies />} />
                <Route path="/Cart" element={<Cart />} />
            </Routes>
            <Footer />
        </CartProvider>
      </>
    );
}

export default App;