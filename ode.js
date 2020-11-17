
var margins = {
  left: 50,
  right: 400,
  bottom: 10,
  top: 10
};


var resol_t = 1000

var alpha = -2.1

Tmax= 5

var t = [...Array(Tmax*resol_t).keys()].map((t) => t/resol_t)

var y = t.map(t => Math.exp(alpha * t))


var r = 5

datay = {x: t, y:y}



oderange = [-0,Tmax];
yrange = [-1.1, 2.1]
errrange = [-0.2,1.8];
yerrrange = [-5, 0.1]
ntickx = 10
nticky = 5


var step = 10**(+0.2)
//
// var xdis = [...Array(Math.ceil(Tmax/step)).keys()].map((t) => t*step)
// var yd = Array(xdis.length).fill(0)
// var yf = Array(xdis.length).fill(0)
// var yb = Array(xdis.length).fill(0)
// var ycn = Array(xdis.length).fill(0)
// var yrk4 = Array(xdis.length).fill(0)
//
// var datayf = {x:xdis, y:yf, r:yf}
// var datayb = {x:xdis, y:yf, r:yf}
// var dataycn = {x:xdis, y:yf, r:yf}

var dataerrf = {x:[], y:[], r:[]}
var dataerrb = {x:[], y:[], r:[]}
var dataerrcn = {x:[], y:[], r:[]}
var dataerrrk4 = {x:[], y:[], r:[]}

var datayf = {x:[], y:[], r:[]}
var datayb = {x:[], y:[], r:[]}
var dataycn = {x:[], y:[], r:[]}
var datayrk4 = {x:[], y:[], r:[]}

function update()
{
  xdis = [...Array(Math.ceil(Tmax/step)+1).keys()].map((t) => t*step)

  ycn = Array(xdis.length)
  yrk4 = Array(xdis.length)


  yd = xdis.map((t, i) => Math.exp(t * alpha))
  datayf.x = xdis
  datayf.y = xdis.map((t, i) => (1 + alpha*step)**i)
  datayf.r = Array(xdis.length).fill(r)

  datayb.x = xdis
  datayb.y = xdis.map((t, i) => (1 - alpha*step)**(-i))
  datayb.r = Array(xdis.length).fill(r)

  dataycn.x = xdis
  dataycn.y = xdis.map((t, i) => ((1 + alpha*step/2)/(1 - alpha*step/2))**(i))
  dataycn.r = Array(xdis.length).fill(r)

  datayrk4.x = xdis
  datayrk4.r = Array(xdis.length).fill(r)
  datayrk4.y = Array(xdis.length)

  datayrk4.y[0] = 1


  for (var k = 1 ; k < xdis.length ; k++)
    {
         k1 = alpha * datayrk4.y[k-1]
         k2 = alpha * (datayrk4.y[k-1] + step * k1/2)
         k3 = alpha * (datayrk4.y[k-1] + step * k2/2)
         k4 = alpha * (datayrk4.y[k-1] + step * k3)

    datayrk4.y[k] = datayrk4.y[k-1] + step*(k1+2*k2+2*k3+k4)/6
  }

//  ycn = xdis.map((t, i) => ((1 + alpha*step/2)/(1 - alpha*step/2))*(i))


  dataerrf.x.push(-Math.log10(step))
  dataerrf.y.push(Math.log10(yd.reduce((m, t, i) => Math.max(m, Math.abs(t - datayf.y[i])), 0)))
  dataerrf.r.push(r)

  dataerrb.x.push(-Math.log10(step))
  dataerrb.y.push(Math.log10(yd.reduce((m, t, i) => Math.max(m, Math.abs(t - datayb.y[i])), 0)))
  dataerrb.r.push(r)

  dataerrcn.x.push(-Math.log10(step))
  dataerrcn.y.push(Math.log10(yd.reduce((m, t, i) => Math.max(m, Math.abs(t - dataycn.y[i])), 0)))
  dataerrcn.r.push(r)

  dataerrrk4.x.push(-Math.log10(step))
  dataerrrk4.y.push(Math.log10(yd.reduce((m, t, i) => Math.max(m, Math.abs(t - datayrk4.y[i])), 0)))
  dataerrrk4.r.push(r)

  plotyf.update()
  plotyb.update()
  plotycn.update()
  plotyrk4.update()

  plotyfl.update()
  plotybl.update()
  plotycnl.update()
  plotyrk4l.update()

  ploterrf.update()
  ploterrb.update()
  ploterrcn.update()
  ploterrrk4.update()

}

function update_resol()
{

  step = 10**(-(this.value-20)/100)
  console.log(step)
  update()

}


axisode= new Axis("#plotode", 1400, 400, margins, oderange, yrange, ntickx, nticky)
axiserr = new Axis("#plotode", 1400, 400, margins, errrange, yerrrange, ntickx, nticky)

ploty = axisode.line("y", "Analytic", datay)
plotyf = axisode.scatter("yf", "Forward", datayf)
plotyb = axisode.scatter("yb", "Backward", datayb)
plotycn = axisode.scatter("ycn", "Crank-Nicholson", dataycn)
plotyrk4 = axisode.scatter("yrk4", "RK4", datayrk4)

plotyfl = axisode.line("yf", "", datayf)
plotybl = axisode.line("yb", "", datayb)
plotycnl = axisode.line("ycn", "", dataycn)
plotyrk4l = axisode.line("yrk4", "", datayrk4)

ploterrf = axiserr.scatter("yf", "Forward", dataerrf)
ploterrb = axiserr.scatter("yb", "Backward", dataerrb)
ploterrcn = axiserr.scatter("ycn", "Crank-Nicholson", dataerrcn)
ploterrrk4 = axiserr.scatter("yrk4", "RK4", dataerrrk4)

d3.select('#resol').on("input", update_resol)


update()
