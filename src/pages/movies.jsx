import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import MovieCard from "../components/movieCard";
import "../styles/style.css";
import Home from "./home";
import Cart from "./cart";
import { useCart } from "../context/cartContext";
import FAQModal from '../components/FAQModal';
import { useClickOutside } from '../hooks/useClickOutside';

function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [hideRestricted, setHideRestricted] = useState(false);
  const [sortType, setSortType] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSearchExecuted, setIsSearchExecuted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const { addToCart, cartItems } = useCart();
  const [addedMovies, setAddedMovies] = useState(new Set());
  const [modalAddedToCart, setModalAddedToCart] = useState(false);
  const [isContactMenuOpen, setIsContactMenuOpen] = useState(false);
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  const [activeMovieId, setActiveMovieId] = useState(null);
  const contactMenuRef = useRef(null);
  const [searchResults, setSearchResults] = useState([]);

  const API_KEY = "447acd47";

  const movieCategories = [
    ["action", "adventure", "thriller", "comedy", "drama", "horror", "sci-fi"],
    ["2023", "2022", "2021", "2020"],
    ["marvel", "disney", "pixar", "warner"],
    ["star", "lord", "king", "dark", "black", "red", "blue"],
  ];

  const initialLoadComplete = useRef(false);

  const generateRandomPrice = () => {
    const min = 9;
    const max = 29;

    // Generate base price (whole number)
    const basePrice = Math.floor(Math.random() * (max - min + 1)) + min;

    // Array of possible cents
    const centOptions = [0, 5, 95, 99];
    const randomCents =
      centOptions[Math.floor(Math.random() * centOptions.length)];

    // Combine dollars and cents
    const originalPrice = (basePrice + randomCents / 100).toFixed(2);

    // 20% chance of being on sale
    const isOnSale = Math.random() < 0.2;

    if (isOnSale) {
      // Random discount between 5% and 20%
      const discountPercent = Math.random() * (20 - 5) + 5;
      let salePrice = originalPrice * (1 - discountPercent / 100);

      // Round sale price to nearest valid cents
      const saleDollars = Math.floor(salePrice);
      const saleCents = (salePrice - saleDollars) * 100;

      // Find the closest valid cents option
      const closestCents = centOptions.reduce((prev, curr) => {
        return Math.abs(curr - saleCents) < Math.abs(prev - saleCents)
          ? curr
          : prev;
      });

      salePrice = (saleDollars + closestCents / 100).toFixed(2);

      return {
        original: originalPrice,
        sale: salePrice,
        isOnSale: true,
      };
    }

    return {
      original: originalPrice,
      isOnSale: false,
    };
  };

  const getRandomMovies = useCallback(async () => {
    setIsSearchExecuted(false);
    setLoading(true);
    setError(null);
    try {
        const results = [];
        let attempts = 0;
        const maxAttempts = 20;

        while (results.length < 10 && attempts < maxAttempts) {
            attempts++;
            const randomCategory = movieCategories[Math.floor(Math.random() * movieCategories.length)];
            const randomTerm = randomCategory[Math.floor(Math.random() * randomCategory.length)];

            const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${randomTerm}&type=movie`);
            const data = await response.json();

            if (data.Response === "True") {
                for (let movie of data.Search) {
                    const detailsResponse = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`);
                    const fullMovie = await detailsResponse.json();

                    // Filter out mature content for featured movies
                    if (!isRestrictedContent(fullMovie.Rated) && 
                        !results.some((m) => m.imdbID === fullMovie.imdbID)) {
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
        setHasMore(true);
    } catch (error) {
        console.error("Error loading movies:", error);
        setError("Error loading movies. Please try again.");
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialLoadComplete.current) {
      getRandomMovies();
      initialLoadComplete.current = true;
    }
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isModalOpen]);

  useClickOutside(contactMenuRef, setIsContactMenuOpen);

  const isRestrictedContent = (rating) => {
    return (
      rating === "R" ||
      rating === "NC-17" ||
      rating === "TV-MA" ||
      rating === "N/A" ||
      rating === "Not Rated" ||
      rating === "Unrated"
    );
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch(event);
    }
  };

  const handleSort = (event) => {
    const newSortType = event.target.value;
    setSortType(newSortType);

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

  const toggleFavorite = (movieId) => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const isFavorited = favorites.includes(movieId);

    if (isFavorited) {
      favorites = favorites.filter((id) => id !== movieId);
    } else {
      favorites.push(movieId);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    setMovies([...movies]);
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!searchTerm.trim()) {
        setSearchResults([]);  // Clear search results
        getRandomMovies();     // Reset to random movies
        return;
    }

    setLoading(true);
    setError(null);
    setIsSearchExecuted(true);

    try {
        const response = await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}&type=movie`
        );
        const data = await response.json();

        if (data.Response === "True") {
            const detailedMovies = await Promise.all(
                data.Search.map(async (movie) => {
                    const detailsResponse = await fetch(
                        `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`
                    );
                    const fullMovie = await detailsResponse.json();
                    return {
                        ...fullMovie,
                        price: generateRandomPrice(),
                    };
                })
            );
            setSearchResults(detailedMovies);  // Store in search results
            setMovies(detailedMovies);         // Update displayed movies
        } else {
            setSearchResults([]);
            setMovies([]);
            setError("No movies found");
        }
    } catch (error) {
        console.error("Error searching movies:", error);
        setError("Error searching movies. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  const loadMoreMovies = async () => {
    if (movies.length >= 50) return;
    setIsLoadingMore(true);

    try {
        const results = [];
        if (searchTerm) {
            // Search results logic - keep as is
            const nextPage = Math.floor(movies.length / 10) + 1;
            const response = await fetch(
                `https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}&page=${nextPage}&type=movie`
            );
            const data = await response.json();

            if (data.Response === "True") {
                for (let movie of data.Search) {
                    if (movies.some((m) => m.imdbID === movie.imdbID)) continue;

                    const detailsResponse = await fetch(
                        `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`
                    );
                    const fullMovie = await detailsResponse.json();

                    results.push({
                        ...fullMovie,
                        price: generateRandomPrice(),
                    });
                    if (results.length >= 10) break;
                }
            }
        } else {
            // Featured movies logic - always filter restricted content
            let attempts = 0;
            const maxAttempts = 20;

            while (results.length < 10 && attempts < maxAttempts) {
                attempts++;
                const randomCategory =
                    movieCategories[Math.floor(Math.random() * movieCategories.length)];
                const randomTerm =
                    randomCategory[Math.floor(Math.random() * randomCategory.length)];

                const response = await fetch(
                    `https://www.omdbapi.com/?apikey=${API_KEY}&s=${randomTerm}&type=movie`
                );
                const data = await response.json();

                if (data.Response === "True") {
                    for (let movie of data.Search) {
                        if (movies.some((m) => m.imdbID === movie.imdbID)) continue;

                        const detailsResponse = await fetch(
                            `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`
                        );
                        const fullMovie = await detailsResponse.json();

                        // Only add non-restricted movies for Featured section
                        if (
                            !isRestrictedContent(fullMovie.Rated) &&
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
        }

        setMovies((prevMovies) => [...prevMovies, ...results]);
        setHasMore(movies.length + results.length < 50);
    } catch (error) {
        console.error("Error loading more movies:", error);
        setError("Error loading more movies. Please try again.");
    } finally {
        setIsLoadingMore(false);
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
    setAddedMovies(prev => new Set(prev).add(movie.imdbID));
    if (isModalOpen) {
        setModalAddedToCart(true);
        setTimeout(() => setModalAddedToCart(false), 2000); // Hide after 2 seconds
    }
  };

  const handleMovieClick = (movieId) => {
    setActiveMovieId(prevId => prevId === movieId ? null : movieId);
  };

  const handleHideRestrictedToggle = () => {
    setHideRestricted(!hideRestricted);
  };

  const filteredMovies = isSearchExecuted ? searchResults : movies;

  const sortedAndFilteredMovies = [...filteredMovies].sort((a, b) => {
    switch (sortType) {
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

  return (
    <>
      <nav className="nav">
      <div className="nav__logo--wrapper movie__nav--logo">
        <Link to="/">JMDB</Link>
      </div>
        <div className="nav__links">
          <Link to="/" className="nav__link">
            <div className="nav__link--wrapper">
              <i className="fa-solid fa-house"></i>
              <span className="nav__link--text">Home</span>
            </div>
          </Link>
          <Link to="/cart" className="nav__link">
            <div className="nav__link--wrapper">
              <div className="icon-wrapper">
                <i className="fa-solid fa-cart-shopping"></i>
                {cartItems.length > 0 && (
                  <span className="cart-badge">{cartItems.length}</span>
                )}
              </div>
              <span className="nav__link--text cart__link--text">Cart</span>
            </div>
          </Link>
        </div>
      </nav>

      <div lang="en">
        <div className="movies__body">
          <section>
            <div className="nav__search--container">
              <div className="search__container">
                <div className="search__bar--container">
                  <div className="search__wrapper">
                    <input
                      className="search__bar--input"
                      type="text"
                      placeholder="Search..."
                      onChange={handleSearchChange}
                      onKeyUp={handleKeyPress}
                      value={searchTerm}
                    />
                    <button className="search__bar--btn" onClick={handleSearch}>
                      <i className="fa-solid fa-magnifying-glass search__page--icon"></i>
                    </button>
                  </div>
                  <label className="rating-checkbox">
                    <input
                      type="checkbox"
                      id="rating-filter"
                      checked={hideRestricted}
                      onChange={handleHideRestrictedToggle}
                    />
                    Hide Mature Content
                  </label>
                </div>
              </div>
            </div>
          </section>
          <section>
            <div className="container">
              <div className="row">
                <div className="movie__header">
                  <h1 className="movie__header--title search-results-heading">
                    {isSearchExecuted ? "Search Results" : "Featured"}
                  </h1>
                  <div className="filter__wrapper">
                    <h4 className="filter__text">Sort by:</h4>
                    <select id="filter" value={sortType} onChange={handleSort}>
                      <option value="">Sort</option>
                      <option value="NEWEST">Newest</option>
                      <option value="OLDEST">Oldest</option>
                      <option value="A_TO_Z">A-Z</option>
                      <option value="Z_TO_A">Z-A</option>
                    </select>
                  </div>
                </div>
                <hr className="movie__break--line" />
                <div className="loading-state" style={{ display: "none" }}>
                  <div className="loading-spinner"></div>
                  <p className="loading-text">Loading movies...</p>
                </div>
                <div className="movies__list">
                  {loading ? (
                    <div className="loading-state">
                      <div className="loading-spinner"></div>
                      <p className="loading-text">Loading movies...</p>
                    </div>
                  ) : error ? (
                    <div className="error-message">{error}</div>
                  ) : sortedAndFilteredMovies.length > 0 ? (
                    sortedAndFilteredMovies.map((movie) => {
                      return (
                        <MovieCard
                          key={movie.imdbID}
                          movie={movie}
                          isBlurred={hideRestricted && isRestrictedContent(movie.Rated)}
                          openModal={openModal}
                          handleAddToCart={handleAddToCart}
                          addedMovies={addedMovies}
                          isActive={activeMovieId === movie.imdbID}
                          onMovieClick={handleMovieClick}
                        />
                      );
                    })
                  ) : (
                    <div className="no-results">No movies found</div>
                  )}
                </div>
                {sortedAndFilteredMovies.length > 0 && sortedAndFilteredMovies.length < 50 && (
                  <div className="load-more-container">
                    {isLoadingMore ? (
                      <div className="load-more-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading more movies...</p>
                      </div>
                    ) : (
                      <button
                        className="load-more-btn"
                        onClick={loadMoreMovies}
                      >
                        Load More
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
          <hr className="movies__footer--line" />
          <footer className="footer__container">
            <div className="footer__wrapper">
                <div className="return__links--wrapper">
                    <h3 className="footer__return--top">
                        <a 
                            className="footer__return--anchor" 
                            onClick={(e) => {
                                e.preventDefault();
                                window.scrollTo({
                                    top: 0,
                                    behavior: 'smooth'
                                });
                            }}
                            href="#"
                        >
                            Return to Top
                        </a>
                    </h3>
                    <div className="footer__links--wrapper">
                        <Link 
                            to="/" 
                            className="footer__link"
                            onClick={(e) => {
                                e.preventDefault();
                                setTimeout(() => {
                                    document.getElementById('about__section').scrollIntoView({ 
                                        behavior: 'smooth' 
                                    });
                                }, 100);
                            }}
                        >
                            About
                        </Link>
                        <Link 
                            to="#" 
                            className="footer__link" 
                            onClick={(e) => {
                                e.preventDefault();
                                setIsFAQModalOpen(true);
                            }}
                        >
                            FAQ
                        </Link>
                        <div className="footer__link--contact" onClick={(e) => {
                            e.stopPropagation();
                            setIsContactMenuOpen(!isContactMenuOpen);
                        }}>
                            <span className="footer__link">Contact</span>
                            {isContactMenuOpen && (
                                <div 
                                    ref={contactMenuRef}
                                    className="contact-menu active"
                                >
                                    <div className="contact-menu__item">
                                        <span className="contact-menu__label">phone:</span>
                                        <span>(214) 519-3525</span>
                                    </div>
                                    <div className="contact-menu__item">
                                        <span className="contact-menu__label">email:</span>
                                        <span>jgray3797@gmail.com</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer__logo">
                <Link 
                    to="/" 
                    onClick={() => {
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    }}
                >
                    JMDB
                </Link>
            </div>
        </footer>
        </div>
        {isModalOpen && selectedMovie && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="modal-close" onClick={closeModal}>
                <i className="fa-solid fa-times"></i>
              </button>
              <h2 className="modal-title">{selectedMovie.Title}</h2>
              <p className="modal-details">
                {selectedMovie.Year} • {selectedMovie.Rated}
              </p>
              <div className="modal-description">
                <p>{selectedMovie.Plot}</p>
              </div>
              <div className="modal-footer">
                <span className="modal-price">
                    {selectedMovie.price.isOnSale ? (
                        <>
                            <span className="original-price">
                                ${selectedMovie.price.original}
                            </span>
                            <span className="sale-price">
                                ${selectedMovie.price.sale}
                            </span>
                        </>
                    ) : (
                        `$${selectedMovie.price.original}`
                    )}
                </span>
                <button
                    className={`modal-cart-btn ${addedMovies.has(selectedMovie.imdbID) ? 'added' : ''}`}
                    onClick={() => handleAddToCart(selectedMovie)}
                >
                    {addedMovies.has(selectedMovie.imdbID) ? 'Added to Cart!' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <FAQModal isOpen={isFAQModalOpen} onClose={() => setIsFAQModalOpen(false)} />
    </>
  );
}

export default Movies;
