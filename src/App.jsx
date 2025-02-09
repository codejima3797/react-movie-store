import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/cartContext';
import Home from './pages/home';
import Movies from './pages/movies';
import Cart from './pages/cart';

function App() {
    return (
        <CartProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/cart" element={<Cart />} />
            </Routes>
        </CartProvider>
    );
}

export default App;