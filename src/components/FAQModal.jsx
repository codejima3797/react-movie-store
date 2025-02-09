import React from 'react';

const FAQModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const faqData = [
        {
            question: "Q: How do I search for movies?",
            answer: "A: You can search for movies using the search bar at the top of the Movies page. Simply type in the title or keywords and press enter or click the search icon."
        },

        {
            question: "Q: How do I add movies to my cart?",
            answer: "A: You can add movies to your cart by hovering over a movie and clicking the 'Add to Cart' button, or by clicking the 'Description' button and adding it from the movie details modal."
        },

        {
            question: "Q: Can I adjust the quantity of movies in my cart?",
            answer: "A: Yes, you can adjust the quantity of movies in your cart using the plus and minus buttons next to each item in the cart page."
        },

        {
            question: "Q: How do I filter mature content?",
            answer: "A: You can hide mature content by checking the 'Hide Mature Content' checkbox below the search bar on the Movies page."
        },

        {
            question: "Q: How are the movie prices determined?",
            answer: "A: Movie prices are set based on various factors including release date and popularity. Some movies may be on sale with special discounted prices."
        }
    ];

    return (
        <div className="faq-modal-overlay" onClick={onClose}>
            <div className="faq-modal-content" onClick={e => e.stopPropagation()}>
                <button className="faq-modal-close" onClick={onClose}>
                    <i className="fa-solid fa-times"></i>
                </button>
                <h2 className="faq-modal-title">Frequently Asked Questions</h2>
                {faqData.map((faq, index) => (
                    <div key={index} className="faq-item">
                        <div className="faq-question">{faq.question}</div>
                        <div className="faq-answer">{faq.answer}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQModal;
