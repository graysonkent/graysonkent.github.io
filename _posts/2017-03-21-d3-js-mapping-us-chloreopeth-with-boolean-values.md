---
layout: post
date: 2017-03-01 20:00
title:  "US Choropleth by County with Boolean Values"
category: visualization
tags: D3
redirect_from:
  - /archive/2017/d3-js-mapping-us-chloreopeth-with-boolean-values.html
---

This originated as a business need to compare competitors in counties to see who has coverage there. It is essentially [this map](https://bl.ocks.org/mbostock/4060606) from Mike Bostock(creator of D3) but we are coloring by Boolean values and adding a legend/export function.

Below are selected code snippets and [here](https://gist.github.com/graysonkent/d26150fbb0e0bde1db1920fe5e21a8a9) is the full code to follow along. This is the map filled with random data:

<div><button id='saveButton'>Export to Image</button></div>
<div class="chart" style="width:auto; max-width:100%;">
<script>
			var printMultiplier = .8
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
</script>
</div>


> **Note:** This normally wouldn't be so blinding, because counties tend to group together.

County Fill Portion
-------------------
This example is comparing whether we have a store in that county. Since this involves "owning" coverage of counties, it doesn't make sense to rate color by population like in Mike's map. Instead we are looking for a value of 0 or not 0 to indicate if a Company is in this county. This is the piece of code involved:

```js
.defer(d3.csv, "CompetitorStores.csv", function(d) {
    if (d.companyAin > 0 && d.companyBin > 0) d.color = "saddlebrown";
    else if (d.companyAin > 0) d.color = "green";
    else if (d.companyBin > 0) d.color = "mediumpurple";
    else d.color = "lightgrey";
    rateById.set(d.id, d.color);
})
```
As you can see, we are pulling in `CompetitorStores.csv` and comparing the columns with a simple if/else statement to determine how to color each county. Here is an example of how the `CompetitorStores.csv` is setup:


    id,companyAin,companyBin
    1001,0,1

You use an id instead of county name because counties are assigned by [FIPS Codes](https://www.census.gov/geo/reference/codes/cou.html) to cut out text processing, which is both a blessing and a curse.

One interesting aspect of all this is that now you have the framework in place to do a lot of comparisons between columns, although I would recommend to do that in something more suited to it like R or even SQL and then feed the results to D3. For a hypothetical example, you could add a column for population and then add qualifiers to it like so:

```JavaScript
if (d.companyAin > 0 && d.population > 29000) d.color = "green";
```

That's the beauty of D3, it is only limited by your imagination. And computing power.

Add a Legend
------------
This just takes in values for labels and colors and then sets up the squares and text:

```js
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
```
The `steps` array is there so we don't have to hardcode the number of categories needed. We will circle back to what `printMultiplier` is.

Here is how to add the title below the graph:

```js
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
```
Pretty straight-forward. Just add the text to the part where we draw the canvas for counties/states

Export Function
---------------
This is just taken from eligrey's great [filesaver.js library](https://github.com/eligrey/FileSaver.js/) mixed with [canvas-to-blob](https://github.com/blueimp/JavaScript-Canvas-to-Blob) for browser compatibility testing.

One point of interest though:

```js
var printMultiplier = 1
```
Simplest thing ever, but every dimension gets multiplied by this. This was necessary because we print at ridiculous sizes so we needed huge rendering sizes. At one point the print multiplier was 10 and we had to offload blocks to gpu. But that is a topic for another blog post.


Conclusion
----------
I am sure I have lost more hours of my life to debugging D3.js than a lot of full-fledged applications I have written. But that is more the difficulty of learning the DOM than D3's fault. Could this have been accomplished easier in Tableau or Power BI? Probably. But now we have an extensible platform that we can build on and add into other applications without paying $10,000 per head or being constrained to premade data types.


