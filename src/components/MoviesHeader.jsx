import { useState } from "react";

const MoviesHeader = ({ isSearchExecuted, onSort }) => {

        const [sortType, setSortType] = useState("");

        const handleSortChange = (event) => {
            const newSortType = event.target.value;
            setSortType(newSortType);
            onSort(newSortType);
          };

    return (
      <div className="movie__header">
        <h1 className="movie__header--title">
          {isSearchExecuted ? "Search Results" : "Featured"}
        </h1>
        <div className="filter__wrapper">
          <h4 className="filter__text">Sort by:</h4>
          <select id="filter" value={sortType} onChange={handleSortChange}>
            <option value="">Sort</option>
            <option value="NEWEST">Newest</option>
            <option value="OLDEST">Oldest</option>
            <option value="A_TO_Z">A-Z</option>
            <option value="Z_TO_A">Z-A</option>
          </select>
        </div>
      </div>
    );
  };
  
  export default MoviesHeader;