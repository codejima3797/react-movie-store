import { useEffect } from 'react';

export const useClickOutside = (ref, setIsOpen) => {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && 
                !ref.current.contains(event.target) && 
                !event.target.closest('.footer__link--contact')) {
                setIsOpen(false);
            }
        }

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [ref, setIsOpen]);
};
