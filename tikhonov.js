

ir = [1,-1]


var margins = {
  left: 50,
  right: 200,
  bottom: 10,
  top: 10
};

var L = 1024


var t = [...Array(L).keys()]
var x = t.map((t) => 1+(1 - Math.cos(2*Math.PI * t / L))**8/64 + Math.cos(2*Math.PI * t * 16/ L) + 0.4* Math.cos(2*Math.PI * t * 7/ L)- 0.3* Math.cos(2*Math.PI * t * 21/ L))

Lh = 61
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

var lambda = 1

var Hgain = H.real.map((t, idx) => t**2 + H.imag[idx]**2)
var Hdiffgain = Hdiff.real.map((t, idx) => t**2 + Hdiff.imag[idx]**2)

var Xestr = Yn.real.map((T, idx) => (T * H.real[idx] + X.imag[idx] * H.imag[idx]) / (Hgain[idx] + lambda * Hdiffgain[idx]))
var Xesti = Yn.real.map((T, idx) => (T * H.real[idx] - X.imag[idx] * H.imag[idx]) / (Hgain[idx] + lambda * Hdiffgain[idx]))

var xest = ifft(Xestr, Xesti).real


datax = {x: t, y:x}
datay = {x: t, y:yn}
datayest = {x: t, y:yn}

dataxest = {x: t, y:xest}
datal = {x: [], y:[], r:[]}
datalcur = {x: [], y:[], r:[]}
dataerr = {x: [], y:[], r:[]}
dataerrcur = {x: [], y:[], r:[]}

R = 3;
Rcur = 10;


function update_lambda()
{
  lambda = 10**this.value
  Xestr = Yn.real.map((T, idx) => (T * H.real[idx] + X.imag[idx] * H.imag[idx]) /(Hgain[idx] + lambda * Hdiffgain[idx]))
  Xesti = Yn.real.map((T, idx) => (T * H.real[idx] - X.imag[idx] * H.imag[idx]) / (Hgain[idx] + lambda * Hdiffgain[idx]))
  xest = ifft(Xestr, Xesti).real


  dataxest.y = xest
  sigxest.update()

  v = Math.log10(circularconvolve(xest, hdiff).reduce((a, v) => a + v**2, 0))

  var Yr = Xestr.map((T, idx) => T * H.real[idx] - Xesti[idx] * H.imag[idx])
  var Yi = Xestr.map((T, idx) => T * H.imag[idx] + Xesti[idx] * H.real[idx])

  var yest = ifft(Yr, Yi).real

  delta = yest.map((u, idx) => u - y[idx])


  u = Math.log10(delta.reduce((a, v) => a + v**2, 0))

err = xest.map((u, idx) => u - x[idx])
  err2 = Math.log10(err.reduce((a, v) => a + v**2, 0))

datayest.y = yest
  datal.x.push(u)
  datal.y.push(v)
  datal.r.push(R)
  datalcur.x = [u]
  datalcur.y = [v]
  datalcur.r = [Rcur]

  sigyest.update()
  lcurve.update()
  lcurvecur.update()

  dataerr.x.push(Math.log10(lambda))
  dataerr.y.push(err2)
  dataerr.r.push(R)
  dataerrcur.x = [Math.log10(lambda)]
  dataerrcur.y = [err2]
  dataerrcur.r = [Rcur]
  scerr.update()
  scerrcur.update()
}


T = 10
F = 10

xrange = [-0,L];
yrange = [-0.5, 15.5]
yrange2 = [-0.5, 3.5]

urange = [-2, 5]
vrange = [-10, 10]

lrange = [-10, 20]
erange = [0, 20]


ntickx = 10
nticky = 5

axisx = new Axis("#plotx", "sig", 600, 200, margins, xrange, yrange, ntickx, nticky)
axisy = new Axis("#ploty", "fourier", 600, 200, margins, xrange, yrange2, ntickx, nticky)
axisl = new Axis("#lcurve", "lcurve", 1000, 200, margins, urange, vrange, ntickx, nticky)
axiserr = new Axis("#err", "err", 1000, 200, margins, lrange, erange, ntickx, nticky)

sigx = axisx.line("sigx", "", datax)
sigy = axisy.line("sigy", "", datay)
sigxest = axisx.line("sigxest", "", dataxest)
sigyest = axisy.line("sigyest", "", datayest)

lcurve = axisl.scatter("lcurve", "", datal)
lcurvecur = axisl.scatter("lcurvecur", "", datalcur)
scerr = axiserr.scatter("err", "", dataerr)
scerrcur = axiserr.scatter("err", "", dataerrcur)


d3.select('#lambda').on("input", update_lambda)
