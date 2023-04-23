const fetch = require('node-fetch');

const LATEST_PRICES_ENDPOINT = 'https://api.porssisahko.net/v1/latest-prices.json';

async function fetchLatestPriceData() {
  const response = await fetch(LATEST_PRICES_ENDPOINT);

  return response.json();
}

function formatDateTime(date) {
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', '');
  }

  
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
  
  

exports.index = async (req, res) => {
  const { prices } = await fetchLatestPriceData();

  try {
    const now = new Date();
    const price = getPriceForDate(now, prices);

    res.render('powertrace/index', { now, price });
  } catch (e) {
    console.error(`Hinnan haku epäonnistui, syy: \${e}`);
  }
};
