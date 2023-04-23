const { Console } = require('console');
const fetch = require('node-fetch');


const LATEST_PRICES_ENDPOINT = 'https://api.porssisahko.net/v1/latest-prices.json';

// This function fetches the latest price data from the API
async function fetchLatestPriceData() {
    const response = await fetch(LATEST_PRICES_ENDPOINT);
    return response.json();
}

// This function formats a date object into a human-readable date/time string
function formatDateTime(date) {
    return date.toLocaleString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
    }).replace(',', ' ');
}

// This function gets the price for a specific date from an array of prices
function getPriceForDate(date, prices) {
    const matchingPriceEntry = prices.find(
        (price) => new Date(price.startDate) <= date && new Date(price.endDate) > date
    );

    if (!matchingPriceEntry) {
        throw 'Price for the requested date is missing';
    }

    const formattedDate = formatDateTime(date);
    const price = matchingPriceEntry.price;

    return `${formattedDate}: ${price}`;
}

// This is the main export of the module, which is a function that renders the home page
exports.index = async (req, res) => {
    const { prices } = await fetchLatestPriceData();

    try {
        const now = new Date();
        const price = getPriceForDate(now, prices);

        res.render('powertrace/index', { now, price });
    } catch (e) {
        console.error(`Hinnan haku epäonnistui, syy: ${e}`);
    }
};

// This function gets the latest prices and formats them for display on the prices page
async function getPrices(req, res) {
    try {
        const response = await fetch(LATEST_PRICES_ENDPOINT);
        const data = await response.json();
        const now = new Date();

        // Map the prices array to add formatted start and end dates for display
        const prices = data.prices.map((priceEntry) => {
            const startDate = new Date(priceEntry.startDate);
            const endDate = new Date(priceEntry.endDate);
            const formattedStartDate = formatDate(startDate);
            const formattedEndDate = formatDate(endDate);
            return {
                ...priceEntry,
                startDate,
                endDate,
                formattedStartDate,
                formattedEndDate,
            };
        });
        // Filter and sort the prices to get the next 24 hours of prices
        const sortedPrices = prices
            .filter((price) => price.startDate > now)
            .sort((a, b) => a.startDate - b.startDate);

        const nextPrices = [];

        // Iterate over the next 24 hours and find the corresponding price for each hour
        for (let i = 0; i < 24; i++) {
            const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + i);
            const nextPrice = sortedPrices.find((price) => price.startDate <= nextHour && price.endDate > nextHour);
            if (nextPrice) {
                nextPrices.push(nextPrice);
            }
        }

        res.render('powertrace/prices', { prices: nextPrices });
    } catch (e) {
        console.error(`Error fetching prices: ${e}`);
    }
}
// This function formats a date object into a string in the format "dd/mm/yy hh:mm"
  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `\${day}/\${month}/\${year} \${hours}:\${minutes}`;
  }
  
exports.getPrices = getPrices;