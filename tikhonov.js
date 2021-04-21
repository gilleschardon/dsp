

ir = [1,-1]


var margins = {
  left: 50,
  right: 200,
  bottom: 10,
  top: 10
};

var L = 1024

FFT = new FFTNayuki(L)

var t = [...Array(L).keys()]
var w = t.map((t) =>  1 - Math.cos(2*Math.PI * t/ L))

var x = t.map((t, idx) => 4+(4*Math.exp(-((t -600)**2/5**2/2)) -4*Math.exp(-((t -300)**2/30**2/2)) + 5*Math.exp(-((t -200)**2/200**2/2)) + 3*Math.exp(-((t -700)**2/50**2/2)))* w[idx])

Lh = 401
Lh2 = 7
var h = [...Array(Lh).keys()].map(t => (1 - Math.cos(2*Math.PI * t / Lh))/Lh/2 + 0*(1 - Math.cos(2*Math.PI * t / Lh2))/Lh2/2)

var H = fft(h, Array(h.length).fill(0), L)
var X = fft(x, Array(x.length).fill(0))


var hdiff = [1, -2, 1]
var Hdiff = fft(hdiff, Array(h.length).fill(0), L)

var Yr = X.real.map((T, idx) => T * H.real[idx] - X.imag[idx] * H.imag[idx])
var Yi = X.real.map((T, idx) => T * H.imag[idx] + X.imag[idx] * H.real[idx])

var y = ifft(Yr, Yi).real

rdn = d3.randomNormal(0, 0.05)
var noise = t.map(t => rdn())

var yn = y.map((t, idx) => t + noise[idx])

var Yn = fft(yn, Array(yn.length).fill(0))


var Hgain = H.real.map((t, idx) => t**2 + H.imag[idx]**2)


var xest = Array(L).fill(0)


datax = {x: t, y:x}
datay = {x: t, y:yn}
datayest = {x: t, y:Array(L).fill(0)}

dataxest = {x: t, y:xest}
datal = {x: [], y:[], r:[]}
datalcur = {x: [], y:[], r:[]}
dataerr = {x: [], y:[], r:[]}
dataerrcur = {x: [], y:[], r:[]}

R = 3;
Rcur = 10;

nlambda = 10;
newnlambda = 11;

function tikh(Yn, H, Hgain, lambda, hregul)
{
  harray = new Float32Array(L)
  harray.fill(0)
  harrayi = new Float32Array(L)
harrayi.fill(0)
  harray.set(hregul)

  FFT.forward(harray, harrayi)
  Hregul = {real: harray, imag: harrayi}

  var Hregulgain = Hregul.real.map((t, idx) => t**2 + Hregul.imag[idx]**2)

  Xestr = Yn.real.map((T, idx) => (T * H.real[idx] + Yn.imag[idx] * H.imag[idx]) / (Hgain[idx] + lambda * Hregulgain[idx]))
  Xesti = Yn.real.map((T, idx) => (- T * H.imag[idx] + Yn.imag[idx] * H.real[idx]) / (Hgain[idx] + lambda * Hregulgain[idx]))

  xest = new Float32Array(L)
  xest.set(Xestr)
  xesti = new Float32Array(L)
  xesti.set(Xesti)

  FFT.inverse(xest, xesti)
  xest = xest.map(t => t/L)

  var v = Math.log10(circularconvolve(xest, hregul).reduce((a, v) => a + v**2, 0))

  var Yr = Xestr.map((T, idx) => T * H.real[idx] - Xesti[idx] * H.imag[idx])
  var Yi = Xestr.map((T, idx) => T * H.imag[idx] + Xesti[idx] * H.real[idx])

  yest = new Float32Array(L)
  yest.set(Yr)
  yesti = new Float32Array(L)
  yesti.set(Yi)

  FFT.inverse(yest, yesti)
  yest = yest.map(t => t/L)

  delta = yest.map((u, idx) => u - yn[idx])

  var u = Math.log10(delta.reduce((a, v) => a + v**2, 0))

  var err = xest.map((u, idx) => u - x[idx])
  var err2 = Math.log10(err.reduce((a, v) => a + v**2, 0))


  return [xest, yest, u, v, err2]

}

