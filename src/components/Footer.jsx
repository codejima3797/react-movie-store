import { useLocation } from 'react-router-dom';

function Footer() {
    const location = useLocation();

    const handleAboutScroll = () => {
        const aboutSection = document.getElementById("about__section");
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleNavigateAndScroll = (e) => {
        e.preventDefault();
        
        if (location.pathname === '/movies') {
            // For Movies page, use a different approach
            localStorage.setItem('pendingScroll', 'true');
            // Force a clean navigation without any pending state
            window.location.replace('/');
        } else {
            // For Cart page, keep the working approach
            setTimeout(() => {
                const aboutSection = document.getElementById("about__section");
                if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: "smooth" });
                }
            }, 100);
        }
    };

    return (
        <footer className="footer">
            {/* ... other footer content ... */}
            {location.pathname === '/' ? (
                // If on home page, just scroll
                <div 
                    className="footer__link" 
                    onClick={handleAboutScroll}
                >
                    About
                </div>
            ) : (
                // If on other pages, use Link with appropriate timeout
                <div
                    className="footer__link"
                    onClick={handleNavigateAndScroll}
                    style={{ cursor: 'pointer' }}
                >
                    About
                </div>
            )}
            {/* ... other footer content ... */}
        </footer>
    );
}

export default Footer;
