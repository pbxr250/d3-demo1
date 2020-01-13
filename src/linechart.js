
// 2. Use the margin convention practice 
var margin = {top: 50, right: 50, bottom: 50, left: 50}
  , width = 600 - margin.left - margin.right // Use the window's width 
  , height = 400 - margin.top - margin.bottom; // Use the window's height

// The number of datapoints
var n = 21;

// 5. X scale will use the index of our data
var xScale = d3.scaleLinear()
    .domain([0, n-1]) // input
    .range([0, width]); // output

// 6. Y scale will use the randomly generate number 
var yScale = d3.scaleLinear()
    .domain([0, 200]) // input 
    .range([height, 0]); // output 

// 7. d3's line generator
var line = d3.line()
    .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
    .y(function(d) { return yScale(d.y); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX); // apply smoothing to the line

// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
var dataset = d3.range(n).map(function(d) { return {"y": 120 + d3.randomUniform(20)() } });

// 1. Add the SVG to the page and employ #2
export function drawChart()
{
  var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      //append clipPath to <svg><g>
  svg.append("defs").append("clipPath")
    .attr("id", "clipRect")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

  // 3. Call the x axis in a group tag
  // svg.append("g")
  //     .attr("class", "x axis")
  //     .attr("transform", "translate(0," + height + ")")
  //     .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

  // 4. Call the y axis in a group tag
  svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(yScale)) // Create an axis component with d3.axisLeft
      .append("svg:text")
        .attr("x", 0)
        .attr("y", -20)
        .attr("dy", 8)
        .attr("text-anchor", "middle")
        .text("hp")
        .style("font-size", 16 + "px")
        .style("fill", "#333")
        .style("stroke-width", "1px");

  // 9. Append the path, bind the data, and call the line generator 
  svg.append("g")
    .attr("clip-path", "url(#clipRect)")
    .append("path")
      .datum(dataset) // 10. Binds data to the line 
      .attr("class", "line") // Assign a class for styling 
      .attr("d", line)   // 11. Calls the line generator 
    .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .on("start", redrawLine);

  // 12. Appends a circle for each datapoint 
  // svg.selectAll(".dot")
  //     .data(dataset)
  //   .enter().append("circle") // Uses the enter().append() method
  //     .attr("class", "dot") // Assign a class for styling
  //     .attr("cx", function(d, i) { return xScale(i) })
  //     .attr("cy", function(d) { return yScale(d.y) })
  //     .attr("r", 5)
  //       .on("mouseover", function(a, b, c) { 
  //   			console.log(a) 
  //         this.attr('class', 'focus')
  // 		})
  //       .on("mouseout", function() {  });
}

export function redrawLine()
{
  dataset.push( {"y": 120 + d3.randomUniform(15)() } ); 

  // redraw the line, and then slide it to the left
  // Redraw the line.
  d3.select(this)
    .attr("d", line)
    .attr("transform", null);

  d3.active(this)
      .attr("transform", "translate(" + xScale(-1) + ")")
    .transition()
      .on("start", redrawLine);
      


  // pop the old data point off the front
  dataset.shift();
}