import { useState, useEffect, useRef } from "react";
import LandingSection from "../components/LandingSection";
import AboutSection from "../components/AboutSection";
import FeedbackSection from "../components/FeedbackSection";
import "../styles/style.css";

function Home() {
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const aboutRef = useRef(null);

  const scrollToAbout = (e) => {
    e.preventDefault();
    const aboutSection = document.getElementById("about__section");
    if (aboutSection) {
      window.scrollTo({
        top: aboutSection.offsetTop,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    // Check for pending scroll after component mounts
    const checkScroll = () => {
      if (localStorage.getItem("pendingScroll")) {
        localStorage.removeItem("pendingScroll");
        const aboutSection = document.getElementById("about__section");
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    // Wait for everything to be ready
    if (document.readyState === "complete") {
      checkScroll();
    } else {
      window.addEventListener("load", checkScroll);
      return () => window.removeEventListener("load", checkScroll);
    }
  }, []);

  return (
    <div id="homepage__body">
      <LandingSection scrollToAbout={scrollToAbout} />
      <AboutSection aboutRef={aboutRef} />
      <hr className="home__break--line" />
      <FeedbackSection
        feedbackSent={feedbackSent}
        setFeedbackSent={setFeedbackSent}
        feedbackText={feedbackText}
        setFeedbackText={setFeedbackText}
      />
    </div>
  );
}

export default Home;
