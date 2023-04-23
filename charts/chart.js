// Fetch data from the API using d3.json()
const LATEST_PRICES_ENDPOINT = 'https://api.porssisahko.net/v1/latest-prices.json';

d3.json(LATEST_PRICES_ENDPOINT).then(data => {
  // Extract the prices and timestamps arrays from the API response
  const prices = data.prices.map(price => price.value);
  const timestamps = data.prices.map(price => new Date(price.timestamp));

  // Create a line chart using D3.js
  const svg = d3.select('#chart');
  const width = +svg.attr('width');
  const height = +svg.attr('height');
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  const g = svg.append('g')
      .attr('transform', `translate(\${margin.left},\${margin.top})`);

  const x = d3.scaleTime()
      .range([0, chartWidth])
      .domain(d3.extent(timestamps));

  const y = d3.scaleLinear()
      .range([chartHeight, 0])
      .domain(d3.extent(prices));

  const line = d3.line()
      .x((d, i) => x(timestamps[i]))
      .y(d => y(d));

  g.append('g')
      .attr('transform', `translate(0,\${chartHeight})`)
      .call(d3.axisBottom(x));

  g.append('g')
      .call(d3.axisLeft(y));

  g.append('path')
      .datum(prices)
      .attr('fill', 'none')
      .attr('stroke', '#f49595')
      .attr('stroke-width', 3)
      .attr('d', line);
});
