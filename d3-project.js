// SVG size, margin, etc. 
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
///////////CHECKSTUFF////////////
var chosenYAxis = "homeWin";

// function used for updating y-scale var upon click on axis label
function yScale(nflData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(nflData, d => d[chosenYAxis]) * 0.8,
            d3.max(nflData, d => d[chosenYAxis]) * 1.2
        ])
        .range([0, width]);

    return yLinearScale;

}

// function used for updating yAxis var upon click on axis label
function renderAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}


/////////// UPDATE FOR BAR//////
// function used for updating bar group with a transition to
// new bar
function renderBars(barGroup, newYScale, chosenYaxis) {

    barGroup.transition()
        .duration(1000)
        .attr("cx", d => newYScale(d[chosenYAxis]));

    return barGroup;
}

// function used for updating bar group with new tooltip
function updateToolTip(chosenYAxis, barGroup) {

    if (chosenYAxis === "homeWin") {
        var label = "Home Win Rate:";
    } else {
        var label = "Average Points for Home Game:";
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.year}<br> ${d[chosenXAxis]}`);
        });

    barGroup.call(toolTip);

    barGroup.on("mouseover", function(data) {
            toolTip.show(data);
        })
        // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

    return barGroup;
}

// Retrieve data from the CSV file and execute everything below
///NEEDS TO GO TO DATABASE
d3.json(JSONPATH).then(function(nflData, err) {
            if (err) throw err;

            // parse data
            nflData.forEach(function(data) {
                data.season = +data.season;
                data.homewin = +data.homewin;
                data.homescore = +data.homescore;
            });

            // yLinearScale function above csv import
            var xLinearScale = xScale(nflData, xAxis);

            // Create x scale function
            var xLinearScale = d3.scaleLinear()
                .domain([0, d3.max(nflData, d => d.year)])
                .range([height, 0]);

            // Create initial axis functions
            var bottomAxis = d3.axisBottom(xLinearScale);
            var leftAxis = d3.axisLeft(yLinearScale);

            // append x axis
            var xAxis = chartGroup.append("g")
                .classed("x-axis", true)
                .attr("transform", `translate(0, ${height})`)
                .call(bottomAxis);

            // append y axis
            chartGroup.append("g")
                .call(leftAxis);

            // append initial bar
            ///// NEED TO MAKE BARS
            var barGroup = chartGroup.selectAll("rectangle")
                .data(nflData)
                .enter()
                .append("rect")
                .attr("cx", d => xLinearScale(d[year]))
                .attr("cy", d => yLinearScale(d.homewin))
                .attr("r", 20)
                .attr("fill", "green")
                .attr("opacity", ".5");

            // Create group for  2 y- axis labels
            var labelsGroup = chartGroup.append("g")
                .attr("transform", `translate(${width / 2}, ${height + 20})`);

            var winLabel = labelsGroup.append("text")
                .attr("x", 0)
                .attr("y", 20)
                .attr("value", "homewin") // value to grab for event listener
                .classed("active", true)
                .text("Average Home Win Rate");

            var avgHomePointsLabel = labelsGroup.append("text")
                .attr("x", 0)
                .attr("y", 40)
                .attr("value", "homescore" // value to grab for event listener
                    .classed("inactive", true)
                    .text("Average Home Points Scored");

                    // append x axis
                    chartGroup.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0 - margin.left)
                    .attr("x", 0 - (height / 2))
                    .attr("dy", "1em")
                    .classed("axis-text", true)
                    .text("Year");

                    // updateToolTip function above csv import
                    var barGroup = updateToolTip(chosenYAxis, barGroup);

                    // y axis labels event listener
                    labelsGroup.selectAll("text")
                    .on("click", function() {
                        // get value of selection
                        var value = d3.select(this).attr("value");
                        if (value !== chosenYAxis) {

                            // replaces chosenYAxis with value
                            chosenYAxis = value;

                            // console.log(chosenYAxis)

                            // functions here found above csv import
                            // updates y scale for new data
                            yLinearScale = yScale(nflData, chosenYAxis);

                            // updates y axis with transition
                            yAxis = renderAxes(yLinearScale, yAxis);

                            // updates bar with new y values
                            barGroup = renderBars(barGroup, yLinearScale, chosenYAxis);

                            // updates tooltips with new info
                            barGroup = updateToolTip(chosenYAxis, barGroup);

                            // changes classes to change bold text
                            if (chosenYAxis === "homeWin") {
                                winLabel
                                    .classed("active", true)
                                    .classed("inactive", false);
                                avgPointsLabel
                                    .classed("active", false)
                                    .classed("inactive", true);
                            } else {
                                winLabel
                                    .classed("active", false)
                                    .classed("inactive", true);
                                avgPointsLabel
                                    .classed("active", true)
                                    .classed("inactive", false);
                            }
                        }
                    });
                }).catch(function(error) {
            console.log(error);
        });