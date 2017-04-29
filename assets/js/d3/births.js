/**
 * Created by gkent on 4/29/2017.
 */
var margin = {top: 50, right: 0, bottom: 1000, left: 40},
    width = 860 - margin.left - margin.right,
    height = 330 - margin.top - margin.bottom,
    gridSize = Math.floor(width / 34),
    legendElementWidth = gridSize * 2,
    buckets = 9,
    colors = ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"],
    month = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
    times = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
datasets = ["/datasets/births.csv"];

var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dayLabels = svg.selectAll(".dayLabel")
    .data(month)
    .enter().append("text")
    .text(function (d) {
        return d;
    })
    .attr("x", 0)
    .attr("y", function (d, i) {
        return i * gridSize;
    })
    .style("text-anchor", "end")
    .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
    .attr("class", "dayLabel mono axis axis-workweek");

var timeLabels = svg.selectAll(".timeLabel")
    .data(times)
    .enter().append("text")
    .text(function (d) {
        return d;
    })
    .attr("x", function (d, i) {
        return i * gridSize;
    })
    .attr("y", 0)
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + gridSize / 2 + ", -6)")
    .attr("class", "timeLabel mono axis axis-worktime");

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function (d) {
        return "<strong style='color:white'>2015 Births:</strong> <span style='color:red'>" + d.births + "</span>";
    })

var heatmapChart = function (tsvFile) {
    d3.csv(tsvFile,
        function (d) {
            return {
                month: +d.month,
                day: +d.day,
                births: +d.births
            };
        },


        function (error, data) {
            var colorScale = d3.scale.quantile()
                .domain([10000, 180000, d3.max(data, function (d) {
                    return d.births;
                })])
                .range(colors);

            var cards = svg.selectAll(".day")
                .data(data, function (d) {
                    return d.month + ':' + d.day;
                });

            cards.append("title");

            cards.enter().append("rect")
                .attr("x", function (d) {
                    return (d.day - 1) * gridSize;
                })
                .attr("y", function (d) {
                    return (d.month - 1) * gridSize;
                })
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("class", "day bordered")
                .attr("width", gridSize)
                .attr("height", gridSize)
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide)
                .style("fill", colors[0]);

            cards.transition().duration(2000)
                .style("fill", function (d) {
                    return colorScale(d.births);
                });

            cards.select("title").text(function (d) {
                return d.births;
            });

            cards.exit().remove();

            var legend = svg.selectAll(".legend")
                .data([0].concat(colorScale.quantiles()), function (d) {
                    return d;
                });

            legend.enter().append("g")
                .attr("class", "legend");

            legend.append("rect")
                .attr("x", function (d, i) {
                    return legendElementWidth * i;
                })
                .attr("y", height)
                .attr("width", legendElementWidth)
                .attr("height", gridSize / 2)
                .style("fill", function (d, i) {
                    return colors[i];
                });

            legend.append("text")
                .attr("class", "mono")
                .text(function (d) {
                    if (Math.round(d) === 0) {
                        return "≥ 0";
                    }
                    ;
                    return "≥ " + Math.round(d) + "00";
                })
                .attr("x", function (d, i) {
                    return legendElementWidth * i;
                })
                .attr("y", height + gridSize);

            legend.exit().remove();


            svg.append("text")
                .attr("x", "165px")
                .attr("y", "-30px")
                .attr("text-anchor", "right")
                .style("font", "Arial")
                .style("font-weight", "bold")
                .style("font-size", "25px")
                .style("text-decoration", "none")
                .style('fill', '#081d58')
                .text("Distribution of US Birthdays");

            svg.append("text")
                .attr("x", "505px")
                .attr("y", "245px")
                .attr("text-anchor", "right")
                .style("font", "Arial")
                .style("font-weight", "bold")
                .style("font-size", "15px")
                .style("text-decoration", "none")
                .on("click", function () {
                    window.open("https://cloud.google.com/bigquery/sample-tables");
                })
                .append("svg:tspan").style("fill", "grey").text("Source: ")
                .append("svg:tspan").style("fill", "blue").text("Google's Big Query Natality Dataset");
        });
};

heatmapChart(datasets[0]);
svg.call(tip);

860 330