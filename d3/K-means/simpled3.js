
// G. Chardon, 2020
// No licence yet, work in progress

function limit_interval(x, range)
{
  return Math.min(range[1], Math.max(range[0], x))
}

var div = d3.select("#plot")

// axe et tout ce qui va avec (échelle, axes, etc.)
// permet de créer des graphes
class Axis {
  constructor(parent, width, height, margin, xrange, yrange)
  {
    this.svg = this.axis = d3.select(parent)
    .append("svg")
    // svg contenant les éléments
    this.svg.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

// échelles pour le tracé
    this.scalex = d3
      .scaleLinear()
      .domain(xrange)
      .range([0, width]);
    this.scaley = d3
        .scaleLinear()
        .domain(yrange)
        .range([height, 0]);
    this.xrange = xrange
    this.yrange = yrange

// axes
  //  var ax = this.axis.append("g").attr("class", "axis")
  //  ax.append("g").attr("transform", "translate(0," + height + ")").attr("transform", "translate(0," + this.scaley(0) + ")")
  //    .call(d3.axisBottom(this.scalex).ticks(10).tickFormat(d3.format(".2f")))
  //  ax.append("g").call(d3.axisLeft(this.scaley).ticks(10).tickFormat(d3.format(".2f")))
  }

// génère un stemplot
  stem(id, data, dragable=false, drag_update, symbol = d3.symbolCircle, rotate = false) {
    var g = this.axis.append("g").attr("id", id)
    return new Stem(g, data, this.scalex, this.scaley, dragable, this.yrange, drag_update, symbol, rotate)
  }
  scatter(id, data, dragable=false, drag_update=null, voronoi=false) {
    var g = this.axis.append("g").attr("id", id)
    return new Scatter(g, data, this.scalex, this.scaley, dragable, this.xrange, this.yrange, drag_update, voronoi)
  }
  line(id, data) {
    var g = this.axis.append("g").attr("id", id)
    return new Line(g, data, this.scalex, this.scaley)
  }
  area(id, data) {
    var g = this.axis.append("g").attr("id", id)
    return new Area(g, data, this.scalex, this.scaley)
  }

  rectangle(id, x, y, w, h)
  {
    this.axis.append("g").append("rect")
      .attr("id", id)
      .attr("x", this.scalex(x))
      .attr("y", this.scaley(y+h))
      .attr("width", this.scalex(x+w) - this.scalex(x))
      .attr("height", this.scaley(y) - this.scaley(y+h))
  }
}



// stemplot
class Stem{
  constructor(g, data, scalex, scaley, dragable=false, range, drag_update,symbol, rotate){

    this.g = g
    g.attr("class", "stem")
    // groupes svg pour les marqueurs et les stems
    this.g1 = g.append("g").attr("class", "markers");
    this.g2 = g.append("g").attr("class", "lines");
    this.range = range

    this.drag_update = drag_update

    //échelle
    this.scalex = scalex;
    this.scaley = scaley;

    this.rotate = rotate

    // on stocke une référence aux données : pour mettre à jour, on modifie les données et on appelle update()
    this.data = data

    // réarrangement des données
    const Z = d3.zip(this.data.x, this.data.y, this.data.r)

    this.symbol = d3.symbol().size(2).type(symbol)

    // création des marqueurs

    this.g1.selectAll("path").data(Z).enter().append("path")
      .attr("d", this.symbol)
      .attr('transform', (d, i) => ("translate(" + this.scalex(d[0]) + ", " + this.scaley(d[1]) + ") scale(" + d[2] + ")") + ((this.rotate && d[1] < 0) ? " rotate(180)":""))
      .attr("fill", "currentcolor")

     if (dragable)
     {
       this.g1.selectAll("path").call(d3.drag().on("drag", (d, i) => (this.data.y[i]=limit_interval(this.scaley.invert(d3.event.y), this.range) , this.drag_update())))
     }

     // création des stems
     this.g2.selectAll("line").data(Z).enter().append("line")
      .attr("x1", (d) => this.scalex(d[0]))
      .attr("x2", (d) => this.scalex(d[0]))
      .attr("y1", this.scaley(0))
      .attr("y2", (d) => this.scaley(d[1]))
      .attr("fill", "currentcolor")
  }

