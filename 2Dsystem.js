
var margins = {
  left: 50,
  right: 200,
  bottom: 10,
  top: 10
};

var timer
var resol_t = 1000

M = math.matrix([[0, 0], [0, 0]])
var step = 0.05

Mstep = math.expm(math.multiply(step, M))

MM = Mstep

initial = [[0.1,0.1], [0.2, 0.3]]

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

  datap = {x: [0], y:[0], r: [10]}


  rangepx = [-1, 1]
  rangepy = [-1, 1]

  Lpara = 100;
  u = [...Array(Lpara).keys()].map(t => t/Lpara * 2 - 1)
  datapara = {
    x: u,
    y: u.map(t => t**2/4)
  }

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
    window.clearInterval(timer)
  }
}

function moveinitial(i, x, y)
{
   initial = [x, y]
   X = math.matrix(initial)

   datax.y = [x]
   datay.y = [y]
   datax.x = [0]
   datay.x = [0]

   dataxys.x = [x]
   dataxys.y = [y]

   dataxy.x = [x]
   dataxy.y = [y]

   plotxys.update()
}

function start()
{
   console.log(dataxys)
  timer = window.setInterval(compute_step, 20)
}

function stop()
{
  window.clearInterval(timer)
}

function movepoincare(i, x, y)
{
  delta = x**2 - 4 * y

  if (delta == 0)
  {
    a = x;
    d = 0;
    b = 0;
    c = 0;
  }
  else if (delta > 0)
  {
    a = (x + Math.sqrt(delta))/2
    d = (x - Math.sqrt(delta))/2
    b = 0;
    c = 0;
  }
  else if (delta < 0)
  {
    a = x/2
    d = x/2
    b = y - x**2/4
    c =  -b;
  }

  M = math.matrix([[a, b], [c, d]])

  console.log(M)
  Mstep = math.expm(math.multiply(step, M))

  MM = Mstep
  datap.x = [x]
  datap.y = [y]
  scatp.update()

}

function reset()
{
  window.clearInterval(timer)


  datax.y = [initial[0]]
  datay.y = [initial[1]]
  dataxys.x = [initial[0]]
  dataxys.y = [initial[1]]
  dataxy.x = [initial[0]]
  dataxy.y = [initial[1]]
  datax.x = [0]
  datay.x = [0]

  X = math.matrix(initial)

  L = 0
  update()


}


marginsp = {
  left: 0,
  right: 0,
  bottom: 0,
  top: 0
};


axisx= new Axis("#plot", "x", 800, 200, margins, range, yrange, ntickx, nticky)
axisy= new Axis("#plot", "y", 800, 200, margins, range, yrange, ntickx, nticky)
axisp= new Axis("#poincare", "poincare", 400, 400, marginsp, rangepx, rangepy, ntickx, nticky)

scatp = axisp.scatter("poincare", "", datap, movepoincare)
para = axisp.line("para", "", datapara)

range3Dy = [-2,2]
range3Dx = [-2,2]

axisxy= new Axis("#plotxy", "pxy", 400, 400, margins, range3Dx, range3Dy, ntickx, nticky)

plotx = axisx.line("x", "\\(x(t)\\)", datax)
ploty = axisy.line("y", "\\(y(t)\\)", datay)

plotxy = axisxy.line('IC13', "", dataxy)
plotxys = axisxy.scatter('IC1', "", dataxys, moveinitial)
d3.select('#start').on("click", start)
d3.select('#reset').on("click", reset)
d3.select('#stop').on("click", stop)

update()
