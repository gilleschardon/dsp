
var margins = {
  left: 50,
  right: 200,
  bottom: 10,
  top: 10
};


var resol_t = 1000

var alpha = -2.1

var initial = [1,1,1]

var initial2 = [1,1,1.1]
Tmax = 40

var step = 0.02

var sigma = 10
var rho = 28
var beta = 8/3

var L = 0;

function grad(X, sigma, rho, beta)
{
  return [sigma * (X[1] - X[0]), X[0] * (rho - X[2]) - X[1], X[0]*X[1] - beta * X[2]]
}

var J = Math.sqrt(3)/2

// function proj1(X)
// {
//   return J * (+X[0] + X[1])
// }
// function proj2(X)
// {
//   return X[2] + (-X[0]+X[1])/2
// }

function proj1(X)
{
  return X[0]
}
function proj2(X)
{
  return X[2]
}

var r = 5

datax = {x: [0], y:[initial[0]]}
datay = {x: [0], y:[initial[1]]}
dataz = {x: [0], y:[initial[2]]}

datax2 = {x: [0], y:[initial2[0]]}
datay2 = {x: [0], y:[initial2[1]]}
dataz2 = {x: [0], y:[initial2[2]]}

data3D = {x: [proj1(initial)] , y:[proj2(initial)]}

data3D2 = {x: [proj1(initial2)] , y:[proj2(initial2)]}


data3Ds = {x: [proj1(initial)] , y:[proj2(initial)], r:[10]}

data3D2s = {x: [proj1(initial2)] , y:[proj2(initial2)], r:[10]}
console.log(data3D)

range = [-0,Tmax];
yrange = [-20, 50]

ntickx = 10
nticky = 5



function update()
{



  plotx.update()
  ploty.update()
  plotz.update()
  plotx2.update()
  ploty2.update()
  plotz2.update()
  plot3D.update()

  plot3D2.update()
  plot3Ds.update()
  plot3D2s.update()
}

function compute_step()
{

  var G = grad([datax.y[L], datay.y[L],dataz.y[L]], sigma, rho, beta)

  datax.y.push(datax.y[L] + step * G[0])
  datay.y.push(datay.y[L] + step * G[1])
  dataz.y.push(dataz.y[L] + step * G[2])
  datax.x.push(datax.x[L] + step)
  datay.x.push(datay.x[L] + step)
  dataz.x.push(dataz.x[L] + step)

  var G = grad([datax2.y[L], datay2.y[L],dataz2.y[L]], sigma, rho, beta)

  datax2.y.push(datax2.y[L] + step * G[0])
  datay2.y.push(datay2.y[L] + step * G[1])
  dataz2.y.push(dataz2.y[L] + step * G[2])
  datax2.x.push(datax2.x[L] + step)
  datay2.x.push(datay2.x[L] + step)
  dataz2.x.push(dataz2.x[L] + step)


  L = L + 1;

  var xx = proj1([datax.y[L], datay.y[L], dataz.y[L]])
  var yy = proj2([datax.y[L], datay.y[L], dataz.y[L]])

  var xx2 = proj1([datax2.y[L], datay2.y[L], dataz2.y[L]])
  var yy2 = proj2([datax2.y[L], datay2.y[L], dataz2.y[L]])


  data3D.x.push(xx)
  data3D.y.push(yy)
  data3D2.x.push(xx2)
  data3D2.y.push(yy2)
  data3Ds.x = [xx]
  data3Ds.y = [yy]
  data3D2s.x = [xx2]
  data3D2s.y = [yy2]


  update()

  if(datax.x[L] > Tmax)
  {
    console.log("stop")
    window.clearInterval(zzz)
  }

}


axisx= new Axis("#plotlorenz", "x", 800, 200, margins, range, yrange, ntickx, nticky)
axisy= new Axis("#plotlorenz", "y", 800, 200, margins, range, yrange, ntickx, nticky)
axisz= new Axis("#plotlorenz", "z", 800, 200, margins, range, yrange, ntickx, nticky)

range3Dy = [-10,60]
range3Dx = [-35,35]

axis3D= new Axis("#plot3D", "p3d", 400, 400, margins, range3Dx, range3Dy, ntickx, nticky)


plotx = axisx.line("IC1", "\\(x(t)\\)", datax)
ploty = axisy.line("IC1", "\\(y(t)\\)", datay)
plotz = axisz.line("IC1", "\\(z(t)\\)", dataz)

plotx2 = axisx.line("IC2", "\\(x(t)\\)", datax2)
ploty2 = axisy.line("IC2", "\\(y(t)\\)", datay2)
plotz2 = axisz.line("IC2", "\\(z(t)\\)", dataz2)

plot3D = axis3D.line('IC13', "", data3D)
plot3D2 = axis3D.line('IC23', "", data3D2)
plot3Ds = axis3D.scatter('IC1', "", data3Ds)
plot3D2s = axis3D.scatter('IC2', "", data3D2s)
d3.select('#step').on("click", compute_step)


update()

var zzz = window.setInterval(compute_step, 20)
