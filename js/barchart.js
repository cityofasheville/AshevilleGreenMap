

var w = 20,
    h = 100;
    
var x = d3.scale.linear()
    .domain([0, 1])
    .range([0, w]);
    
 var y = d3.scale.linear()
    .domain([0, 100])
    .rangeRound([0, h]);

var data = d3.csv.("../AshevilleGreenMap/data/carbonData.csv").text();

  

var barLabel = function(d) { return d['Type']; };
var barValue2008 = function(d) { return parseFloat(d['a']); };
var barValue2009 = function(d) { return parseFloat(d['b']); };
var barValue2010 = function(d) { return parseFloat(d['c']); };
var barValue2011 = function(d) { return parseFloat(d['q']); };
var barValue2012 = function(d) { return parseFloat(d['f']); };


  
    

  var chart = d3.select("#intro").append("svg")
    .attr("class", "chart")
    .attr("width", w * data.length - 1)
    .attr("height", h);

  chart.selectAll("rect")
     .data(data)
   .enter().append("rect")
     .attr("x", function(d, i) { return x(i) - .5; })
     .attr("y", function(d) { return h - y(d.a) - .5; })
     .attr("width", w)
     .attr("height", function(d) { return y(d.a); });

     chart.append("line")
     .attr("x1", 0)
     .attr("x2", w * data.length)
     .attr("y1", h - .5)
     .attr("y2", h - .5)
     .style("stroke", "#000")



// var chart = d3.select("#intro").append("svg")
//      .attr("class", "chart")
//      .attr("width", 420)
//      .attr("height", 20 * data.length);

// var x = d3.scale.linear()
//  .domain([0, d3.max(data)])
//    .range([0, 420]);

// chart.selectAll("rect")
//     .data(data)
//   .enter().append("rect")
//     .attr("y", function(d, i) { return i * 20; })
//     .attr("width", x)
//      .attr("height", 20);


// chart.selectAll("rect")
//      .data(data)
//   .enter().append("rect")
//        .attr("y", function(d, i) { return i * 20; })
//        .attr("width", x)
//        .attr("height", 20);


//  var y = d3.scale.ordinal()
//     .domain(data)
//     .rangeBands([0, 120]);



// chart.selectAll("rect")
//      .data(data)
//    .enter().append("rect")
//      .attr("y", y)
//      .attr("width", x)
//      .attr("height", y.rangeBand());

//  chart.selectAll("text")
//     .data(data)
//    .enter().append("text")
//      .attr("x", x)
//      .attr("y", function(d) { return y(d) + y.rangeBand() / 2; })
//      .attr("dx", -3) // padding-right
//      .attr("dy", ".35em") // vertical-align: middle
//      .attr("text-anchor", "end") // text-align: right
//     .text(String);


//  var chart = d3.select("body").append("svg")
//      .attr("class", "chart")
//     .attr("width", 440)
//      .attr("height", 140)
//    .append("g")
//      .attr("transform", "translate(10,15)")

//  chart.selectAll("line")
//      .data(x.ticks(10))
//    .enter().append("line")
//      .attr("x1", x)
//      .attr("x2", x)
//      .attr("y1", 0)
//      .attr("y2", 120)
//      .style("stroke", "#ccc");

//  chart.selectAll(".rule")
//      .data(x.ticks(10))
//    .enter().append("text")
//      .attr("class", "rule")
//      .attr("x", x)
//      .attr("y", 0)
//      .attr("dy", -3)
//      .attr("text-anchor", "middle")
//      .text(String);     

// chart.append("line")
//      .attr("y1", 0)
//      .attr("y2", 120)
//      .style("stroke", "#000");