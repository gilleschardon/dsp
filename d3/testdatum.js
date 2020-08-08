
var div = d3.select("#plot")


class Axis {
  constructor(parent, width, height, margin)
  {
    this.axis = d3.select(parent)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }

  circle() {
    var g = this.axis.append("g")
    return new Stem(g)
  }
  stem() {
    var g = this.axis.append("g")
    return new Stem(g)
  }
}



class Circle{
  constructor(g){
    this.g = g;
  }

  plot(data) {
    this.g.selectAll("circle").data(data).enter().append("circle").attr("cx", function (d, i) {return 5*i;})
    .attr("cy", 10)
    .attr("r", function(d) { return d})
  }

  update(data) {
    this.g.selectAll("circle").data(data).attr("cx", function (d, i) {return 5*i;})
    .attr("cy", 10)
    .attr("r", function(d) { return d})
  }
  attr(name, value)
  {
    this.g.selectAll("circle").attr(name, value)
  }
}

class Stem{
  constructor(g){
    this.g1 = g.append("g");
    this.g2 = g.append("g");

  }

  plot(data) {
    this.g1.selectAll("circle").datum(data).append("circle").attr("cx", function (d, i) {return 30*i;})
    .attr("cy", function(d, i) { return 10*d[i]})
    .attr("r", function(d, i) { return d[i]})

    this.g2.selectAll("line").datum(data).append("line")
    .attr("x1", function (d, i) {return i;}).attr("y1", 0)
    .attr("x2" , function (d, i) {return 30*d[i];}).attr("y2", function (d, i) {return 10*d[i];})
    .attr("stroke", "red").attr("stroke-width", 5)
  }

  update(data) {
    this.g1.selectAll("circle").data(data).transition().duration(1000).attr("cx", function (d, i) {return 30*i;})
    .attr("cy", function(d) { return 10*d})
    .attr("r", function(d) { return d})

    this.g2.selectAll("line").data(data).transition().duration(1000)
    .attr("x1", function (d, i) {return 30*i;}).attr("y1", 0)
    .attr("x2" , function (d, i) {return 30*i;}).attr("y2", function (d, i) {return 10*d;})

  }
  line_attr(name, value)
  {
    this.g2.selectAll("line").attr(name, value)
  }
}


var margins = {
  left: 10,
  right: 20,
  bottom: 20,
  top: 30
};

data = [1,2,3,4];
data2 = [10,11,12,13];


axis = new Axis("#plot", 500, 500, margins)

circle = axis.circle()

circle.plot(data)

//circle.update(data2)

circle.line_attr("stroke", "blue")
