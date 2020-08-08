
var margins = {
  left: 50,
  right: 20,
  bottom: 20,
  top: 30
};

var nu = 0.1

var K = 2

var Lt = 20
var Lf = 0.5

var N = 1000

var x = d3.range(-Lt, Lt, 2*Lt/ N)
var y = x.map(t => Math.cos(2 * Math.PI * t * nu))
var ys = x.map(t => Math.cos(2 * Math.PI * t * nu))

var xd = d3.range(-Lt, Lt)
var yd = xd.map(t => Math.cos(2 * Math.PI * t * nu))

var xds = xd.map(t => K * t)
var yds = xds.map(t => Math.cos(2 * Math.PI * t * nu))



LL = 10
LLL = d3.range(-LL, LL)

nup =  LLL.map(t => t + nu)
num = LLL.map(t => t - nu)

nup2 = LLL.map(t => t + K * nu)
num2 = LLL.map(t => t - K *nu)

half = nup.map(t => 0.5)
R = nup.map(t => 2)





const cosf = (t => Math.cos(nu * Math.PI * 2 * t))



function update_K()
{
  K = this.value
  nurange = [-Lf*K, Lf*K]

  d3.select('#plotfrequency2').selectAll("*").remove();

  axisy2 = new Axis("#plotfrequency2", 800, 300, margins, nurange, yrange)
  axisy2.rectangle("domainnu", -0.5, 0, 1, 1)

  stemnup2 = axisy2.stem("nup2", datanup2, false, null, d3.symbolTriangle, true)
  stemnum2 = axisy2.stem("num2", datanum2, false, null, d3.symbolTriangle, true)

  update_plots()
}
function update_nu()
{
  nu = this.value
  update_plots()
}
function update_plots()
{

  xds = xd.map(v => K*v)

  y = x.map(cosf)
  yd = xd.map(cosf)

  yds = xds.map(cosf)

  FF = Math.abs(K*nu - Math.round(K*nu)) / K

  const cosf2 = (t => Math.cos(FF * Math.PI * 2 * t))
  const ccosf = (t => Math.cos(nu * Math.PI * 2 * t))

  datax.y = x.map(ccosf)
  dataxs.y = x.map(cosf2)

  dataxd.y = xd.map(ccosf)
  dataxds.y = xds.map(cosf2)
  dataxds.x = xds


  datanup.x =  LLL.map(t => t + nu)
  datanum.x = LLL.map(t => t - nu)

  datanup2.x = LLL.map(t => t + K * nu)
  datanum2.x = LLL.map(t => t - K *nu)

  linex.update()
  linexs.update()
  stemnup.update()
  stemnum.update()
  stemnup2.update()
  stemnum2.update()
  samplesxd.update()
  samplesxds.update()
}


datax = {x: x, y:y, r: x.map(t => 0)}
dataxs = {x: x, y:ys, r: x.map(t => 0)}
dataxd = {x: xd, y:yd, r:  xd.map(t => 10)}
dataxds = {x: xds, y:yds, r:  xds.map(t => 10)}

datanup = {x: nup, y : half, r : R}
datanum = {x: num, y : half, r : R}
datanup2 = {x: nup2, y : half, r : R}
datanum2 = {x: num2, y : half, r : R}

xrange = [-Lt,Lt];
yrange = [-1.1, 1.1]

nurange = [-Lf, Lf]

axisx = new Axis("#plottime", 800, 300, margins, xrange, yrange)
axisy1 = new Axis("#plotfrequency1", 800, 300, margins, nurange, yrange)
axisy2 = new Axis("#plotfrequency2", 800, 300, margins, nurange, yrange)

axisy2.rectangle("domainnu", -0.5, 0, 1, 1)

linex = axisx.line('x', datax, false)
linexs = axisx.line('xs', dataxs, false)

samplesxd = axisx.scatter("xd", dataxd, false, null)
samplesxds = axisx.scatter("xds", dataxds, false, null)

stemnup = axisy1.stem("nup", datanup, false, null, d3.symbolTriangle, true)
stemnum = axisy1.stem("num", datanum, false, null, d3.symbolTriangle, true)

stemnup2 = axisy2.stem("nup2", datanup2, false, null, d3.symbolTriangle, true)
stemnum2 = axisy2.stem("num2", datanum2, false, null, d3.symbolTriangle, true)




d3.select('#sub').on("input", update_K)
d3.select('#nu').on("input", update_nu)
