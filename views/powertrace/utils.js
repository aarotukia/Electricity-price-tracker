const fetch = require('node-fetch');

const LATEST_PRICES_ENDPOINT = 'https://api.porssisahko.net/v1/latest-prices.json';

async function fetchLatestPriceData() {
    const response = await fetch(LATEST_PRICES_ENDPOINT);

    return response.json();
}

module.exports = {
    fetchLatestPriceData
};
