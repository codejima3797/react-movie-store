import React, { useState } from 'react';

const SearchBar = ({
    onSearch,
    onHideRestrictedChange,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [hideRestricted, setHideRestricted] = useState(false);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };
    
    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleSearch(event);
        }
    };

    const handleSearch = (event) => {
        event.preventDefault();
        onSearch(searchTerm);
    };

    const handleHideRestrictedToggle = () => {
        setHideRestricted(!hideRestricted);
        onHideRestrictedChange(!hideRestricted);
    };

    return (
        <section>
            <div className="search__container">
                <div className="search__bar">
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
                            <i className="fa-solid fa-magnifying-glass search__icon"></i>
                        </button>
                    </div>
                    <label className="rating__checkbox">
                        <input
                            type="checkbox"
                            checked={hideRestricted}
                            onChange={handleHideRestrictedToggle}
                        />
                        Hide Mature Content
                    </label>
                </div>
            </div>
        </section>
    );
};

export default SearchBar;
