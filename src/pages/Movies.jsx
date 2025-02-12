import { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { useClickOutside } from "../hooks/useClickOutside";
import SearchBar from "../components/SearchBar";
import MovieList from "../components/MovieList";
import MovieModal from "../components/MovieModal";
import { generateRandomPrice } from "../utils/priceUtils";
import { API_CONFIG, CONTENT_RATINGS } from "../config/api";
import "../styles/style.css";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [hideRestricted, setHideRestricted] = useState(false);
  const [isSearchExecuted, setIsSearchExecuted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useCart();
  const [addedMovies, setAddedMovies] = useState(new Set());
  const [activeMovieId, setActiveMovieId] = useState(null);
  const contactMenuRef = useRef(null);
  const initialLoadComplete = useRef(false);

  useClickOutside(contactMenuRef, () => {});

  useEffect(() => {
    if (!initialLoadComplete.current) {
      handleInitialLoad();
      initialLoadComplete.current = true;
    }
  }, []);

  const handleInitialLoad = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = [];
      let attempts = 0;
      const maxAttempts = 20;

      while (results.length < 10 && attempts < maxAttempts) {
        attempts++;
        const randomCategory =
          API_CONFIG.MOVIE_CATEGORIES[Math.floor(Math.random() * API_CONFIG.MOVIE_CATEGORIES.length)];
        const randomTerm =
          randomCategory[Math.floor(Math.random() * randomCategory.length)];

        console.log('Attempting with term:', randomTerm); // Debug log

        const response = await fetch(
          `${API_CONFIG.BASE_URL}?apikey=${API_CONFIG.KEY}&s=${randomTerm}&type=movie`
        );
        const data = await response.json();

        if (data.Response === "True") {
          for (let movie of data.Search) {
            if (!results.some(m => m.imdbID === movie.imdbID)) {
              const detailsResponse = await fetch(
                `${API_CONFIG.BASE_URL}?apikey=${API_CONFIG.KEY}&i=${movie.imdbID}`
              );
              const fullMovie = await detailsResponse.json();

              // Filter out restricted content for initial load
              if (!CONTENT_RATINGS.isRestricted(fullMovie.Rated)) {
                results.push({
                  ...fullMovie,
                  price: generateRandomPrice(),
                });
                if (results.length >= 10) break;
              }
            }
          }
        }
      }

      if (results.length > 0) {
        setMovies(results);
        setHasMore(true);
      } else {
        setError("No movies found. Please try again.");
      }
    } catch (error) {
      console.error("Error loading initial movies:", error);
      setError("Error loading movies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (newSortType) => {
    const sortedMovies = [...movies].sort((a, b) => {
      switch (newSortType) {
        case "NEWEST":
          return parseInt(b.Year) - parseInt(a.Year);
        case "OLDEST":
          return parseInt(a.Year) - parseInt(b.Year);
        case "A_TO_Z":
          return a.Title.localeCompare(b.Title);
        case "Z_TO_A":
          return b.Title.localeCompare(a.Title);
        default:
          return 0;
      }
    });

    setMovies(sortedMovies);
  };

  const loadMoreMovies = async () => {
    if (movies.length >= 50) return;
    setError(null);

    try {
      const results = [];
      let attempts = 0;
      const maxAttempts = 20;

      while (results.length < 10 && attempts < maxAttempts) {
        attempts++;
        
        if (isSearchExecuted) {
          // Search results logic
          const nextPage = Math.floor(movies.length / 10) + 1;
          const response = await fetch(
            `${API_CONFIG.BASE_URL}?apikey=${API_CONFIG.KEY}&s=${searchTerm}&page=${nextPage}&type=movie`
          );
          const data = await response.json();

          if (data.Response === "True") {
            for (let movie of data.Search) {
              if (!movies.some(m => m.imdbID === movie.imdbID) && 
                  !results.some(m => m.imdbID === movie.imdbID)) {
                const detailsResponse = await fetch(
                  `${API_CONFIG.BASE_URL}?apikey=${API_CONFIG.KEY}&i=${movie.imdbID}`
                );
                const fullMovie = await detailsResponse.json();
                results.push({
                  ...fullMovie,
                  price: generateRandomPrice(),
                });
                if (results.length >= 10) break;
              }
            }
          }
        } else {
          // Featured movies logic - use random categories like initial load
          const randomCategory =
            API_CONFIG.MOVIE_CATEGORIES[Math.floor(Math.random() * API_CONFIG.MOVIE_CATEGORIES.length)];
          const randomTerm =
            randomCategory[Math.floor(Math.random() * randomCategory.length)];

          const response = await fetch(
            `${API_CONFIG.BASE_URL}?apikey=${API_CONFIG.KEY}&s=${randomTerm}&type=movie`
          );
          const data = await response.json();

          if (data.Response === "True") {
            for (let movie of data.Search) {
              if (!movies.some(m => m.imdbID === movie.imdbID) && 
                  !results.some(m => m.imdbID === movie.imdbID)) {
                const detailsResponse = await fetch(
                  `${API_CONFIG.BASE_URL}?apikey=${API_CONFIG.KEY}&i=${movie.imdbID}`
                );
                const fullMovie = await detailsResponse.json();

                // Filter out restricted content for featured movies
                if (!CONTENT_RATINGS.isRestricted(fullMovie.Rated)) {
                  results.push({
                    ...fullMovie,
                    price: generateRandomPrice(),
                  });
                  if (results.length >= 10) break;
                }
              }
            }
          }
        }
      }

      if (results.length > 0) {
        setMovies(prevMovies => [...prevMovies, ...results]);
        setHasMore(prevMovies => prevMovies.length + results.length < 50);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more movies:", error);
      setError("Error loading more movies. Please try again.");
    }
  };

  const openModal = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setIsModalOpen(false);
  };

  const handleAddToCart = (movie) => {
    addToCart(movie);
    setAddedMovies((prev) => new Set(prev).add(movie.imdbID));
  };

  const handleMovieClick = (movieId) => {
    setActiveMovieId((prevId) => (prevId === movieId ? null : movieId));
  };

  const handleHideRestrictedChange = (hideRestricted) => {
    setHideRestricted(hideRestricted);
  };

  const handleSearchExecuted = (value) => {
    setIsSearchExecuted(value);
  };

  const handleSearchResultsChange = async (results) => {
    setLoading(true);
    setError(null);
    try {
      if (!results || results.length === 0) {
        setMovies([]);
        setHasMore(false);
        setIsSearchExecuted(true);
        setError("No movies found. Please try again.");
        return;
      }

      const moviesWithDetails = await Promise.all(
        results.map(async (movie) => {
          const detailsResponse = await fetch(
            `${API_CONFIG.BASE_URL}?apikey=${API_CONFIG.KEY}&i=${movie.imdbID}`
          );
          const fullMovie = await detailsResponse.json();
          return {
            ...fullMovie,
            price: generateRandomPrice(),
          };
        })
      );

      const validMovies = moviesWithDetails.filter(movie => movie.Response !== "False");
      
      if (validMovies.length > 0) {
        setMovies(validMovies);
        setHasMore(validMovies.length < 50);
        setIsSearchExecuted(true);
        setError(null);
      } else {
        setMovies([]);
        setHasMore(false);
        setError("No movies found. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
      setError("Error loading movies. Please try again.");
      setMovies([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchTerm) => {
    setLoading(true);
    setError(null);
    setIsSearchExecuted(true);
    
    if (!searchTerm.trim()) {
      getRandomMovies();
      return;
    }

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}?apikey=${API_CONFIG.KEY}&s=${searchTerm}&type=movie`
      );
      const data = await response.json();
      console.log('Search response:', data);

      if (data.Response === "True" && data.Search && data.Search.length > 0) {
        const detailedMovies = await Promise.all(
          data.Search.map(async (movie) => {
            const detailsResponse = await fetch(
              `${API_CONFIG.BASE_URL}?apikey=${API_CONFIG.KEY}&i=${movie.imdbID}`
            );
            const fullMovie = await detailsResponse.json();
            return {
              ...fullMovie,
              price: generateRandomPrice(),
            };
          })
        );

        const validMovies = detailedMovies.filter(movie => movie.Response !== "False");

        if (validMovies.length > 0) {
          setMovies(validMovies);
          setHasMore(validMovies.length < 50);
          setError(null);
        } else {
          setMovies([]);
          setError("No movies found");
        }
      } else {
        setMovies([]);
        setError("No movies found");
      }
    } catch (error) {
      console.error("Error searching movies:", error);
      setError("Error searching movies. Please try again.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const getRandomMovies = async () => {
    setLoading(true);
    setError(null);
    setIsSearchExecuted(false);
    
    try {
      const results = [];
      let attempts = 0;
      const maxAttempts = 20;

      while (results.length < 10 && attempts < maxAttempts) {
        attempts++;
        const randomCategory =
          API_CONFIG.MOVIE_CATEGORIES[Math.floor(Math.random() * API_CONFIG.MOVIE_CATEGORIES.length)];
        const randomTerm =
          randomCategory[Math.floor(Math.random() * randomCategory.length)];

        const response = await fetch(
          `${API_CONFIG.BASE_URL}?apikey=${API_CONFIG.KEY}&s=${randomTerm}&type=movie`
        );
        const data = await response.json();

        if (data.Response === "True") {
          for (let movie of data.Search) {
            const detailsResponse = await fetch(
              `${API_CONFIG.BASE_URL}?apikey=${API_CONFIG.KEY}&i=${movie.imdbID}`
            );
            const fullMovie = await detailsResponse.json();

            if (
              !CONTENT_RATINGS.isRestricted(fullMovie.Rated) &&
              !results.some((m) => m.imdbID === fullMovie.imdbID)
            ) {
              results.push({
                ...fullMovie,
                price: generateRandomPrice(),
              });
              if (results.length >= 10) break;
            }
          }
        }
      }

      setMovies(results);
    } catch (error) {
      console.error("Error loading movies:", error);
      setError("Error loading movies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="movies__body">
        <SearchBar
          onSearch={handleSearch}
          onHideRestrictedChange={handleHideRestrictedChange}
          onSearchExecuted={handleSearchExecuted}
          onSearchResultsChange={handleSearchResultsChange}
          onSearchTermChange={setSearchTerm}
        />
        <MovieList
          movies={movies}
          loading={loading}
          error={error}
          hideRestricted={hideRestricted}
          isSearchExecuted={isSearchExecuted}
          handleSort={handleSort}
          openModal={openModal}
          handleAddToCart={handleAddToCart}
          addedMovies={addedMovies}
          activeMovieId={activeMovieId}
          handleMovieClick={handleMovieClick}
          loadMoreMovies={loadMoreMovies}
        />
        <hr className="movies__footer--line" />
      </div>
      {isModalOpen && selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={closeModal}
          onAddToCart={handleAddToCart}
          addedMovies={addedMovies}
        />
      )}
    </>
  );
}

export default Movies;
