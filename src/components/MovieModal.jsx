import { useState, useEffect } from 'react';
import MoviePrice from './MoviePrice';

const MovieModal = ({ movie, onClose, onAddToCart, addedMovies }) => {
  const [modalAddedToCart, setModalAddedToCart] = useState(false);

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  const handleAddToCart = (movie) => {
    onAddToCart(movie);
    setModalAddedToCart(true);
    setTimeout(() => setModalAddedToCart(false), 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <i className="fa-solid fa-times"></i>
        </button>
        <h2 className="modal-title">{movie.Title}</h2>
        <p className="modal-details">
          {movie.Year} • {movie.Rated}
        </p>
        <div className="modal-description">
          <p>{movie.Plot}</p>
        </div>
        <div className="modal-footer">
          <MoviePrice price={movie.price} />
          <button
            className={`modal-cart-btn ${modalAddedToCart ? "added" : ""}`}
            onClick={() => handleAddToCart(movie)}
          >
            {modalAddedToCart ? "Added to Cart!" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
