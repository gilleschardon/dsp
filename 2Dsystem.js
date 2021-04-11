
var margins = {
  left: 50,
  right: 200,
  bottom: 10,
  top: 10
};

var zzz
var resol_t = 1000

M = math.matrix([[0.1, 0.05], [0, 0.0]])
var step = 0.05

Mstep = math.expm(math.multiply(step, M))

MM = Mstep

initial = [0.1,0.1]

var X = math.matrix(initial)

Tmax = 40
var L = 0;
var r = 10

range = [-0,Tmax];
yrange = [-2, 2]

ntickx = 10
nticky = 5

  datax = {x: [0], y:[initial[0]]}
  datay = {x: [0], y:[initial[1]]}

  dataxy = {x: [initial[0]] , y:[initial[1]]}
  dataxys = {x: [initial[0]] , y:[initial[1]], r:[r]}

function update()
{
  plotx.update()
  ploty.update()
  plotxy.update()
  plotxys.update()
}

function compute_step()
{
  X = math.multiply(Mstep, X)

  xx = math.subset(X, math.index(0))
  yy = math.subset(X, math.index(1))
  datax.y.push(xx)
  datay.y.push(yy)
  datax.x.push(datax.x[L] + step)
  datay.x.push(datay.x[L] + step)

  L = L + 1;

  dataxy.x.push(xx)
  dataxy.y.push(yy)

  dataxys.x = [xx]
  dataxys.y = [yy]

  update()

  if(datax.x[L] > Tmax)
  {
    console.log("stop")
    window.clearInterval(zzz)
  }
}

function moveinitial(i, x, y)
{
   initial = [x, y]
   X = math.matrix(initial)

   datax.y = [x]
   datay.y = [y]

   dataxys.x = [x]
   dataxys.y = [y]

   dataxy.x = [x]
   dataxy.y = [y]

   plotxys.update()
}

function start()
{
   console.log(dataxys)
  zzz = window.setInterval(compute_step, 20)
}
axisx= new Axis("#plot", "x", 800, 200, margins, range, yrange, ntickx, nticky)
axisy= new Axis("#plot", "y", 800, 200, margins, range, yrange, ntickx, nticky)

range3Dy = [-2,2]
range3Dx = [-2,2]

axisxy= new Axis("#plotxy", "pxy", 400, 400, margins, range3Dx, range3Dy, ntickx, nticky)

plotx = axisx.line("x", "\\(x(t)\\)", datax)
ploty = axisy.line("y", "\\(y(t)\\)", datay)

plotxy = axisxy.line('IC13', "", dataxy)
plotxys = axisxy.scatter('IC1', "", dataxys, moveinitial)
d3.select('#start').on("click", start)

update()
