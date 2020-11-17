

ir = [1,-1]


var margins = {
  left: 50,
  right: 200,
  bottom: 10,
  top: 10
};


var resol_t = 2000
var resol_f = 2000


var t = [...Array(2*resol_t).keys()].map((t) => (t-resol_t)/resol_t * 10)
var f = [...Array(2*resol_f).keys()].map((f) => (f-resol_f)/resol_f * 10)

var sigreal = Array(2*resol_t).fill(0)
var sigimag = Array(2*resol_t).fill(0)
var fourierreal = Array(2*resol_f).fill(0)
var fourierimag = Array(2*resol_f).fill(0)



datasigreal = {x: t, y:sigreal}
datasigimag = {x: t, y:sigimag}
datafourierreal = {x: f, y:fourierreal}
datafourierimag = {x: f, y:fourierimag}


T = 10
F = 10

sigrange = [-T,T];
fourierrange = [-F, F]
yrangesig = [-1.5, 1.5]
yrangefourier = [-2, 2]

ntickx = 10
nticky = 5

axissig = new Axis("#plotsig", "sig", 600, 200, margins, sigrange, yrangesig, ntickx, nticky)
axisfourier = new Axis("#plotfourier", "fourier", 600, 200, margins, fourierrange, yrangefourier, ntickx, nticky)

params = {
  width :
  {
    type: "range",
    value : 0.5,
    max : 2,
    min : 0.1,
    name : "Width",
  },
  center :
  {
    type: "range",
    value : 0,
    max : 2,
    min : -2,
    name : "Center"
  }
}

paramshtml = d3.select("#params")
for (param of Object.keys(params))
{
  var value = Math.ceil(((params[param].value - params[param].min) / (params[param].max - params[param].min) * 100))
  paramshtml.append("p").text(params[param].name)
    .append("input")
    .attr("class", "slider")
    .attr("type", "range")
    .attr("min", "0")
    .attr("max", "100")
    .attr("value", value)
    .attr("id", param)


}
//
// for (const param of Object.keys(params)) {
//   domobj = document.getElementById(param)
//   params[param].value = (domobj.value / domobj.getAttribute("max")) * (params[param].max -  params[param].min) + params[param].min
// }



function sinc(t)
{
  return (t == 0 ? 1 :  Math.sin(t)/t)
}

function update()
{

  datasigreal.y = datasigreal.x.map((t) => (Math.abs(t - params.center.value) > params.width.value ? 0 : 1))

  datafourierreal.y = datasigreal.x.map((f) => 2 * params.width.value * sinc(2 * Math.PI * params.width.value * f) * Math.cos(2 * Math.PI * params.center.value * f))
  datafourierimag.y = datasigimag.x.map((f) => 2 * params.width.value * sinc(2 * Math.PI * params.width.value * f) * Math.sin(- 2 * Math.PI * params.center.value * f))


  sigreal.update()
  sigimag.update()
  fourierreal.update()
  fourierimag.update()

}

function update_params()
{
  param = this.getAttribute('id')
  params[param].value = (this.value / this.getAttribute("max")) * (params[param].max -  params[param].min) + params[param].min

  update()

}



sigreal = axissig.line("sigreal", "\\(\\Re x(t)\\)", datasigreal)
sigimag = axissig.line("sigimag", "\\(\\Im x(t)\\)", datasigimag)


fourierreal = axisfourier.line("sigreal", "\\(\\Re X(f)\\)", datafourierreal)
fourierimag = axisfourier.line("sigimag", "\\(\\Im X(f)\\)", datafourierimag)

d3.selectAll('.slider').on("input", update_params)


update()
