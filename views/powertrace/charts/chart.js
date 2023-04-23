const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const fetchLatestPriceData = async () => {
  const fetch = require('node-fetch');
  const response = await fetch(LATEST_PRICES_ENDPOINT);
  return response.json();
};

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
    chartData.labels.push(price.startDate);
    chartData.datasets[0].data.push(price.price);
  });

  return chartData;
};

const renderChart = async () => {
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
};

renderChart();

