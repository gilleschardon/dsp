

ir = [1,-1]


var margins = {
  left: 50,
  right: 200,
  bottom: 10,
  top: 10
};


var resol_t = 2000

var t = [...Array(2*resol_t).keys()].map((t) => (t-resol_t)/resol_t * 10)

var prior = Array(2*resol_t).fill(0)
var posterior = Array(2*resol_t).fill(0)
var lhood = Array(2*resol_t).fill(0)


dataprior = {x: t, y:prior}
dataposterior = {x: t, y:posterior}
datalhood = {x: t, y:lhood}



T = 10

sigrange = [-T,T];
yrangesig = [-0.1, 1.1]


ntickx = 10
nticky = 5

axissig = new Axis("#plotsig", "sig", 1000, 500, margins, sigrange, yrangesig, ntickx, nticky)

params = {
  muprior :
  {
    type: "range",
    value : 0,
    max : 10,
    min : -10,
    name : "\\(\\mu_0\\)"
  },
  sigmaprior :
  {
    type: "range",
    value : 0.1,
    max : 12,
    min : 0.1,
    name : "\\(\\sigma_0\\)"
  },
  y :
  {
    type: "range",
    value : 0,
    max : 10,
    min : -10,
    name : "\\(y\\)"
  },
  sigmanoise :
  {
    type: "range",
    value : 0.1,
    max : 12,
    min : 0.1,
    name : "\\(\\sigma_n\\)"
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
  muprior = params.muprior.value
  sigmaprior = params.sigmaprior.value

  y = params.y.value
  sigmanoise = params.sigmanoise.value


  dataprior.y = dataprior.x.map((t) => (Math.exp( - Math.PI * ((t - muprior)/sigmaprior)**2)))
  datalhood.y = datalhood.x.map((t) => (Math.exp( - Math.PI * ((t - y)/sigmanoise)**2)))

  muposterior = (muprior * sigmanoise + y * sigmaprior) / (sigmanoise + sigmaprior)
  sigmaposterior = 1  / (1/sigmanoise + 1/sigmaprior)
  dataposterior.y = datalhood.x.map((t) => (Math.exp( - Math.PI * ((t - muposterior)/sigmaposterior)**2)))

  prior.update()
  lhood.update()
  posterior.update()


}

function update_params()
{
  param = this.getAttribute('id')
  params[param].value = (this.value / this.getAttribute("max")) * (params[param].max -  params[param].min) + params[param].min

  update()

}



prior = axissig.line("prior", "prior", dataprior)
lhood = axissig.line("lhood", "likelihood", datalhood)
posterior = axissig.line("posterior", "posterior", dataposterior)

d3.selectAll('.slider').on("input", update_params)


update()
