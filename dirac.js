

var margins = {
  left: 50,
  right: 200,
  bottom: 10,
  top: 10
};


var resol_t = 2000

var t = [...Array(2*resol_t).keys()].map((t) => (t-resol_t)/resol_t * 4)

var cosine = t.map(u => Math.cos((2*u - Math.PI/4)) * Math.sqrt(2))
var sigreal = Array(2*resol_t).fill(0)
var sigrealtri = Array(2*resol_t).fill(0)

datasigreal = {x: t, y:sigreal}
datasigrealtri = {x: t, y:sigrealtri}

datacosine = {x: t, y:cosine}

dataint = {x: [], y:[], r: []}
datatri = {x: [], y:[], r: []}

T = 4
F = 10

R = 5
sigrange = [-T,T];
yrangesig = [-1.5, 5.5]
intrange = [-0.1,8];
yrangeint = [-0.5, 1.5]

ntickx = 10
nticky = 5

axissig = new Axis("#plotsig", "sig", 600, 200, margins, sigrange, yrangesig, ntickx, nticky)
axisint = new Axis("#plotint", "int", 600, 200, margins, intrange, yrangeint, ntickx, nticky)

params = {
  width :
  {
    type: "range",
    value : 4,
    max : 4,
    min : 0.01,
    name : "Width",
  }
}

paramshtml = d3.select("#params")

for (param of Object.keys(params))
{
  var value = Math.ceil(((params[param].value - params[param].min) / (params[param].max - params[param].min) * 500))
  paramshtml.append("p").text(params[param].name)
    .append("input")
    .attr("class", "slider")
    .attr("type", "range")
    .attr("min", "0")
    .attr("max", "500")
    .attr("value", value)
    .attr("id", param)
}

function update()
{

  datasigreal.y = datasigreal.x.map((t) => (Math.abs(t) > params.width.value ? 0 : 1)/params.width.value/2)
  datasigrealtri.y = datasigrealtri.x.map((t) => Math.abs(t) > params.width.value ? 0 : 1/params.width.value - Math.abs(t)/params.width.value**2)

  dataint.x.push(params.width.value*2)
  datatri.x.push(params.width.value*2)

  dataint.y.push((Math.sin((2*params.width.value - Math.PI/4)) - Math.sin((-2*params.width.value - Math.PI/4))) / (params.width.value*2*2)* Math.sqrt(2))

var a = params.width.value
  var zzz =  ((- Math.cos(2*a) + Math.sin(2*a)-2*a + 1)/4/a**2 - ( Math.sin(2*a) +  Math.cos(2*a) -2*a - 1)/4/a**2)
  datatri.y.push(zzz)
  datatri.r.push(R)

  dataint.r.push(R)
  sigreal.update()
  sigrealtri.update()

  sigint.update()
  sigtri.update()

}

function update_params()
{
  param = this.getAttribute('id')
  params[param].value = (this.value / this.getAttribute("max")) * (params[param].max -  params[param].min) + params[param].min

  update()

}



sigcosine = axissig.line("sigcosine", "\\(\\ f (t)\\)", datacosine)
sigreal = axissig.line("sigreal", "\\(R_a(t)\\)", datasigreal)
sigrealtri = axissig.line("sigrealtri", "\\(T_a(t)\\)", datasigrealtri)

sigint = axisint.scatter("plotint", "\\( \\int f(t)R_a(t) dt \\)", dataint)
sigtri = axisint.scatter("plotinttri", "\\( \\int f(t)T_a(t) dt \\)", datatri)


d3.selectAll('.slider').on("input", update_params)


update()
