/*
*    main.js
*    Scatterplot
*/

/* Control the inputs */

var nearest_chapter_var = document.getElementById("chart-area-1");
var book_arc_var = document.getElementById("chart-area-2");

/* Load the data */

d3.csv("data/book_master_df.csv").then(data => {
    data.forEach(d => {
        d.chapter = Number(d.chapter)
        d.chapter_length = Number(d.chapter_length)
        d.dim0 = Number(d.dim0)
        d.dim1 =  Number(d.dim1)
        d.sentiment_score = Number(d.sentiment_score)
     });

/* Prep the chart area and colors */

// Preparing the SVG 
const MARGIN = { LEFT: 20, RIGHT: 20, TOP: 20, BOTTOM: 20}
const WIDTH = 1000 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM

var svg = d3.select("#chart-area-1").append("svg")
        .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
        .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

svg.append('rect')
    .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
    .attr("fill", "linen");

const g = svg.append("g")

// scales
const x1 = d3.scaleLinear()
            .domain([-1,1])
            .range([0,WIDTH])

const y1 = d3.scaleLinear()
            .domain([-1,1])
            .range([0,HEIGHT])

/* Sentiment Analysis chart */

d3.interval(() => {
    update()
}, 50);

/* Creating a tool tip so that users can explore the data */
tip = d3.tip()
    .attr('class', 'd3-tip')
    .html(d => d.book_name + " " + d.chapter)
;

g.call(tip);

function update() {

    var chart_selection = $("#chart-select").val()
    var book_selection = $("#book-select").val()
    var data_trunc = data.filter(function(d){ return d.book_name == book_selection})

    if (chart_selection=="nearest_chapter") {
        svg.style('display','block')
    } else if (chart_selection=="book_arc") {
        svg.style('display','none')
    };

    // generating colors
    var myColor = d3.scaleSequential()
                    .domain([1,d3.max(data_trunc, d=> d.chapter)])
                    .interpolator(d3.interpolatePuRd);

    // Join new data
    const circles = svg.selectAll('circle')
                    .data(data_trunc);

    // Exit old elements
    circles.exit().remove();

    // Update old elements present in new data 
    circles
        .attr('cx', (d) => x1(d.dim0))
        .attr('cy', (d) => y1(d.dim1))
        .attr('r', 10)
        .attr('stroke', 'purple')
        .attr('fill', function(d){return myColor(d.chapter)})
        .on('mouseover.tip', tip.show)
        // .on('mouseover.pointer', function(d){return d3.select(this).style('cursor','pointer')})
        .on('mouseout', tip.hide)

    // Add new elements in the data
    circles.enter().append('circle')
        .attr('cx', (d) => x1(d.dim0))
        .attr('cy', (d) => y1(d.dim1))
        .attr('r', 10)
        .attr('stroke', 'purple')
        .attr('fill', function(d){return myColor(d.chapter)})
        .on('mouseover.tip', tip.show)
        // .on('mouseover.pointer', function(d){return d3.select(this).style('cursor','pointer')})
        .on('mouseout', tip.hide)
        ;

    }
 
}); 
