export const generateRandomPrice = () => {
    const min = 9;
    const max = 29;

    // Generate base price (whole number)
    const basePrice = Math.floor(Math.random() * (max - min + 1)) + min;

    // Array of possible cents
    const centOptions = [0, 5, 95, 99];
    const randomCents = centOptions[Math.floor(Math.random() * centOptions.length)];

    // Combine dollars and cents
    const originalPrice = (basePrice + randomCents / 100).toFixed(2);

    // 20% chance of being on sale
    const isOnSale = Math.random() < 0.2;

    if (isOnSale) {
        // Random discount between 5% and 20%
        const discountPercent = Math.random() * (20 - 5) + 5;
        let salePrice = originalPrice * (1 - discountPercent / 100);

        // Round sale price to nearest valid cents
        const saleDollars = Math.floor(salePrice);
        const saleCents = (salePrice - saleDollars) * 100;

        // Find the closest valid cents option
        const closestCents = centOptions.reduce((prev, curr) => {
            return Math.abs(curr - saleCents) < Math.abs(prev - saleCents)
                ? curr
                : prev;
        });

        salePrice = (saleDollars + closestCents / 100).toFixed(2);

        return {
            original: originalPrice,
            sale: salePrice,
            isOnSale: true,
        };
    }

    return {
        original: originalPrice,
        isOnSale: false,
    };
};
