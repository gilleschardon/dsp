"use strict";

var L = 256

var rdn = d3.randomNormal(0, 1)

var t = [...Array(L).keys()]

var uu = [...Array(44).keys()].map(t => t/44 * 2 - 1)
var x = []
x.push(...Array(40).fill(0))
x.push(...Array(44).fill(0.5))
x.push(...Array(22).fill(-2))
x.push(...Array(22).fill(1.5))
x.push(...Array(22).fill(-1))
x.push(...uu)
x.push(...Array(22).fill(1))
x.push(...Array(40).fill(0))

var y = x.map(t => t + rdn())

var tint = [...Array(L+1).keys()].map(t => t-1)

var lam = 1

var xhat = proxtv(y, lam)

const datax = {x: t, y:x}
const datay = {x: t, y:y}
const dataxhat = {x: t, y:xhat}

var xint = [0]
xint.push(...d3.cumsum(y))

var xstring = [0]
xstring.push(...d3.cumsum(y))

const dataint = {x: tint, y:xint}
const dataintm = {x: tint, y:xint}
const dataintp = {x: tint, y:xint}
const datastring = {x: tint, y:xstring}

function update_lambda()
{
  lam = +this.value
  dataxhat.y = proxtv(y, lam)

  let xintp = xint.map(t => t + lam)
  xintp[0] = 0
  xintp[L] = xint[L]
  dataintp.y = xintp

  let xintm = xint.map(t => t - lam)
  xintm[0] = 0
  xintm[L] = xint[L]
  dataintm.y = xintm

  xstring = [0]
  xstring.push(...d3.cumsum(dataxhat.y))
  datastring.y = xstring

  sigxhat.update()
  sigintp.update()
  sigintm.update()
  sigintstring.update()
}

const xrange = [-0,L];
const yrange = [-5, 5]
const xrange2 = [-1,L];
const yrange2 = [-70, 70]

const ntickx = 10
const nticky = 5

var margins = {
  left: 50,
  right: 150,
  bottom: 10,
  top: 10
};

const axisx = new Axis("#plotx", "sig", 1000, 300, margins, xrange, yrange, ntickx, nticky)
const axisint = new Axis("#plotint", "fourierzzz", 1000,300, margins, xrange2, yrange2, ntickx, nticky)

const sigx1 = axisx.line("sigx1", "\\(x\\)", datax)
const sigy = axisx.line("sigy", "\\(y\\)", datay)
const sigxhat = axisx.line("sigxhat", "\\(\\hat x_\\lambda\\)", dataxhat)
const sigint = axisint.line("sigint", "\\(Y\\)", dataint)
const sigintp = axisint.line("sigintp", "\\(Y + \\lambda\\)", dataintp)
const sigintm = axisint.line("sigintm", "\\(Y - \\lambda\\)", dataintm)
const sigintstring = axisint.line("sigstring", "\\(\\hat X_\\lambda\\)", datastring)

d3.select('#lambda').on("input", update_lambda)
