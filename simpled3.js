
function limit_interval(x, range)
{
  return Math.min(range[1], Math.max(range[0], x))
}

// axe et tout ce qui va avec (échelle, axes, etc.)
// permet de créer des graphes
class Axis {
  // parent id du contenant
  // id du svg à créer
  // width, height, scalaires
  // margin left right top bottom
  // xrange yrange arrays
  constructor(parent, id, width, height, margin, xrange, yrange, ntickx, nticky)
  {
	this.parent = parent
  this.id = id
  this.width = width
  this.height = height
  this.margin = margin

  this.svg = d3.select(parent).append("svg")
    // svg contenant les éléments
            .attr("id", id)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)

  //clip path
  this.svg.append("clipPath")
	 .attr("id", id + "clip")
		.append("rect")
		  .attr("x", margin.left)
		  .attr("y", margin.top)
		  .attr("width", width)
		  .attr("height", height)

  // scales
  this.xrange = xrange
  this.yrange = yrange

// axes
  this.scales_and_axis()
  }
  scales_and_axis()
  {

    this.scalex = d3
        .scaleLinear()
        .domain(this.xrange)
        .range([this.margin.left, this.width+this.margin.left]);
      this.scaley = d3
          .scaleLinear()
          .domain(this.yrange)
          .range([this.height+this.margin.top, this.margin.top]);

    this.ax = this.svg.append("g").attr("class", "axis")

    this.legend_shift = 0;

    this.legend = this.svg.append("g").attr("class", "legend").attr("transform", "translate(" + (this.width + this.margin.left) + ',0)')

    this.ax.selectAll("line.xgrid").data(this.scaley.ticks(nticky)).enter()
    .append("line")
        .attr("class", "xgrid")
        .attr("x1", this.margin.left)
        .attr("x2", this.width+this.margin.left)
        .attr("y1",  (d) =>  this.scaley(d))
        .attr("y2", (d) => this.scaley(d))

    this.ax.selectAll("line.ygrid").data(this.scalex.ticks(ntickx)).enter()
        .append("line")
            .attr("class", "ygrid")
            .attr("y1", this.margin.top)
            .attr("y2", this.height+this.margin.top)
            .attr("x1",  (d) =>  this.scalex(d))
            .attr("x2", (d) => this.scalex(d))

    this.ax
      .append("line")
        .attr("class", "frame")
        .attr("y1", this.margin.top)
        .attr("y2", this.height+this.margin.top)
        .attr("x1", this.margin.left)
        .attr("x2", this.margin.left)
      this.ax.append("line")
        .attr("class", "frame")
        .attr("y1", this.margin.top)
        .attr("y2", this.height+this.margin.top)
        .attr("x1", this.margin.left + this.width)
        .attr("x2", this.margin.left + this.width)
      this.ax.append("line")
          .attr("class", "frame")
          .attr("y1", this.margin.top)
          .attr("y2", this.margin.top)
          .attr("x1", this.margin.left)
          .attr("x2", this.margin.left + this.width)
      this.ax.append("line")
          .attr("class", "frame")
          .attr("y1", this.margin.top + this.height)
          .attr("y2", this.height+this.margin.top)
          .attr("x1", this.margin.left)
          .attr("x2", this.margin.left + this.width)


    this.ax.append("g").attr("transform", "translate(0," + this.height + ")").attr("transform", "translate(0," + this.scaley(0) + ")") // axe x au zero
      .call(d3.axisBottom(this.scalex).ticks(ntickx).tickFormat(d3.format("")))
    this.ax.append("g").attr("transform", "translate(" + this.width + ",0)").attr("transform", "translate(" + this.scalex(0) + ",0)") // axe x au zero
    .call(d3.axisLeft(this.scaley).ticks(nticky).tickFormat(d3.format("")))

  }