tikh0 = (Yn, H, Hgain, lambda) => tikh(Yn, H, Hgain, lambda, [1])
tikh1 = (Yn, H, Hgain, lambda) => tikh(Yn, H, Hgain, lambda, [1, -1])
tikh2 = (Yn, H, Hgain, lambda) => tikh(Yn, H, Hgain, lambda, [1, -2, 1])

method = tikh0

function update_filter()
{
  method = funs[this.value]
  datal.x = []
  datal.y = []
  datalcur.x = []
  datalcur.y = []
  dataerr.x = []
  dataerr.y = []
  dataerrcur.x = []
  dataerrcur.y = []
  update()
}

function update_lambda()
{
  newnlambda = +this.value
  update()
}

function update()
{
  steplam = (newnlambda > nlambda) ? 1 : -1



  if (newnlambda != nlambda)
  {
    for (var i = nlambda + steplam ; i != newnlambda + steplam; i += steplam)
    {
      lambda = 10**(i/4-10)
      res = method(Yn, H, Hgain, lambda)
      datal.x.push(res[2])
      datal.y.push(res[3])
      datal.r.push(R)
      dataerr.x.push(Math.log10(lambda))
      dataerr.y.push(res[4])
      dataerr.r.push(R)




  dataxest.y = res[0]


  sigxest.update()


  datayest.y = res[1]

  datal.x.push(res[2])
  datal.y.push(res[3])
  datal.r.push(R)
  datalcur.x = [res[2]]
  datalcur.y = [res[3]]
  datalcur.r = [Rcur]

  sigyest.update()
  lcurve.update()
  lcurvecur.update()


  dataerrcur.x = [Math.log10(lambda)]
  dataerrcur.y = [res[4]]
  dataerrcur.r = [Rcur]
  scerr.update()
  scerrcur.update()
}
}
  nlambda = newnlambda



}


T = 10
F = 10

xrange = [-0,L];
yrange = [-0.5, 15.5]
yrange2 = [-0.5, 5]

urange = [-2, 5]
vrange = [-10, 10]

lrange = [-40, 20]
erange = [-10, 20]


ntickx = 10
nticky = 5

axisx = new Axis("#plotx", "sig", 600, 300, margins, xrange, yrange, ntickx, nticky)
axisy = new Axis("#ploty", "fourier", 600, 300, margins, xrange, yrange2, ntickx, nticky)
axisl = new Axis("#lcurve", "lcurve", 600, 300, margins, urange, vrange, ntickx, nticky)
axiserr = new Axis("#err", "err", 600, 300, margins, lrange, erange, ntickx, nticky)

sigx = axisx.line("sigx", "\\(x\\)", datax)
sigy = axisy.line("sigy", "\\(y\\)", datay)
sigxest = axisx.line("sigxest", "\\(\\hat x_\\lambda\\)", dataxest)
sigyest = axisy.line("sigyest", "\\(H\\hat x_\\lambda\\)", datayest)

lcurve = axisl.line("lcurve", "L-curve", datal)
lcurvecur = axisl.scatter("lcurvecur", "", datalcur)
scerr = axiserr.line("err", "MSE", dataerr)
scerrcur = axiserr.scatter("err", "", dataerrcur)


d3.select('#lambda').on("input", update_lambda)

const names = {
  tikh0: "identity",
  tikh1: "diff1",
  tikh2: "diff2"
}

const funs = {
  tikh0: tikh0,
  tikh1: tikh1,
  tikh2: tikh2
}

d3.select('#filter').on("input", update_filter)

filter = document.getElementById('filter')

keys = (Object.keys(names))
for (idin of keys)
{
  opt1 = document.createElement("option")
  opt1.value = idin
  opt1.text =  names[idin]

  if (idin == "identity")
  {
    opt1.selected="selected"
  }
  filter.add(opt1, null)
}
