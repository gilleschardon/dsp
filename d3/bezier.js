

ir = [1,-1]


var margins = {
  left: 50,
  right: 200,
  bottom: 10,
  top: 10
};

var L = 20
var resol = 10

controlpoints = {x: [-.5, 0, 0.5], y: [0, 0.5, 0], r:[15,15,15]}

lines1 = {x1: [0,0], y1:[0,0], x2: [0,0], y2: [0,0]}
lines2 = {x1: [0], y1:[0], x2: [0], y2: [0]}

int =  {x: [0, 0], y: [0, 0], r:[5,5]}
point =  {x: [0], y: [0], r:[5]}


xrange = [-1,1];
yrange = [-1, 1]


ntickx = 1
nticky = 1

axisbezier = new Axis("#bezier", 400, 400, margins, xrange, yrange, ntickx, nticky)

t = document.getElementById("t").value / document.getElementById("t").getAttribute("max")




function update_data()
{
  lines1.x1 = [controlpoints.x[0], controlpoints.x[1]]
  lines1.y1 = [controlpoints.y[0], controlpoints.y[1]]
  lines1.x2 = [controlpoints.x[1], controlpoints.x[2]]
  lines1.y2 = [controlpoints.y[1], controlpoints.y[2]]

  int.x = [(1 - t) * controlpoints.x[0] + t * controlpoints.x[1], (1 - t) * controlpoints.x[1] + t * controlpoints.x[2]]
  int.y = [(1 - t) * controlpoints.y[0] + t * controlpoints.y[1], (1 - t) * controlpoints.y[1] + t * controlpoints.y[2]]

  lines2.x1 = [int.x[0]]
  lines2.x2 = [int.x[1]]
  lines2.y1 = [int.y[0]]
  lines2.y2 = [int.y[1]]

  point.x = [(1 - t) * int.x[0] + t * int.x[1]]
  point.y = [(1 - t) * int.y[0] + t * int.y[1]]

}


function update_t()
{
  t = this.value / 100
  update()
}

function update()
{
  update_data()

  l1.update()
  l2.update()

  cpoints.update()
  intp.update()
  pp.update()

}

cpoints = axisbezier.scatter("control", controlpoints, true, update)
intp = axisbezier.scatter("control", int, true, update)
pp = axisbezier.scatter("control", point, true, update)

l1 = axisbezier.lines("lines", "lines", lines1)
l2 = axisbezier.lines("lines", "lines", lines2)


d3.select('#t').on("input", update_t)

update()