// génère un stemplot
// id du plot
// data
// dragable si on peut tirer les points
// drag_update pour mettre à jour les données (et appeler l'update)
// symbol
// rotate si on tourne pour les données négatives (pour les diracs)
stem(id, tag, data, drag_update = null, symbol = d3.symbol().size(1).type(d3.symbolCircle), rotate = false) {
  var g = this.svg.append("g").attr("class", id).attr("clip-path", "url(#" + this.id + "clip)")

  if (tag != "")
  {
    this.legend.append('path').attr("d", symbol)
    .attr('transform', "translate(20, " + (20 + this.legend_shift) +")  scale(" + 10 + ")")
    .attr("fill", "currentcolor")
    .attr("class", id)

    var fo = this.legend.append("foreignObject").attr('x', '40').attr('y', (10 + this.legend_shift)).attr('width', '200').attr("height", "100")
    fo.append('xhtml:p').attr("style", "margin:0 ; vertical-align:middle").text(tag)

    this.legend_shift = this.legend_shift + 30
  }
  return new Stem(g, data, this.scalex, this.scaley, this.yrange, drag_update, symbol, rotate)
}

  // voronoi on trace les cellules
  scatter(id, tag, data, drag_update=null, symbol = d3.symbol().size(1).type(d3.symbolCircle), voronoi=false) {
    var g = this.svg.append("g").attr("class", id).attr("clip-path", "url(#" + this.id + "clip)")

    if (tag != "")
    {
    this.legend.append('path').attr("d", symbol)
      .attr('transform', "translate(20, " + (20 + this.legend_shift) +")  scale(" + 10 + ")")
      .attr("fill", "currentcolor")
      .attr("class", id)

    var fo = this.legend.append("foreignObject").attr('x', '40').attr('y', (10 + this.legend_shift)).attr('width', '200').attr("height", "100")
    fo.append('xhtml:p').attr("style", "margin:0 ; vertical-align:middle").text(tag)
  this.legend_shift = this.legend_shift + 30
}
    return new Scatter(g, data, this.scalex, this.scaley, this.xrange, this.yrange, drag_update, symbol, voronoi)

  }
  line(id, tag, data) {
    var g = this.svg.append("g").attr("class", id).attr("clip-path", "url(#" + this.id + "clip)")

    if (tag != "")
    {
        this.legend.append('line')

	.attr("x1", -10)
	.attr("y1", 0)
	.attr("x2", 10)
	.attr("y2", 0)
      .attr('transform', "translate(20, " + (20 + this.legend_shift) +")")
      .attr("stroke", "currentcolor")
      .attr("class", id + " line")

    var fo = this.legend.append("foreignObject").attr('x', '40').attr('y', (10 + this.legend_shift)).attr('width', '200').attr("height", "100")
    fo.append('xhtml:p').attr("style", "margin:0 ; vertical-align:middle").text(tag)

  this.legend_shift = this.legend_shift + 30
}

    return new Line(g, data, this.scalex, this.scaley)
  }
  area(id, tag, data) {
    var g = this.svg.append("g").attr("class", id).attr("clip-path", "url(" + this.id + "clip)")
    return new Area(g, data, this.scalex, this.scaley)


  }

  lines(id, tag, data) {
    var g = this.svg.append("g").attr("class", id)
    return new Lines(g, data, this.scalex, this.scaley)
  }

  rectangle(id, tag, data)
  {
    var g = this.svg.append("g").attr("class", id)
    return new Rect(g, data, this.scalex, this.scaley)
  }
}


// stemplot
class Stem{
  constructor(g, data, scalex, scaley, range, drag_update,symbol , rotate){

    this.g = g
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

    this.symbol = symbol//d3.symbol().size(2).type(symbol)

    // création des marqueurs
    this.g1.selectAll("path").data(Z).enter()
    .append("path")
      .attr("d", this.symbol)
      .attr('transform', (d, i) => ("translate(" + this.scalex(d[0]) + ", " + this.scaley(d[1]) + ") scale(" + d[2] + ")") + ((this.rotate && d[1] < 0) ? " rotate(180)":"")) // on déplace au bon endroit et on tourne, si il faut
      .attr("fill", "currentcolor")

     if (drag_update)
     {
       // modifie les données (sur un seul axe) et appelle drag_update
       //this.g1.selectAll("path").call(d3.drag().on("drag", (d, i) => (this.data.y[i]=limit_interval(this.scaley.invert(d3.event.y), this.range) , this.drag_update())))
       this.g1.selectAll("path").call(d3.drag().on("drag", (d, i) => (this.drag_update(i, this.scalex.invert(d3.event.x), this.scaley.invert(d3.event.y)))))
     }

     // création des stems
     this.g2.selectAll("line").data(Z).enter().append("line")
      .attr("x1", (d) => this.scalex(d[0]))
      .attr("x2", (d) => this.scalex(d[0]))
      .attr("y1", this.scaley(0))
      .attr("y2", (d) => this.scaley(d[1]))
      .attr("stroke", "currentcolor")
  }

