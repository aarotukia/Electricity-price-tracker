const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { fetchLatestPriceData, formatDateTime } = require('./indexController');

const buildChartData = (priceData) => {
  const chartData = {
    labels: [],
    datasets: [
      {
        label: 'Electricity Prices',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  priceData.forEach((price) => {
    chartData.labels.push(formatDateTime(new Date(price.startDate)));
    chartData.datasets[0].data.push(price.price);
  });

  return chartData;
};

exports.renderChart = async (req, res) => {
  try {
    const priceData = await fetchLatestPriceData();
    const chartData = buildChartData(priceData);

    const width = 800;
    const height = 600;

    const chartCallback = (ChartJS) => {
      ChartJS.defaults.global.defaultFontFamily = 'Arial';
      ChartJS.defaults.global.defaultFontSize = 16;
      ChartJS.defaults.global.defaultFontColor = '#777';
    };

    const configuration = {
      type: 'line',
      data: chartData,
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                callback: function (value, index, values) {
                  return value + ' snt / kWh';
                },
              },
            },
          ],
        },
      },
    };

    const canvasRender = new ChartJSNodeCanvas({ width, height, chartCallback });
    const image = await canvasRender.renderToBuffer(configuration);

    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': image.length,
    });
    res.end(image);
  } catch (error) {
    console.error(`Error rendering chart: ${error}`);
    res.status(500).send('Error rendering chart');
  }
};
