import { Link } from "react-router-dom";

export default function LandingSection({ scrollToAbout }) {
  return (
    <div>
      <section id="landing__page">
        <header>
          <div className="header__text">
            <h1 className="header__title">
              Find and buy any of your favorites with ease!
            </h1>
            <h2 className="header__subtitle">Get started now</h2>
            <button className="header__browse--btn">
              <Link className="browse__btn--anchor" to="/movies">
                <b>Browse Movies</b>
                <span>
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
              </Link>
            </button>
          </div>

          <div className="landing__img--wrapper">
            <img 
              src="/assets/homepage_img.webp"
              alt="Homepage"
              className="landing__img"
            />
          </div>

          <div
            className="learn-more__wrapper"
            onClick={scrollToAbout}
            style={{ cursor: "pointer" }}
          >
            <span className="learn-more__text">Learn More</span>
            <i className="fa-solid fa-chevron-down learn-more__icon"></i>
          </div>
        </header>
      </section>
    </div>
  );
};
