const Chart = require('chart.js');
const { fetchLatestPriceData } = require('./utils');

async function createChart() {
    const priceData = await fetchLatestPriceData();

    const chart = new Chart('myChart', {
        type: 'line',
        data: {
            labels: priceData.dates,
            datasets: [{
                label: 'Price',
                data: priceData.prices,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        }
    });
}

module.exports = {
    createChart
};
