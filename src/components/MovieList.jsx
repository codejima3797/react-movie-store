import MoviesHeader from "./MoviesHeader";
import MovieCard from "./MovieCard";
import LoadMoreButton from "./LoadMoreButton";
import LoadingState from "./LoadingState";
import { CONTENT_RATINGS } from "../config/api";

export default function MovieList({ movies, loading, error, hideRestricted, isSearchExecuted, handleSort, openModal, handleAddToCart, addedMovies, activeMovieId, handleMovieClick, loadMoreMovies }) {
    return (
        <section>
          <div className="movie__container">
            <div className="movie__row">
              <MoviesHeader 
                isSearchExecuted={isSearchExecuted}
                onSort={handleSort}
              />

              <hr className="movie__break--line" />

              <div className="movies__list">
                {loading ? (
                  <LoadingState />
                ) : error ? (
                  <div className="error-message">{error}</div>
                ) : movies.length > 0 ? (
                  movies.map((movie) => (
                    <MovieCard
                      key={movie.imdbID}
                      movie={movie}
                      isBlurred={hideRestricted && CONTENT_RATINGS.isRestricted(movie.Rated)}
                      openModal={openModal}
                      handleAddToCart={handleAddToCart}
                      addedMovies={addedMovies}
                      isActive={activeMovieId === movie.imdbID}
                      onMovieClick={handleMovieClick}
                    />
                  ))
                ) : (
                  <div className="no-results">No movies found</div>
                )}
              </div>

              {movies.length > 0 && movies.length < 50 && (
                <LoadMoreButton 
                  onLoadMore={loadMoreMovies}
                  disabled={loading}
                  maxMovies={50}
                  currentCount={movies.length}
                />
              )}
            </div>
          </div>
        </section>
    )
}
