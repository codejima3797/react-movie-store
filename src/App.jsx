import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/cartContext.jsx';
import Home from './pages/Home.jsx';
import Movies from './pages/Movies.jsx';
import Cart from './pages/Cart.jsx';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';

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