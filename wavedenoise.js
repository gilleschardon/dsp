"use strict";

const L = 1024

const FFT = new FFTNayuki(L)

const t = [...Array(L).keys()]
const w = t.map((t) =>  1 - Math.cos(2*Math.PI * t/ L)) // window, to guarantee circular boundary conditions
var x0 = t.map((t, idx) => (idx < 450 && idx > 380)? (-5):0 -2+(4*Math.exp(-((t -600)**2/2**2/2)) -4*Math.exp(-((t -300)**2/30**2/2)) + 5*Math.exp(-((t -200)**2/200**2/2)) + 3*Math.exp(-((t -700)**2/50**2/2)))* w[idx])

const sigma2 = 1
const rdn = d3.randomNormal(0, sigma2)
var x = x0.map(t => t + rdn())


const hs = {
  db1: [1/Math.sqrt(2), 1/Math.sqrt(2)],
  db2: [0.4829, 0.8365, 0.2241, -0.1294],
  db3: [0.3327, 0.8069, 0.4599, -0.1350, -0.0854, 0.0352],
  db4: [0.2304, 0.7148, 0.6309, -0.0280, -0.1870, 0.0308, 0.0329, -0.0106],
  sym4: [0.0322, -0.0126, -0.0992, 0.2979, 0.8037, 0.4976, -0.0296, -0.0758],
  C6: [-0.1029, 0.4779, 1.206, 0.5443, -0.1029,-0.0221].map(t =>t/Math.sqrt(2))
}

var h = hs.db4
var g = [...h].reverse().map((u, idx) => u * (-1)**idx)

var hanal = Array.from(h).reverse()
var ganal = Array.from(g).reverse()

const K = 8;
const y = dwt(x, hanal, ganal, K)
const y0 = dwt(x0, hanal, ganal, K)

const z = idwt(y, h, g, K)
const datax0 = {x: t, y:x0}

const datax = {x: t, y:x}
const datac = {x: t, y:y}
const datas = {x: t, y:z}
const datah = {x: t, y:z}
const datacs = {x: t, y:y, r:Array(L).fill(3)}
const datach = {x: t, y:y, r:Array(L).fill(3)}

const dataes = {x: [], y:[], r:[]}
const dataeh = {x: [], y:[], r:[]}

const dataescur = {x: [], y:[], r:[]}
const dataehcur = {x: [], y:[], r:[]}

const datasurecur = {x: [], y:[], r:[]}
const datasure = {x: [], y:[], r:[]}

var nT = 1
var newnT = 0

function SURE(y, T, sigma2)
{
  return y.map(t => Math.abs(t) < T ? t**2 - sigma2 : sigma2 + T**2).reduce((t, a) => t + a, 0)

}

function update_T()
{
  newnT = +this.value

  update()
}

function update()
{
  let stepT = (newnT > nT) ? 1 : -1

  if (newnT != nT)
  {
    for (var i = nT + stepT ; i != newnT + stepT; i += stepT)
    {
      T = i/20

      var ys = soft(y, T)

      var yh = hard(y, T)

      dataes.x.push(T)
      var errsval = norm22(addmult(ys, y0, -1))
      dataes.y.push(errsval)

      dataeh.x.push(T)
      var errhval = norm22(addmult(yh, y0, -1))
      dataeh.y.push(errhval)

      var S = SURE(y, T, sigma2)
      datasure.x.push(T)
      datasure.y.push(S)
    }
    var zs = idwt(ys, h, g, K)
    var zh = idwt(yh, h, g, K)


      datacs.y = ys
      datas.y = zs

      datach.y = yh
      datah.y = zh

dataescur.x = [T]
dataescur.y = [errsval]
dataehcur.x = [T]
dataehcur.y = [errhval]
datasurecur.x = [T]
datasurecur.y = [S]
dataescur.r = [10]
dataehcur.r = [10]
datasurecur.r = [10]



        sigcs.update()
        sigch.update()
        sigs.update()
        sigh.update()
        errs.update()
        errh.update()
        errscur.update()
        errhcur.update()
        sure.update()
        surecur.update()
      }
      nT = newnT
}

const Rcur = 10;

var nlambda = 10;
var newnlambda = 11;


const margins = {
  left: 50,
  right: 200,
  bottom: 30,
  top: 10
};

const xrange = [-0,L];
const yrange = [-8, 8]
const yrange2 = [-8, 50]

const urange = [-2, 5]
const vrange = [-10, 10]

const lrange = [-0, 20]
const erange = [-200, 2000]

const ntickx = 10
const nticky = 5

//const axisx = new Axis("#plotx", "xn", 600, 200, margins, xrange, yrange, ntickx, nticky)
//const axisc = new Axis("#plotc", "c", 600, 200, margins, xrange, yrange2, ntickx, nticky)
const axiscs = new Axis("#csoft", "csoft", 600, 200, margins, xrange, yrange2, ntickx, nticky, "Index")
const axisch = new Axis("#chard", "chard", 600, 200, margins, xrange, yrange2, ntickx, nticky, "Index")
const axiss = new Axis("#soft", "soft", 600, 200, margins, xrange, yrange, ntickx, nticky)
const axish = new Axis("#hard", "hard", 600, 200, margins, xrange, yrange, ntickx, nticky)

const axiserr = new Axis("#err", "err", 600, 200, margins, lrange, erange, ntickx, nticky, "Threshold")

//const sigx = axisx.line("sigx", "\\(x\\)", datax)
//const sigc = axisc.line("sigc", "\\(y\\)", datac)
const sigs = axiss.line("sigs", "\\(\\hat{x}_{\\mathrm{soft}}\\)", datas)
const sigh = axish.line("sigh", "\\(\\hat{x}_{\\mathrm{hard}}\\)", datah)
const sigs0 = axiss.line("x0", "\\(x_0\\)", datax0)
const sigh0 = axish.line("x0", "\\(x_0\\)", datax0)

const sigcs = axiscs.stem("cs", "thres. coeffs.", datacs)
const sigch = axisch.stem("ch", "thres. coeffs.", datach)

const errs = axiserr.line("errs", "\\(r_{\\mathrm{soft}}\\)", dataes)
const errh = axiserr.line("errh", "\\(r_{\\mathrm{hard}}\\)", dataeh)

const errscur = axiserr.scatter("errsc", "", dataescur)
const errhcur = axiserr.scatter("errhc", "", dataehcur)
const sure = axiserr.line("sure", "SURE", datasure)
const surecur = axiserr.scatter("surecur", "", datasurecur)


d3.select('#T').on("input", update_T)

update()
