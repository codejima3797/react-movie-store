function MovieCard({ movie, hideRestricted, openModal, handleAddToCart, addedMovies, isActive, onMovieClick, isBlurred }) {
    
    const isRestricted = movie.Rated === 'R' || 
                        movie.Rated === 'NC-17' || 
                        movie.Rated === 'TV-MA' || 
                        movie.Rated === 'N/A' || 
                        movie.Rated === 'Not Rated' ||
                        movie.Rated === 'Unrated';
  
    return (
      <div 
        className={`movies ${isBlurred && isRestricted ? 'mature-content' : ''}`}
        onClick={() => onMovieClick(movie.imdbID)}
      >
        <div className={`movie__poster--wrapper ${isBlurred && isRestricted ? 'mature-content' : ''}`}>
          {movie.Poster !== "N/A" ? (
            <img 
              className={`movie__poster ${isBlurred && isRestricted ? 'mature-content' : ''}`} 
              src={movie.Poster} 
              alt="Movie poster" 
            />
          ) : (
            <div className="movie__poster no-poster">No image available</div>
          )}
          {/* Add favorite icon logic here */}

          <div className={`movie__hover-menu ${isActive ? 'active' : ''}`}>
            <div className="hover-menu__content">
              <h3 className="hover-menu__title">
                {movie.Title}
              </h3>
              <p className="hover-menu__details">
                ({movie.Year} • {movie.Rated})
              </p>
              <div className="hover-menu__buttons">
                <button
                  className="hover-menu__btn description-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(movie);
                  }}
                >
                  Description
                </button>
                <button
                  className={`hover-menu__btn cart-btn ${addedMovies.has(movie.imdbID) ? 'added' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(movie);
                  }}
                >
                  {addedMovies.has(movie.imdbID) ? (
                    <>
                      Added to Cart! <i className="fa-solid fa-check" style={{ color: '#5AC1F7' }}></i>
                    </>
                  ) : (
                    'Add to Cart'
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {isBlurred && isRestricted && (
            <div className="mature-content-overlay">
              <span>Mature Content</span>
            </div>
          )}
        </div>
        <p className="movie__title">
          <b>
            {movie.Title} 
          &nbsp;
            <span className="movie__year">
              ({movie.Year}{movie.Rated ? ` • ${movie.Rated}` : ''})
            </span>
          </b>
        </p>
      </div>
    );
}

export default MovieCard;