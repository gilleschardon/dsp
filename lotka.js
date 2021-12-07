
var margins = {
  left: 50,
  right: 200,
  bottom: 10,
  top: 10
};


var resol_t = 1000


var initial = [1,1]

Tmax = 20

var step = 0.02

var alpha = 0.8;
var beta = 1
var gamma = 2;
var delta = 1

var L = 0;

function grad(X)
{
  return [alpha * X[0] - beta * X[0] * X[1], -gamma * X[1] + delta * X[0]*X[1]]
}


 function proj1(X)
 {
   return X[0]
 }
 function proj2(X)
 {
   return X[1]
 }

var r = 5

datax = {x: [0], y:[initial[0]]}
datay = {x: [0], y:[initial[1]]}

data2D = {x: [proj1(initial)] , y:[proj2(initial)]}



data2Ds = {x: [proj1(initial)] , y:[proj2(initial)], r:[10]}


range = [-0,Tmax];
yrange = [0, 8]

ntickx = 10
nticky = 5


function moveinitial(i, x, y)
{
   datax.y = [x]
   datay.y = [y]
   datax.x = [0]
   datay.x = [0]

   data2D.x = [x]
   data2D.y = [y]

   data2Ds.x = [x]
   data2Ds.y = [y]
   L = 0;
   update()
}

function reset()
{
  stop()
   datax.y = [datax.y[0]]
   datay.y = [datay.y[0]]
   datax.x = [0]
   datay.x = [0]

   data2D.x = [data2D.x[0]]
   data2D.y = [data2D.y[0]]

   data2Ds.x = [data2D.x[0]]
   data2Ds.y = [data2D.y[0]]
   L = 0;
   update()
}

function update()
{



  plotx.update()
  ploty.update()

  plot2D.update()

  plot2Ds.update()
}

function compute_step()
{

  //var G = grad([datax.y[L], datay.y[L]])

  var newx = datax.y[L] / (1 - step * (alpha - beta * datay.y[L]))
  var newy = datay.y[L] + step * datay.y[L] * (-gamma + delta * newx)

  datax.y.push(newx)//datax.y[L] + step * G[0])
  datay.y.push(newy)//datay.y[L] + step * G[1])
  datax.x.push(datax.x[L] + step)
  datay.x.push(datay.x[L] + step)


  L = L + 1;

  var xx = proj1([datax.y[L], datay.y[L]])
  var yy = proj2([datax.y[L], datay.y[L]])


  data2D.x.push(xx)
  data2D.y.push(yy)

  data2Ds.x = [xx]
  data2Ds.y = [yy]


  update()

  if(datax.x[L] > Tmax)
  {
    window.clearInterval(timer)
  }

}
var timer

function start()
{
  timer = window.setInterval(compute_step, 20)
}

function stop()
{
  window.clearInterval(timer)
}


axisx= new Axis("#plotlotka", "x", 800, 400, margins, range, yrange, ntickx, nticky)

range3Dy = [-0,8]
range3Dx = [-0,8]

axis2D= new Axis("#plot2D", "p3d", 400, 400, margins, range3Dx, range3Dy, ntickx, nticky)


plotx = axisx.line("IC1", "\\(x(t)\\)", datax)
ploty = axisx.line("IC2", "\\(y(t)\\)", datay)


plot2D = axis2D.line('IC13', "", data2D)
plot2Ds = axis2D.scatter('IC1', "", data2Ds, moveinitial)
d3.select('#step').on("click", compute_step)


update()


d3.select('#start').on("click", start)
d3.select('#reset').on("click", reset)
d3.select('#stop').on("click", stop)
