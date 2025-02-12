import { useState } from 'react';

const LoadMoreButton = ({ onLoadMore, disabled, maxMovies, currentCount }) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = async () => {
    if (currentCount >= maxMovies) return;
    setIsLoadingMore(true);
    try {
      await onLoadMore();
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="load-more__container">
      {isLoadingMore ? (
        <div className="load-more__loading">
          <div className="loading__spinner"></div>
          <p>Loading more movies...</p>
        </div>
      ) : (
        <button 
          className="load-more__btn" 
          onClick={handleLoadMore}
          disabled={disabled}
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default LoadMoreButton;
