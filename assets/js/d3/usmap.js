/**
 * Created by gkent on 4/29/2017.
 */
var printMultiplier = 1
var width = 960 * printMultiplier, // 1280 or 3840 or 920
    height = 680 * printMultiplier; //720 or 2160 or 680
var rateById = d3.map();
var projection = d3.geo.albersUsa()
    .scale(1120 * printMultiplier) //1320 or 3960
    .translate([width / 2.3, height / 2.2]);
var path = d3.geo.path()
    .projection(projection);
var svg = d3.select(".chart").append("svg")
    .attr("width", width)
    .attr("height", height);
queue()
    .defer(d3.json, "https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/us.json")
    .defer(d3.csv, "/datasets/CompetitorStores.csv", function(d) {
        if (d.companyAin > 0 && d.companyBin > 0) d.color = "saddlebrown";
        else if (d.companyAin > 0) d.color = "green";
        else if (d.companyBin > 0) d.color = "mediumpurple";
        else d.color = "lightgrey";
        rateById.set(d.id, d.color);
    })
    .await(ready);

function ready(error, us) {
    if (error) throw error;
    svg.append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.counties).features)
        .enter().append("path")
        .attr("fill", function(d) {
            return rateById.get(d.id);
        })
        .attr("d", path);
    svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) {
            return a !== b;
        }))
        .attr("class", "states")
        .attr("d", path);

    svg.append("text")
        .attr("x", width - 450 * printMultiplier)
        .attr("y", height - 30 * printMultiplier)
        .attr("text-anchor", "right")
        .style("font", "Arial")
        .style("font-weight", "bold")
        .style("font-size", +printMultiplier * 25 + "px")
        .style("text-decoration", "none")
        .style('fill', 'green')
        .text("Our Company vs Competitor");
}


var legend_labels = ["Competitor Only", "Both In", "Our Company only"]
var color = ["saddlebrown", "green", "mediumpurple"];
var steps = [];
for (var i = 0; i < legend_labels.length; i++) {
    steps.push(legend_labels[i]);
}

var legend = svg.selectAll("g.legend")
    .data(steps)
    .enter().append("g")
    .attr("class", "legend");

var ls_w = 20 * printMultiplier,
    ls_h = 20 * printMultiplier;

legend.append("rect")
    .attr("x", width - 240 * printMultiplier)
    .attr("y", function(d, i) {
        return height - (i * ls_h) - ls_h - 200 * printMultiplier;
    })
    .attr("width", ls_w)
    .attr("height", ls_h)
    .style("fill", function(d, i) {
        return color[i];
    });

legend.append("text")
    .attr("x", width - 210 * printMultiplier)
    .attr("y", function(d, i) {
        return height - (i * ls_h) - ls_h - 185 * printMultiplier;
    })
    .text(function(d, i) {
        return legend_labels[i];
    })
    .style("font-size", +printMultiplier * 12 + "px")
    .style("font", "stacker-bold")
    .style('fill', '#08306b');


d3.select(self.frameElement).style("height", height + "px");
// Set-up the export button
d3.select('#saveButton').on('click', function() {
    var svgString = getSVGString(svg.node());
    svgString2Image(svgString, 2 * width, 2 * height, 'png', save); // passes Blob and filesize String to the callback

    function save(dataBlob, filesize) {
        saveAs(dataBlob, 'VisExport.png'); // FileSaver.js function
    }
});

// Below are the function that handle actual exporting:
// getSVGString (svgNode ) and svgString2Image( svgString, width, height, format, callback )
function getSVGString(svgNode) {
    svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
    var cssStyleText = getCSSStyles(svgNode);
    appendCSS(cssStyleText, svgNode)

    var serializer = new XMLSerializer();
    var svgString = serializer.serializeToString(svgNode);
    svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink=') // Fix root xlink without namespace
    svgString = svgString.replace(/NS\d+:href/g, 'xlink:href') // Safari NS namespace fix

    return svgString;

    function getCSSStyles(parentElement) {
        var selectorTextArr = [];

        // Add Parent element Id and Classes to the list
        selectorTextArr.push('#' + parentElement.id);
        for (var c = 0; c < parentElement.classList.length; c++)
            if (!contains('.' + parentElement.classList[c], selectorTextArr))
                selectorTextArr.push('.' + parentElement.classList[c]);

        // Add Children element Ids and Classes to the list
        var nodes = parentElement.getElementsByTagName("*");
        for (var i = 0; i < nodes.length; i++) {
            var id = nodes[i].id;
            if (!contains('#' + id, selectorTextArr))
                selectorTextArr.push('#' + id);

            var classes = nodes[i].classList;
            for (var c = 0; c < classes.length; c++)
                if (!contains('.' + classes[c], selectorTextArr))
                    selectorTextArr.push('.' + classes[c]);
        }

        // Extract CSS Rules
        var extractedCSSText = "";
        for (var i = 0; i < document.styleSheets.length; i++) {
            var s = document.styleSheets[i];

            try {
                if (!s.cssRules) continue;
            } catch (e) {
                if (e.name !== 'SecurityError') throw e; // for Firefox
                continue;
            }

            var cssRules = s.cssRules;
            for (var r = 0; r < cssRules.length; r++) {
                if (contains(cssRules[r].selectorText, selectorTextArr))
                    extractedCSSText += cssRules[r].cssText;
            }
        }


        return extractedCSSText

        function contains(str, arr) {
            return arr.indexOf(str) === -1 ? false : true;
        }

    }

    function appendCSS(cssText, element) {
        var styleElement = document.createElement("style");
        styleElement.setAttribute("type", "text/css");
        styleElement.innerHTML = cssText;
        var refNode = element.hasChildNodes() ? element.children[0] : null;
        element.insertBefore(styleElement, refNode);
    }
}


function svgString2Image(svgString, width, height, format, callback) {
    var format = format ? format : 'png';

    var imgsrc = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString))); // Convert SVG string to dataurl

    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    var image = new Image;
    image.onload = function() {
        context.clearRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);

        canvas.toBlob(function(blob) {
            var filesize = Math.round(blob.length / 1024) + ' KB';
            if (callback) callback(blob, filesize);
        });


    };

    image.src = imgsrc;
}