  // update du graphe
  update() {
    const Z = d3.zip(this.data.x, this.data.y, this.data.r)

    this.g1.selectAll("path").data(Z)
      .attr('transform', (d, i) => ("translate(" + this.scalex(d[0]) + ", " + this.scaley(d[1]) + ") scale(" + d[2] + ")"  +((this.rotate && d[1] < 0) ? " rotate(180)":"")))

    this.g2.selectAll("line").data(Z)
    .attr("x1", (d) => this.scalex(d[0]))
    .attr("x2", (d) => this.scalex(d[0]))
    .attr("y1", this.scaley(0))
    .attr("y2", (d) => this.scaley(d[1]))

  }

  line_attr(name, value) {this.g2.attr(name, value)}
  circle_attr(name, value) {this.g1.attr(name, value)}
  attr(name, value) {this.g.attr(name, value)}

}

class Scatter{
  constructor(g, data, scalex, scaley, dragable=false, xrange, yrange, drag_update, voronoi){

    this.g = g
    g.attr("class", "stem")
    // groupes svg pour les marqueurs et les stems
    this.g1 = g.append("g").attr("class", "markers");
    this.g2 = g.append("g").attr("class", "voronoi");

    this.xrange = xrange
    this.yrange = yrange

    this.drag_update = drag_update

    //échelle
    this.scalex = scalex;
    this.scaley = scaley;

    // on stocke une référence aux données : pour mettre à jour, on modifie les données et on appelle update()
    this.data = data
    const Z = d3.zip(this.data.x, this.data.y, this.data.r)

    // création des marqueurs

    const symbol = d3.symbol().size(1).type(d3.symbolCircle)

     this.g1.selectAll("path").data(Z).enter().append("path").attr("d", symbol)
     .attr('transform', (d, i) => ("translate(" + this.scalex(d[0]) + ", " + this.scaley(d[1]) + ") scale(" + d[2] + ")"))

     if (voronoi)
{     var L = this.data.x.length
     this.voronoi = d3.Delaunay.from(Z, d => this.scalex(d[0]),  d => this.scaley(d[1]))
     .voronoi([this.scalex(this.xrange[0]),this.scaley(this.yrange[1]),this.scalex(this.xrange[1]),this.scaley(this.yrange[0])])

     this.g2.append("path").attr("stroke", "blue").attr("stroke-width", 2).attr("d", this.voronoi.render())
}

     // essai de drag
     if (dragable)
     {
       this.g1.selectAll("path").call(d3.drag()
        .on("drag", (d, i) => (
            this.data.x[i]=limit_interval(this.scalex.invert(d3.event.x), this.xrange),
            this.data.y[i]=limit_interval(this.scaley.invert(d3.event.y), this.yrange),
            this.drag_update())))
     }

  }

  // update du graphe
  update() {
    const symbol = d3.symbol().size(1).type(d3.symbolCircle)

    const Z = d3.zip(this.data.x, this.data.y, this.data.r)
    var sel = this.g1.selectAll("path").data(Z)
    sel.exit().remove()
    sel.attr('transform', (d, i) => ("translate(" + this.scalex(d[0]) + ", " + this.scaley(d[1]) + ") scale(" + d[2] + ")"))
  sel.enter().append("path").attr("d", symbol)
      .attr('transform', (d, i) => ("translate(" + this.scalex(d[0]) + ", " + this.scaley(d[1]) + ") scale(" + d[2] + ")"))


//     if (voronoi)
// {     this.voronoi = d3.Delaunay.from(Z, d => this.scalex(d[0]),  d => this.scaley(d[1]))
//     .voronoi([this.scalex(this.xrange[0]),this.scaley(this.yrange[1]),this.scalex(this.xrange[1]),this.scaley(this.yrange[0])])
//     this.g2.selectAll("path").attr("stroke", "blue").attr("stroke-width", 2).attr("d", this.voronoi.render())
// }

  }
  circle_attr(name, value) {this.g1.attr(name, value)}
  attr(name, value) {this.g.attr(name, value)}

}





