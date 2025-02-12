import React from "react";

export default function FeedbackSection({ feedbackSent, setFeedbackSent, feedbackText, setFeedbackText }) {
  return (
    <div>
      <section id="feedback__section">
        <div className="feedback__container">
          <div className="feedback__row">
            <h2 className="feedback__title">Please share your feedback!</h2>
            <div className="feedback__wrapper">
              {!feedbackSent ? (
                <>
                  <label className="feedback__label">
                    We hope you're finding everything you need and are enjoying
                    your experience on our website. Feel free to send us any
                    feedback, whether it be any media that we should add to our
                    site, bugs, or anything else that could help improve your
                    experience!
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
};
