import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/cartContext.jsx';
import Home from './pages/home.jsx';
import Movies from './pages/movies.jsx';
import Cart from './pages/cart.jsx';
import Nav from './components/nav.jsx';
import Footer from './components/footer.jsx';

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