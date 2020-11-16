

ir = [1,-1]


var margins = {
  left: 50,
  right: 200,
  bottom: 10,
  top: 10
};

var Nfreq = 32
var NNfreq = 2 * Nfreq + 1;
var resol = 400

var trunc = Nfreq
var t = [...Array(resol).keys()].map((t) => t/resol)
var k = [...Array(NNfreq).keys()].map(t => (t - Nfreq))

var sigreal = Array(resol).fill(0)
var sigimag = Array(resol).fill(0)
var dftreal = Array(NNfreq).fill(0)
var dftimag = Array(NNfreq).fill(0)


var r = Array(t.length).fill(8)


datasigreal = {x: t, y:sigreal}
datasigimag = {x: t, y:sigimag}
datadftreal = {x: k, y:dftreal, r: r}
datadftimag = {x: k, y:dftimag, r: r}


sigrange = [-0.1,1.1];
FSrange = [-Nfreq-0.5, Nfreq + 0.5]
yrangesig = [-1.5, 1.5]
yrangedft = [-1.1, 1.1]

var rectcorners = {}
rectcorners.x = [-Nfreq - 0.5]
rectcorners.y = [yrangedft[1]]
rectcorners.width = [2*Nfreq + 1]
rectcorners.height = [yrangedft[1] - yrangedft[0]]

ntickx = Nfreq
nticky = 5

axissig = new Axis("#plotsig", 1200, 400, margins, sigrange, yrangesig, ntickx, nticky)
axisdft = new Axis("#plotdft", 1200, 400, margins, FSrange, yrangedft, ntickx, nticky)



function updatefreq()
{

  for (var i = 0; i < resol; i++)
    {
               datasigreal.y[i] = datadftreal.y.reduce((a, hh, idx) => a + Math.cos(  2 * Math.PI * i * k[idx] / resol) * hh * (Math.abs(k[idx]) <= trunc), 0)
               datasigreal.y[i] = datadftimag.y.reduce((a, hh, idx) => a - Math.sin(  2 * Math.PI * i * k[idx] / resol) * hh * (Math.abs(k[idx]) <= trunc), datasigreal.y[i])
               datasigimag.y[i] = datadftreal.y.reduce((a, hh, idx) => a + Math.sin(  2 * Math.PI * i * k[idx] / resol) * hh * (Math.abs(k[idx]) <= trunc), 0)
               datasigimag.y[i] = datadftimag.y.reduce((a, hh, idx) => a + Math.cos(  2 * Math.PI * i * k[idx] / resol) * hh * (Math.abs(k[idx]) <= trunc), datasigimag.y[i])

    }

  stemsigreal.update()
  stemsigimag.update()
  stemdftreal.update()
  stemdftimag.update()
  rectt.update()
}

function reset()
{
  datasigreal.y.fill(0)
  datasigimag.y.fill(0)
  datadftreal.y.fill(0)
  datadftimag.y.fill(0)

  stemsigreal.update()
  stemsigimag.update()
  stemdftreal.update()
  stemdftimag.update()

}


function sawtooth()
{
  datadftreal.y.fill(0)
  datadftimag.y.fill(0)

  for (kk = 0; kk < NNfreq; kk++)
  {
    if (k[kk] != 0)
    {
    datadftimag.y[kk] = (1/(k[kk]**1)) / Math.PI
    }
  }
  updatefreq()
}

function square()
{
  datadftreal.y.fill(0)
  datadftimag.y.fill(0)

  for (kk = 0; kk < NNfreq; kk++)
  {
    if ((k[kk]%2)**2 == 1)
    {
    datadftimag.y[kk] = (1/(k[kk]**1)) / (Math.PI/2)
    }
  }
  updatefreq()
}

function triangle()
{
  datadftreal.y.fill(0)
  datadftimag.y.fill(0)

  for (kk = 0; kk < NNfreq; kk++)
  {
    if ((k[kk]%2)**2 == 1)
    {
    datadftreal.y[kk] = (1/(k[kk]**2)) * (-1)**k[kk] / (Math.PI**2/4)
    }
  }
  updatefreq()
}

function pulse()
{
  datadftreal.y.fill(1/(2*Nfreq+1))
  datadftimag.y.fill(0)

  updatefreq()
}

function update_trunc()
{
  trunc = this.value
  rectcorners.x = [-trunc - 0.5]
  rectcorners.width = [2*trunc + 1]

  updatefreq()
}


function updatedatareal(i, x, y)
{
  datadftreal.y[i] = y
  updatefreq()
}

function updatedataimag(i, x, y)
{
  datadftimag.y[i] = y
  updatefreq()
}

symbolreal = d3.symbol().size(2).type(d3.symbolCircle)()
symbolimag = d3.symbol().size(2).type(d3.symbolCross)()

symbolreal = "M 0 1 L -1 0 L 0 -1 Z"
symbolimag = "M 0 1 L 1 0 L 0 -1 Z"
rectt = axisdft.rectangle("rect", "", rectcorners)


stemsigreal = axissig.line("sigreal", "\\(\\Re x(t)\\)", datasigreal)
stemsigimag = axissig.line("sigimag", "\\(\\Im x(t)\\)", datasigimag)
stemdftreal = axisdft.stem("dftreal", "\\(\\Re X_n\\)", datadftreal, updatedatareal, symbolreal)
stemdftimag = axisdft.stem("dftimag", "\\(\\Im X_n\\)", datadftimag, updatedataimag, symbolimag)



d3.select('#reset').on("click", reset)
d3.select('#square').on("click", square)
d3.select('#sawtooth').on("click", sawtooth)
d3.select('#triangle').on("click", triangle)
d3.select('#pulse').on("click", pulse)

document.getElementById("truncation").value = Nfreq
document.getElementById("truncation").setAttribute("max", Nfreq)

d3.select('#truncation').on("input", update_trunc)


updatefreq()
