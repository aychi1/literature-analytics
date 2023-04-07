/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Bible Sentiment Analysis
*/

/* Load the data */

d3.csv("data/book_master_df.csv").then(data => {
    data.forEach(d => {
        d.chapter = Number(d.chapter)
        d.chapter_length = Number(d.chapter_length)
        d.dim0 = Number(d.dim0)
        d.dim1 =  Number(d.dim1)
        d.sentiment_score = Number(d.sentiment_score)
     });

/* Prepare the chart area */

const MARGIN = { LEFT: 80, RIGHT: 20, TOP: 20, BOTTOM: 50}
const WIDTH = 1000 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM

const svg = d3.select("#chart-area-2").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

svg.append('rect')
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
  .attr("fill", "linen");

const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

// time parser for x-scale
//const parseTime = d3.timeParse("%Y")
// for tooltip
const bisectDate = d3.bisector(d => d.chapter).left

// axis groups
const xAxis = g.append("g")
	.attr("class", "x axis")
	.attr("transform", `translate(0, ${HEIGHT})`)
const yAxis = g.append("g")
	.attr("class", "y axis")
    
// y-axis label
yAxis.append("text")
	.attr("class", "axis-title")
	.attr("transform", "rotate(-90)")
	.attr("y", -50)
	.style("font", "14px monospace")
	.attr("fill", "#5D6971")
	.text("Sentiment Score (Higher = More Positive)")

// x-axis label
xAxis.append("text")
	.attr("class", "axis-title")
	.attr("y",35)
	.attr("x", WIDTH - 45)
	.style("font", "14px monospace")
	.attr("fill", "#5D6971")
	.text("Book Chapter")

/* Interval function */

d3.interval(() => {
    update()
}, 50);

/* Creating a tool tip so that users can explore the data */
tip = d3.tip()
    .attr('class', 'd3-tip')
	.attr('cursor','pointer')
    .html(d => d.book_name + " " + d.chapter)
;

g.call(tip);

function update() {

    var chart_selection = $("#chart-select").val()
    var book_selection = $("#book-select").val()
    var data_trunc = data.filter(function(d){ return d.book_name == book_selection})

    if (chart_selection=="book_arc") {
        svg.style('display','block')
    } else if (chart_selection=="nearest_chapter") {
        svg.style('display','none')
    };

	// scales
	var x = d3.scaleLinear().domain([1, d3.max(data_trunc, d => d.chapter)]).range([0, WIDTH])
	var y = d3.scaleLinear().domain([d3.min(data, d => d.sentiment_score), d3.max(data, d => d.sentiment_score)]).range([HEIGHT,0])

	// axis generators
	const xAxisCall = d3.axisBottom(x)
		.tickFormat(function(e){
			if(Math.floor(e) != e)
			{
				return;
			}
			return e;
		});
	
	const yAxisCall = d3.axisLeft(y);

	// // set scale domains
	x.domain(d3.extent(data_trunc, d => d.chapter))
	y.domain([
		d3.min(data, d => d.sentiment_score), 
		d3.max(data, d => d.sentiment_score)
	])

	// line path generator
	const line = d3.line()
		.x(d => x(d.chapter) + MARGIN.LEFT)
		.y(d => y(d.sentiment_score) + MARGIN.BOTTOM)

	// // generate axes once scales have been set
	xAxis.call(xAxisCall.scale(x))
	yAxis.call(yAxisCall.scale(y))

	// draw new lines
	var lines = svg.selectAll('.line')
		.data(data_trunc)
		.attr('class','line');

	// remove all previously draw lines 
	lines.exit().remove();

	// update existing lines of the chart
	lines
		.attr("d", line(data_trunc))

	// add line to chart
	lines
		.enter()
		.append("path")
		.attr("class", "line")
		.attr("stroke", "blue")
		.attr("stroke-width", "3px")
		.attr("d", line(data_trunc))

	// appending circles to represent each chapter of chart
    // Join new data
    const circles = svg.selectAll('circle')
        .data(data_trunc);

    // Exit old elements
    circles.exit().remove();

    // Update old elements present in new data 
    circles
        .attr('cx', (d) => x(d.chapter) + MARGIN.LEFT)
        .attr('cy', (d) => y(d.sentiment_score) + MARGIN.BOTTOM)
        .attr('r', 3)
		.attr('stroke', 'black')
        .attr('fill', 'grey')
        .on('mouseover.tip', tip.show)
        .on('mouseover.pointer', function(d){return d3.select(this).style('cursor','pointer')})
        .on('mouseout', tip.hide)
    
    // Add new elements in the data
    circles.enter().append('circle')
	.attr('cx', (d) => x(d.chapter) + MARGIN.LEFT)
	.attr('cy', (d) => y(d.sentiment_score) + MARGIN.BOTTOM)
        .attr('r', 3)
        .attr('stroke', 'black')
        .attr('fill', 'grey')
        .on('mouseover.tip', tip.show)
        .on('mouseover.pointer', function(d){return d3.select(this).style('cursor','pointer')})
        .on('mouseout', tip.hide)
        ;


}
});