class Line{
  constructor(g, data, scalex, scaley){

    // groupes svg pour les marqueurs et les stems
    this.g1 = g.append("g").attr("class", "line");
    this.g2 = g.append("g");

    //échelle
    this.scalex = scalex;
    this.scaley = scaley;

    // on stocke une référence aux données : pour mettre à jour, on modifie les données et on appelle update()
    this.data = data

    // création des marqueurs
    const Z = d3.zip(this.data.x, this.data.y, this.data.r)

     //this.g1.selectAll("circle").data(Z).enter().append("circle").attr("cx",  (d) => this.scalex(d[0])).attr("cy",   (d) => this.scaley(d[1])).attr("r", (d) => d[2])


     const XY = d3.zip(this.data.x, this.data.y)
     //this.g2.selectAll("path").append("path").datum(this.data.y).attr("d", d3.line().curve(d3.curveCardinal).x((d, i) => this.scalex(this.data.x[i])).y(d => this.scaley(d)))

     this.g1.append("path").datum(XY).attr("d", d3.line().x(d => this.scalex(d[0])).y(d => this.scaley(d[1]))).attr("fill", "none")
     //this.g1.selectAll("circle").call(d3.drag().on("drag", (d, i) => (this.data.y[i]=this.scaley.invert(d3.event.y) , this.update())))

  }

  // update du graphe
  update() {
    // this.g1.selectAll("circle").data(this.data.x).attr("cx", (d, i) => this.scalex(d))
    // this.g1.selectAll("circle").data(this.data.y).attr("cy", (d, i) => this.scaley(d))
    // this.g1.selectAll("circle").data(this.data.r).attr("r", (d, i) => d)
    const XY = d3.zip(this.data.x, this.data.y)

    this.g1.selectAll("path").datum(XY).attr("d", d3.line().x(d => this.scalex(d[0])).y(d => this.scaley(d[1])))

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


class Area{
  constructor(g, data, scalex, scaley){

    // groupes svg pour les marqueurs et les stems
    this.gp = g.append("g");
    this.gm = g.append("g");

    //échelle
    this.scalex = scalex;
    this.scaley = scaley;

    // on stocke une référence aux données : pour mettre à jour, on modifie les données et on appelle update()
    this.data = data

     this.gp.append("path").datum(this.data.y).attr("fill", "steelblue")
     .attr("d", d3.area().curve(d3.curveStep).x((d, i) => this.scalex(this.data.x[i])).y0(this.scaley(0)).y1(d => (d > 0 ? this.scaley(d) : this.scaley(0))))
     this.gm.append("path").datum(this.data.y).attr("fill", "red")
     .attr("d", d3.area().curve(d3.curveStep).x((d, i) => this.scalex(this.data.x[i])).y0(this.scaley(0)).y1(d => (d < 0 ? this.scaley(d) : this.scaley(0))))

  }

  // update du graphe
  update() {

    this.gp.selectAll("path").datum(this.data.y).attr("d", d3.area().curve(d3.curveStep).x((d, i) => this.scalex(this.data.x[i])).y0(this.scaley(0)).y1(d => (d > 0 ? this.scaley(d) : this.scaley(0))))
    this.gm.selectAll("path").datum(this.data.y).attr("d", d3.area().curve(d3.curveStep).x((d, i) => this.scalex(this.data.x[i])).y0(this.scaley(0)).y1(d => (d < 0 ? this.scaley(d) : this.scaley(0))))

}
}
