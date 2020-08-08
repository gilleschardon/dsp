
var div = d3.select("#plot")


class Axis {
  constructor(parent, width, height, margin, xrange, yrange)
  {
    this.axis = d3.select(parent)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
.attr("style", "border:solid").append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")



    this.scalex = d3
      .scaleLinear()
      .domain(xrange)
      .range([0, width]);

    this.scaley = d3
        .scaleLinear()
        .domain(yrange)
        .range([height, 0]);

    this.axis.append("g").attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(this.scalex))
      //.call(d3.axisLeft(this.scaley));
    this.axis.append("g").call(d3.axisLeft(this.scaley))
  }

  circle() {
    var g = this.axis.append("g")
    return new Circle(g, scalex, scaley)
  }
  stem() {
    var g = this.axis.append("g")
    return new Stem(g, this.scalex, this.scaley)
  }
}



class Circle{
  constructor(g, scalex, scaley){
    this.g = g;
    this.scalex = scalex;
    this.scaley = scaley;
  }

  plot(data) {
    this.g.selectAll("circle").data(data).enter().append("circle").attr("cx", function (d, i) {return this.scalex(5*i);})
    .attr("cy", this.scaley(10))
    .attr("r", function(d) { return d})
  }

  update(data) {
    this.g.selectAll("circle").data(data).attr("cx", function (d, i) {return this.scalex(5*i);})
    .attr("cy", 10)
    .attr("r", function(d) { return d})
  }
  attr(name, value)
  {
    this.g.selectAll("circle").attr(name, value)
  }
}

class Stem{
  constructor(g, scalex, scaley){
    this.g1 = g.append("g");
    this.g2 = g.append("g");
    this.scalex = scalex;
    this.scaley = scaley;
  }

  plot(datax, datay, datar) {
     this.g1.selectAll("circle").data(datax).enter().append("circle").attr("cx",  (d, i) => this.scalex(i))
     this.g1.selectAll("circle").data(datay).attr("cy", (d, i) => this.scaley(d))
     this.g1.selectAll("circle").data(datar).attr("r", (d, i) => d)


     this.g2.selectAll("line").data(datax).enter().append("line")
     .attr("x1", (d, i) => this.scalex(i)).attr("x2" , (d, i) => this.scalex(i))

     this.g2.selectAll("line").data(datay).attr("y1" , this.scaley(0)).attr("y2", (d, i) => this.scaley(d))
     this.g2.attr("stroke", "red").attr("stroke-width", 5)
  }

  update(datax, datay, datar) {
    var sel = this.g1.selectAll("circle").data(datax)
    sel.attr("cx", (d, i) => this.scalex(i))
    sel.enter().append("circle").attr("cx", (d, i) => this.scalex(i))
    sel.exit().remove()
    this.g1.selectAll("circle").data(datay).attr("cy", (d, i) => this.scaley(d))
    this.g1.selectAll("circle").data(datar).attr("r", (d, i) => d)

    sel = this.g2.selectAll("line").data(datax)
    sel.attr("x1", (d, i) => this.scalex(i)).attr("x2" ,(d, i) => this.scalex(i))
    sel.enter().append("line")
    .attr("x1",(d, i) => this.scalex(i)).attr("x2" ,(d, i) => this.scalex(i))
    sel.exit().remove()


    this.g2.selectAll("line").data(datay).attr("y1" ,  this.scaley(0)).attr("y2", (d, i) => this.scaley(d))
  }
  line_attr(name, value)
  {
    this.g2.attr(name, value)
  }
  circle_attr(name, value)
  {
    this.g1.attr(name, value)
  }
}
