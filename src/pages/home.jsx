import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/style.css";
import homepage_img from "../Assets/homepage_img.webp";
import { useCart } from "../context/CartContext";

function Home() {
  const [arrowClicked, setArrowClicked] = useState(false);
  const { cartItems } = useCart();
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const aboutRef = useRef(null);

  const handleArrowClick = () => {
    setArrowClicked(true);
    setTimeout(() => {
      setArrowClicked(false);
    }, 300);
  };

  const scrollToAbout = (e) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about__section');
    if (aboutSection) {
      window.scrollTo({
        top: aboutSection.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // Check for pending scroll after component mounts
    const checkScroll = () => {
      if (localStorage.getItem('pendingScroll')) {
        localStorage.removeItem('pendingScroll');
        const aboutSection = document.getElementById("about__section");
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    // Wait for everything to be ready
    if (document.readyState === 'complete') {
      checkScroll();
    } else {
      window.addEventListener('load', checkScroll);
      return () => window.removeEventListener('load', checkScroll);
    }
  }, []);

  return (
      <div id="homepage__body">
        <section id="landing__page">
          <header>
              <div className="header__text">
                <h1 className="header__title">
                  Find and buy any of your favorites with ease!
                </h1>
                <h2 className="header__subtitle">Get started now</h2>
                <button className="header__browse--btn">
                  <Link className="browse__btn--anchor" to="/Movies">
                    <b>Browse Movies</b>
                    <span>
                      <i className="fa-solid fa-arrow-right"></i>
                    </span>
                  </Link>
                </button>
              </div>
              
              <div className="landing__img--wrapper">
                <img src={homepage_img} alt="" className="landing__img" />
              </div>

              <div 
                className="learn-more__wrapper" 
                onClick={scrollToAbout}
                style={{ cursor: 'pointer' }}
              >
                <span className="learn-more__text">Learn More</span>
                <i className="fa-solid fa-chevron-down learn-more__icon"></i>
              </div>
          </header>
        </section>

        <section id="about__section" ref={aboutRef}>
          <div className="about__container">
            <div className="about__row">
              <h2 className="about__title">About Us</h2>
              <p className="about__para">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam
                error nisi, sequi officiis officia fuga consectetur magnam
                corporis labore harum aut, inventore commodi. Consectetur quos,
                odio tempora commodi debitis vel, repellat placeat voluptate,
                ipsa corporis explicabo veniam ut! Deserunt debitis error
                officia consequuntur nisi animi, quasi nesciunt velit, facere,
                quas ratione! Mollitia suscipit quasi animi debitis nisi.
                Numquam quam pariatur saepe tenetur, reprehenderit magni.
                Ratione qui modi totam earum consequuntur dolorem obcaecati,
                repudiandae culpa veritatis, blanditiis, iure corporis quas
                itaque aperiam tenetur. Provident dolor eveniet culpa dolorum,
                cupiditate eum vitae voluptatum rerum, minima expedita ipsum
                placeat ullam pariatur quam at!
              </p>
                <br />
                <p className="about__para">
                Nulla iure accusantium esse corrupti error, sint deserunt sequi incidunt nam sed sunt reiciendis alias eligendi adipisci! Reiciendis veniam odit inventore exercitationem excepturi necessitatibus ipsum, in nemo voluptatem officiis at expedita illum culpa vero. Beatae perspiciatis ipsam laudantium sequi iure veritatis aliquam?
                </p>
            </div>
          </div>
        </section>

        <hr className="home__break--line" />

        <section id="feedback__section">
          <div className="feedback__container">
            <div className="feedback__row">
              <h2 className="feedback__title">Please share your feedback!</h2>
              <div className="feedback__wrapper">
                {!feedbackSent ? (
                  <>
                    <label>
                      We hope you're finding everything you need and are
                      enjoying your experience on our website. Feel free to send
                      us any feedback, whether it be any media that we should
                      add to our site, bugs, or anything else that could help
                      improve your experience!
                    </label>
                    <div className="feedback__textarea--wrapper">
                      <textarea
                        className="feedback__textarea"
                        placeholder="Your feedback here..."
                        onFocus={(e) => (e.target.placeholder = "")}
                        onBlur={(e) =>
                          (e.target.placeholder = "Your feedback here...")
                        }
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                      ></textarea>
                      <button
                        className="feedback__btn"
                        onClick={() => {
                          if (feedbackText.trim()) {
                            setFeedbackSent(true);
                          }
                        }}
                      >
                        Send
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="feedback__success">
                    <div className="feedback__success--message">
                      Thanks! Your message was sent.
                    </div>
                    <div className="feedback__success--icon">
                      <i className="fa-regular fa-circle-check"></i>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
  );
}


export default Home;
