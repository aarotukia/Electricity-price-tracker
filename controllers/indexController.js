const fetch = require('node-fetch');

const PRICE_ENDPOINT = 'https://api.porssisahko.net/v1/price.json';

exports.index = async (req, res) => {
  const dateAndTimeNow = new Date();
  const date = dateAndTimeNow.toISOString().split('T')[0];
  const hour = dateAndTimeNow.getHours();

  try {
    const response = await fetch(`${PRICE_ENDPOINT}?date=${date}&hour=${hour}`);
    const { price } = await response.json();
    res.render('index', { price });
  } catch (error) {
    console.error(error);
    res.render('index', { price: 'Error fetching price' });
  }
};
