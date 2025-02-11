import { Link, useLocation } from "react-router-dom";
import FAQModal from "./FAQModal";
import "../styles/style.css";
import { useEffect, useRef, useState } from "react";

function Footer() {
  const [isContactMenuOpen, setIsContactMenuOpen] = useState(false);
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  const contactMenuRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        contactMenuRef.current &&
        !contactMenuRef.current.contains(event.target) &&
        !event.target.closest(".footer__link--contact")
      ) {
        setIsContactMenuOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleAboutScroll = () => {
    const aboutSection = document.getElementById("about__section");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavigateAndScroll = (e) => {
    e.preventDefault();

    if (location.pathname === "/movies") {
      // For Movies page
      localStorage.setItem("pendingScroll", "true");
      window.location.replace("/");
    } else if (location.pathname === "/cart") {
      // For Cart page
      localStorage.setItem("pendingScroll", "true");
      window.location.href = "/"; // Use href instead of replace for Cart
    } else {
      // For other pages
      setTimeout(() => {
        const aboutSection = document.getElementById("about__section");
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  return (
    <div className="footer">
      <footer>
        <div className="footer__container">
          <div className="footer__wrapper">
            <div className="return__links--wrapper">
              <h3 className="footer__return--top">
                <a className="footer__return--anchor" href="#">
                  Return to Top
                </a>
              </h3>
              <div className="footer__links--wrapper">
                {location.pathname === "/" ? (
                  <div
                    className="footer__link"
                    onClick={handleAboutScroll}
                    style={{ cursor: "pointer" }}
                  >
                    About
                  </div>
                ) : (
                  <div
                    className="footer__link"
                    onClick={handleNavigateAndScroll}
                    style={{ cursor: "pointer" }}
                  >
                    About
                  </div>
                )}
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
                <div
                  className="footer__link--contact"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsContactMenuOpen(!isContactMenuOpen);
                  }}
                >
                  <span className="footer__link">Contact</span>
                  {isContactMenuOpen && (
                    <div ref={contactMenuRef} className="contact-menu active">
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
            <div className="footer__logo">
              <Link
                to="/"
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                JMDB
              </Link>
            </div>
          </div>
        </div>
      </footer>
      <FAQModal
        isOpen={isFAQModalOpen}
        onClose={() => setIsFAQModalOpen(false)}
      />
    </div>
  );
}

export default Footer;
