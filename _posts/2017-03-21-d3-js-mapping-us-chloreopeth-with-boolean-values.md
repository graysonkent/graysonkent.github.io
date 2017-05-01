---
layout: post
date: 2017-03-01 20:00
title:  "US Choropleth by County with Boolean Values"
category: visualization
tags: D3
d3Load: true
redirect_from:
  - /archive/2017/d3-js-mapping-us-chloreopeth-with-boolean-values.html
---

This originated as a business need to compare competitors in counties to see who has coverage there. It is essentially [this map](https://bl.ocks.org/mbostock/4060606) from Mike Bostock(creator of D3) but we are coloring by Boolean values and adding a legend/export function.

Below are selected code snippets and [here](https://gist.github.com/graysonkent/d26150fbb0e0bde1db1920fe5e21a8a9) is the full code to follow along. This is the map filled with random data:

<div><button id='saveButton'>Export to Image</button></div>
<div class="chart" style="width:auto; max-width:100%;overflow-x: hidden;">
<script src="\assets\js\d3\usmap.js"></script>
</div>

<blockquote class="mobile-note">
<p><strong>Note:</strong>Mobile users can scroll left/right to see whole image</p>
</blockquote>

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

```js
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


