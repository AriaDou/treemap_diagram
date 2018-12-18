const dataSet = {
  'kickstarter': {
    'url': 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json',
    'title': 'Kickstarter Pledges',
    'description': 'Top 100 Most Pledged Kickstarter Campaigns Grouped By Category'
  },
  'movie': {
    'url': 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json',
    'title': 'Movie Sales',
    'description': 'Top 100 Highest Grossing Movies Grouped By Genre'
  },
  'video-game': {
    'url': 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json',
    'title': 'Video Game Sales',
    'description': 'Top 100 Most Sold Video Games Grouped by Platform'
  }
}
const colorSet = d3.schemePaired.concat(d3.schemeSet3);
const width = 900;
const height = 700;


const changeData = data => {
  const diagramContainer = d3.select('#diagram-container');
  diagramContainer.html('');
  diagramContainer.append('h1')
    .attr('id', 'title')
    .text(dataSet[data].title);
  diagramContainer.append('p')
    .attr('id', 'description')
    .text(dataSet[data].description);
  const svgContainer = diagramContainer.append('div')
    .attr('id', 'svg-container');
  const tooltip = svgContainer.append('div')
    .attr('id', 'tooltip')
    .attr('class', 'bar')
    .style('visibility', 'hidden');
  const svg = svgContainer.append('svg')
    .attr('width', width)
    .attr('height', height);
  const legend = svgContainer.append('svg')
    .attr('id', 'legend')
    .attr('width', 500)
    .attr('height', 200);
  const treemap = d3.treemap()
    .size([width, height])
    .round(false)
    .padding(1);

  d3.json(dataSet[data].url).then(data => {
    const nodes = treemap(d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.height - a.height || b.value - a.value))
      .leaves();

    const categorySet = [];
    nodes.map(node => {
      if (!categorySet.includes(node.data.category)) {
        categorySet.push(node.data.category);
      }
    })

    const cell = svg.selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('transform', d => "translate(" + d.x0 + ', ' + d.y0 + ")")
      .on('mouseover', d => {
        tooltip.style('visibility', 'visible')
          .style('top', d.y1 + 'px')
          .style('left', d.x1 + 'px')
          .attr('data-value', d.data.value)
          .html(`Name: ${d.data.name}</br>Category: ${d.data.category}</br>Value: ${d.data.value}`);
      })
      .on('mouseout', d => {
        tooltip.style('visibility', 'hidden');
      });

    cell.append('rect')
      .attr('class', 'tile')
      .attr('data-name', d => d.data.name)
      .attr('data-category', d => d.data.category)
      .attr('data-value', d => d.data.value)
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .attr('fill', d => {
        const index = categorySet.findIndex(category => category === d.data.category);
        return colorSet[index];
      });

    cell.append('text')
      .style('font-size', '10px')
      .selectAll('tspan')
      .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
      .enter()
      .append('tspan')
      .attr('x', 4)
      .attr('y', (d, i) => 13 + i * 10)
      .text(d => d);

    legendWidth = +legend.attr("width");

    const legendItems = legend.selectAll('g')
      .data(categorySet)
      .enter()
      .append('g')
      .attr('transform', function (d, i) {
      return 'translate(' +
      i % Math.floor(legendWidth / 150) * 150 + ',' + (
      Math.floor(i / Math.floor(legendWidth / 150)) * 15 + 10 * Math.floor(i / Math.floor(legendWidth / 150))) + ')';
    });

    legendItems.append('rect')
      .attr('class', 'legend-item')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', (d, i) => colorSet[i]);
    legendItems.append('text')
      .style('font-size', '15px')
      .attr('x', 15 + 3)
      .attr('y', 15 - 2)
      .text(d => d);
  });
}

changeData('kickstarter');
document.getElementById('nav').onclick = (event) => {
  changeData(event.target.name);
}