  // update du graphe
  update() {
    const Z = d3.zip(this.data.x, this.data.y, this.data.r)

    var selp = this.g1.selectAll("path").data(Z)

    selp.exit().remove()
    selp.enter().append("path").attr("d", this.symbol).attr("fill", "currentcolor").attr('transform', (d, i) => ("translate(" + this.scalex(d[0]) + ", " + this.scaley(d[1]) + ") scale(" + d[2] + ")"  +((this.rotate && d[1] < 0) ? " rotate(180)":"")))

    selp.attr('transform', (d, i) => ("translate(" + this.scalex(d[0]) + ", " + this.scaley(d[1]) + ") scale(" + d[2] + ")"  +((this.rotate && d[1] < 0) ? " rotate(180)":"")))

    const sell = this.g2.selectAll("line").data(Z)
    sell.exit().remove()
    sell.enter().append("line").attr("stroke", "currentcolor").attr("x1", (d) => this.scalex(d[0]))
    .attr("x2", (d) => this.scalex(d[0]))
    .attr("y1", this.scaley(0))
    .attr("y2", (d) => this.scaley(d[1]))
    sell.attr("x1", (d) => this.scalex(d[0]))
    .attr("x2", (d) => this.scalex(d[0]))
    .attr("y1", this.scaley(0))
    .attr("y2", (d) => this.scaley(d[1]))
  }

  line_attr(name, value) {this.g2.attr(name, value)}
  marker_attr(name, value) {this.g1.attr(name, value)}
  attr(name, value) {this.g.attr(name, value)}

}

class Scatter{
  constructor(g, data, scalex, scaley, xrange, yrange, drag_update, symbol, voronoi){

    this.g = g
    // groupes svg pour les marqueurs et les stems
    this.g1 = g.append("g").attr("class", "markers");
    this.g2 = g.append("g").attr("class", "voronoi");

    this.xrange = xrange
    this.yrange = yrange

    this.drag_update = drag_update

    //échelle
    this.scalex = scalex;
    this.scaley = scaley;

    this.voronoi = voronoi

    // on stocke une référence aux données : pour mettre à jour, on modifie les données et on appelle update()
    this.data = data
    const Z = d3.zip(this.data.x, this.data.y, this.data.r)

    // création des marqueurs

    this.symbol = symbol

     this.g1.selectAll("path").data(Z).enter().append("path").attr("d", this.symbol)
     .attr('transform', (d, i) => ("translate(" + this.scalex(d[0]) + ", " + this.scaley(d[1]) + ") scale(" + d[2] + ")")).attr("fill", "currentcolor")

     if (this.voronoi)
     {
       var L = this.data.x.length
       this.voronoi = d3.Delaunay.from(Z, d => this.scalex(d[0]),  d => this.scaley(d[1]))
       .voronoi([this.scalex(this.xrange[0]),this.scaley(this.yrange[1]),this.scalex(this.xrange[1]),this.scaley(this.yrange[0])])

       this.g2.append("path").attr("stroke", "blue").attr("stroke-width", 2).attr("d", this.voronoi.render())
     }

     if (drag_update)
     {
       // on modifie les données sur les deux axes et on appelle drag_update
       this.g1.selectAll("path").call(d3.drag()
        .on("drag", (d, i) => (this.drag_update(i, this.scalex.invert(d3.event.x), this.scaley.invert(d3.event.y)))))
     }
  }

