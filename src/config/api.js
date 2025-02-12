export const API_CONFIG = {
    KEY: "447acd47",
    BASE_URL: "https://www.omdbapi.com/",
    MOVIE_CATEGORIES: [
        ["action", "adventure", "thriller", "comedy", "drama", "horror", "sci-fi"],
        ["2023", "2022", "2021", "2020"],
        ["marvel", "disney", "pixar", "warner"],
        ["star", "lord", "king", "dark", "black", "red", "blue"],
    ],
};

export const CONTENT_RATINGS = {
    RESTRICTED: ["R", "NC-17", "TV-MA", "N/A", "Not Rated", "Unrated"],
    isRestricted: (rating) => CONTENT_RATINGS.RESTRICTED.includes(rating)
};
