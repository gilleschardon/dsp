
var margins = {
  left: 50,
  right: 200,
  bottom: 10,
  top: 10
};


var resol_t = 1000


var initial = [0.2,0.4]

Tmax = 100

var step = 0.02

var alpha = 1;
var beta = 1
var gamma = 1;
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
yrange = [0, 5]

ntickx = 10
nticky = 5



function update()
{



  plotx.update()
  ploty.update()

  plot2D.update()

  plot2Ds.update()
}

function compute_step()
{

  var G = grad([datax.y[L], datay.y[L]])

  datax.y.push(datax.y[L] + step * G[0])
  datay.y.push(datay.y[L] + step * G[1])
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
    console.log("stop")
    window.clearInterval(zzz)
  }

}


axisx= new Axis("#plotlotka", "x", 800, 200, margins, range, yrange, ntickx, nticky)

range3Dy = [-0,5]
range3Dx = [-0,5]

axis2D= new Axis("#plot2D", "p3d", 400, 400, margins, range3Dx, range3Dy, ntickx, nticky)


plotx = axisx.line("IC1", "\\(x(t)\\)", datax)
ploty = axisx.line("IC2", "\\(y(t)\\)", datay)


plot2D = axis2D.line('IC13', "", data2D)
plot2Ds = axis2D.scatter('IC1', "", data2Ds)
d3.select('#step').on("click", compute_step)


update()

var zzz = window.setInterval(compute_step, 10)