  // update du graphe
  update() {

    const Z = d3.zip(this.data.x, this.data.y, this.data.r)

    var selp = this.g1.selectAll("path").data(Z)

    selp.exit().remove()
    selp.enter().append("path").attr("d", this.symbol).attr("fill", "currentcolor").attr('transform', (d, i) => ("translate(" + this.scalex(d[0]) + ", " + this.scaley(d[1]) + ") scale(" + d[2] + ")"  +((this.rotate && d[1] < 0) ? " rotate(180)":"")))
    selp.attr('transform', (d, i) => ("translate(" + this.scalex(d[0]) + ", " + this.scaley(d[1]) + ") scale(" + d[2] + ")"  +((this.rotate && d[1] < 0) ? " rotate(180)":"")))

    if (this.voronoi)
    {     this.voronoi = d3.Delaunay.from(Z, d => this.scalex(d[0]),  d => this.scaley(d[1]))
      .voronoi([this.scalex(this.xrange[0]),this.scaley(this.yrange[1]),this.scalex(this.xrange[1]),this.scaley(this.yrange[0])])
      this.g2.selectAll("path").attr("stroke", "blue").attr("stroke-width", 2).attr("d", this.voronoi.render())
    }
  }
  marker_attr(name, value) {this.g1.attr(name, value)}
  attr(name, value) {this.g.attr(name, value)}
}

class Line{
  constructor(g, data, scalex, scaley){

    // groupes svg pour les marqueurs et les stems
    this.g1 = g.append("g").attr("class", "line");

    //échelle
    this.scalex = scalex;
    this.scaley = scaley;

    // on stocke une référence aux données : pour mettre à jour, on modifie les données et on appelle update()
    this.data = data

     const XY = d3.zip(this.data.x, this.data.y)
     this.g1.append("path").datum(XY).attr("d", d3.line().x(d => this.scalex(d[0])).y(d => this.scaley(d[1]))).attr("fill", "none").attr("stroke", "currentcolor")
  }

  // update du graphe
  update() {
    const XY = d3.zip(this.data.x, this.data.y)
    this.g1.selectAll("path").datum(XY).attr("d", d3.line().x(d => this.scalex(d[0])).y(d => this.scaley(d[1])))
  }
}


class Rect{
  constructor(g, data, scalex, scaley){

    // groupes svg pour les marqueurs et les stems
    this.g1 = g.append("g").attr("class", "rect");

    //échelle
    this.scalex = scalex;
    this.scaley = scaley;

    // on stocke une référence aux données : pour mettre à jour, on modifie les données et on appelle update()
    this.data = data

     const XY = d3.zip(this.data.x, this.data.y, this.data.width, this.data.height)
     this.g1.selectAll("rect").data(XY).enter().append("rect").attr("x", (d) => this.scalex(d[0])).attr("y", (d) => this.scaley(d[1])).attr("width", (d) => + this.scalex(d[0] + d[2]) - this.scalex(d[0])).attr("height", (d) => - this.scaley(d[1] + d[3]) + this.scaley(d[1])).attr("fill", "currentcolor").attr("stroke", "none")
  }

  // update du graphe
  update() {
    const XY = d3.zip(this.data.x, this.data.y, this.data.width, this.data.height)
    this.g1.selectAll("rect").data(XY).attr("x", (d) => this.scalex(d[0])).attr("y", (d) => this.scaley(d[1])).attr("width", (d) =>  this.scalex(d[0] + d[2]) - this.scalex(d[0])).attr("height", (d) =>  - this.scaley(d[1] + d[3]) + this.scaley(d[1]))

  }
}

class Lines{
  constructor(g, data, scalex, scaley){

    // groupes svg pour les marqueurs et les stems
    this.g1 = g.append("g").attr("class", "lines");

    //échelle
    this.scalex = scalex;
    this.scaley = scaley;

    // on stocke une référence aux données : pour mettre à jour, on modifie les données et on appelle update()
    this.data = data

     const XY = d3.zip(this.data.x1, this.data.y1, this.data.x2, this.data.y2)

     this.g1.selectAll("line").data(XY).enter().append("line").attr("x1", (d) => this.scalex(d[0])).attr("y1", (d) => this.scaley(d[1])).attr("x2", (d) => this.scalex(d[2])).attr("y2", (d) => this.scaley(d[3])).attr("fill", "none").attr("stroke", "currentcolor")
  }

  // update du graphe
  update() {
    const XY = d3.zip(this.data.x1, this.data.y1, this.data.x2, this.data.y2)
    this.g1.selectAll("line").data(XY).attr("x1", (d) => this.scalex(d[0])).attr("y1", (d) => this.scaley(d[1])).attr("x2", (d) => this.scalex(d[2])).attr("y2", (d) => this.scaley(d[3]))
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
