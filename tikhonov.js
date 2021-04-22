"use strict";

const L = 1024

const FFT = new FFTNayuki(L)

const t = [...Array(L).keys()]
const w = t.map((t) =>  1 - Math.cos(2*Math.PI * t/ L)) // window, to guarantee circular boundary conditions
const x = t.map((t, idx) => 4+(4*Math.exp(-((t -600)**2/5**2/2)) -4*Math.exp(-((t -300)**2/30**2/2)) + 5*Math.exp(-((t -200)**2/200**2/2)) + 3*Math.exp(-((t -700)**2/50**2/2)))* w[idx])

// filter
const Lh = 401
const Lh2 = 7
var h = [...Array(Lh).keys()].map(t => (1 - Math.cos(2*Math.PI * t / Lh))/Lh/2 + 0*(1 - Math.cos(2*Math.PI * t / Lh2))/Lh2/2)

let harray = new Float32Array(L)
let harrayi = new Float32Array(L)
harray.set(h)
FFT.forward(harray, harrayi)
const H = {real:harray, imag:harrayi}

let xarray = Float32Array.from(x)
let xarrayi = new Float32Array(L)
FFT.forward(xarray, xarrayi)
const X = {real:xarray, imag:xarrayi}

var Yr = X.real.map((T, idx) => T * H.real[idx] - X.imag[idx] * H.imag[idx])
var Yi = X.real.map((T, idx) => T * H.imag[idx] + X.imag[idx] * H.real[idx])
FFT.inverse(Yr, Yi)
const y = Yr.map(t => t/L)

const rdn = d3.randomNormal(0, 0.05)
var noise = t.map(t => rdn())

var yn = y.map((t, idx) => t + noise[idx])

const Ynr = Float32Array.from(yn)
const Yni = new Float32Array(L)
FFT.forward(Ynr, Yni)
const Yn = {real: Ynr, imag: Yni}

var Hgain = H.real.map((t, idx) => t**2 + H.imag[idx]**2)

const datax = {x: t, y:x}
const datay = {x: t, y:yn}
const datayest = {x: t, y:Array(L).fill(0)}

const dataxest = {x: t, y:Array(L).fill(0)}
const datalcur = {x: [], y:[], r:[]}
const datal = {x: [], y:[], r:[]}
const dataerr = {x: [], y:[], r:[]}
const dataerrcur = {x: [], y:[], r:[]}

const Rcur = 10;

var nlambda = 10;
var newnlambda = 11;

function tikh(Yn, H, Hgain, lambda, hregul)
{
  let harray = new Float32Array(L)
  let harrayi = new Float32Array(L)
  harray.set(hregul)

  FFT.forward(harray, harrayi)
  let Hregul = {real: harray, imag: harrayi}

  let Hregulgain = Hregul.real.map((t, idx) => t**2 + Hregul.imag[idx]**2)

  let Xestr = Yn.real.map((T, idx) => (T * H.real[idx] + Yn.imag[idx] * H.imag[idx]) / (Hgain[idx] + lambda * Hregulgain[idx]))
  let Xesti = Yn.real.map((T, idx) => (- T * H.imag[idx] + Yn.imag[idx] * H.real[idx]) / (Hgain[idx] + lambda * Hregulgain[idx]))

  let xest = Float32Array.from(Xestr)
  let xesti = Float32Array.from(Xesti)

  FFT.inverse(xest, xesti)
  xest = xest.map(t => t/L)

  let v = Math.log10(circularconvolve(xest, hregul).reduce((a, v) => a + v**2, 0))

  let Yr = Xestr.map((T, idx) => T * H.real[idx] - Xesti[idx] * H.imag[idx])
  let Yi = Xestr.map((T, idx) => T * H.imag[idx] + Xesti[idx] * H.real[idx])

  let yest = Float32Array.from(Yr)
  let yesti = Float32Array.from(Yi)

  FFT.inverse(yest, yesti)
  yest = yest.map(t => t/L)

  let delta = yest.map((u, idx) => u - yn[idx])

  let u = Math.log10(delta.reduce((a, v) => a + v**2, 0))

  let err = xest.map((u, idx) => u - x[idx])
  let err2 = Math.log10(err.reduce((a, v) => a + v**2, 0))

  return [xest, yest, u, v, err2]
}

const tikh0 = (Yn, H, Hgain, lambda) => tikh(Yn, H, Hgain, lambda, [1])
const tikh1 = (Yn, H, Hgain, lambda) => tikh(Yn, H, Hgain, lambda, [1, -1])
const tikh2 = (Yn, H, Hgain, lambda) => tikh(Yn, H, Hgain, lambda, [1, -2, 1])

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
  let steplam = (newnlambda > nlambda) ? 1 : -1

  if (newnlambda != nlambda)
  {
    for (var i = nlambda + steplam ; i != newnlambda + steplam; i += steplam)
    {
      lambda = 10**(i/4-10)
      var res = method(Yn, H, Hgain, lambda)

      datal.x.push(res[2])
      datal.y.push(res[3])
      dataerr.x.push(Math.log10(lambda))
      dataerr.y.push(res[4])

    }
  dataxest.y = res[0]
  datayest.y = res[1]

  datalcur.x = [res[2]]
  datalcur.y = [res[3]]
  datalcur.r = [Rcur]

  dataerrcur.x = [Math.log10(lambda)]
  dataerrcur.y = [res[4]]
  dataerrcur.r = [Rcur]

  sigxest.update()
  sigyest.update()
  lcurve.update()
  lcurvecur.update()
  scerr.update()
  scerrcur.update()
}
  nlambda = newnlambda
}

const margins = {
  left: 50,
  right: 200,
  bottom: 10,
  top: 10
};

const xrange = [-0,L];
const yrange = [-0.5, 15.5]
const yrange2 = [-0.5, 5]

const urange = [-2, 5]
const vrange = [-10, 10]

const lrange = [-10, 15]
const erange = [-2, 10]

const ntickx = 10
const nticky = 5

const axisx = new Axis("#plotx", "sig", 600, 300, margins, xrange, yrange, ntickx, nticky)
const axisy = new Axis("#ploty", "fourier", 600, 300, margins, xrange, yrange2, ntickx, nticky)
const axisl = new Axis("#lcurve", "lcurve", 600, 300, margins, urange, vrange, ntickx, nticky)
const axiserr = new Axis("#err", "err", 600, 300, margins, lrange, erange, ntickx, nticky)

const sigx = axisx.line("sigx", "\\(x\\)", datax)
const sigy = axisy.line("sigy", "\\(y\\)", datay)
const sigxest = axisx.line("sigxest", "\\(\\hat x_\\lambda\\)", dataxest)
const sigyest = axisy.line("sigyest", "\\(H\\hat x_\\lambda\\)", datayest)

const lcurve = axisl.line("lcurve", "L-curve", datal)
const lcurvecur = axisl.scatter("lcurvecur", "", datalcur)
const scerr = axiserr.line("err", "MSE", dataerr)
const scerrcur = axiserr.scatter("err", "", dataerrcur)

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

const filter = document.getElementById('filter')

const keys = (Object.keys(names))
for (var idin of keys)
{
  let opt1 = document.createElement("option")
  opt1.value = idin
  opt1.text =  names[idin]

  if (idin == "identity")
  {
    opt1.selected="selected"
  }
  filter.add(opt1, null)
}

var method = funs["tikh0"]
update()
