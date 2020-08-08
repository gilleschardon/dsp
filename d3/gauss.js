var margins = {
  left: 50,
  right: 20,
  bottom: 20,
  top: 30
};

var L = 1000


var x = Array.from({length: L},d3.randomNormal())
var y = Array.from({length: L},d3.randomNormal())

var y = x.map(d => Math.abs(d) < 0.5 ? d : -d)

var r = Array(L).fill(2)
datax = {x: x, y:y, r:r}


xrange = [-5,5];
yrange = [-5, 5]

axisx = new Axis("#scatter", 300, 300, margins, xrange, yrange)
xs = d3.scaleLinear()
    .domain(d3.extent(x)).nice()
    .range([0, 300])
bins = d3.histogram().domain(xrange).thresholds(xs.ticks(40))(x)

    ys = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)]).nice()
        .range([200, 0])




var sel = d3.select("#hist").append("svg").attr("width", 300).attr("height", 200).append("g")
      .attr("fill", "steelblue")
sel.selectAll("rect").data(bins)
    .enter().append("rect")
      .attr("x", d => xs(d.x0) + 1)
      .attr("width", d => Math.max(0, xs(d.x1) - xs(d.x0) - 1))
      .attr("y", d => ys(d.length))
      .attr("height", d => ys(0) - ys(d.length));

scatter = axisx.scatter("sc",datax)


function update()
{
  angle = this.value * Math.PI * 2
  var z = x.map((d, t) => d * Math.cos(angle) + y[t] * Math.sin(angle))
  bins = d3.histogram().domain(xrange).thresholds(xs.ticks(40))(z)

  sel.selectAll("rect").data(bins).attr("x", d => xs(d.x0) + 1)
        .attr("width", d => Math.max(0, xs(d.x1) - xs(d.x0) - 1))
        .attr("y", d => ys(d.length))
        .attr("height", d => ys(0) - ys(d.length));
}

d3.select('#angle').on("input", update)
