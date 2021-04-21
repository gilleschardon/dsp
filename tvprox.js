

ir = [1,-1]


var margins = {
  left: 50,
  right: 150,
  bottom: 10,
  top: 10
};

var L = 256

rdn = d3.randomNormal(0, 1)

var t = [...Array(L).keys()]
uu = [...Array(44).keys()].map(t => t/44 * 2 - 1)

//var x = t.map((t) => -1 + (1 - Math.cos(2*Math.PI * t / L))**8/64 + Math.cos(2*Math.PI * t * 16/ L) + 0.4* Math.cos(2*Math.PI * t * 7/ L)- 0.3* Math.cos(2*Math.PI * t * 21/ L) + rdn())
//var x = t.map((t) =>  + Math.cos(2*Math.PI * t * 3/ L) + 0.4* Math.cos(2*Math.PI * t * 7/ L)- 0.3* Math.cos(2*Math.PI * t * 21/ L) + rdn())

var x = []
x.push(...Array(40).fill(0))
x.push(...Array(44).fill(0.5))
x.push(...Array(22).fill(-2))
x.push(...Array(22).fill(1.5))
x.push(...Array(22).fill(-1))
x.push(...uu)
//x.push(...Array(22).fill(1))

x.push(...Array(22).fill(1))
x.push(...Array(40).fill(0))

y = x.map(t => t+ rdn())

var tint = [...Array(L+1).keys()].map(t => t-1)


lam = 1

xhat = proxtv(y, lam)

datax = {x: t, y:x}

datay = {x: t, y:y}
dataxhat = {x: t, y:xhat}

xint = [0]
xint.push(...d3.cumsum(y))

xstring = [0]
xstring.push(...d3.cumsum(y))


dataint = {x: tint, y:xint}

dataintm = {x: tint, y:xint}
dataintp = {x: tint, y:xint}
datastring = {x: tint, y:xstring}

function update_lambda()
{
  lam = +this.value
  dataxhat.y = proxtv(y, lam)
  sigxhat.update()

  xintp = xint.map(t => t + lam)
  xintp[0] = 0
  xintp[L] = xint[L]
  dataintp.y = xintp


  xintm = xint.map(t => t - lam)
  xintm[0] = 0
  xintm[L] = xint[L]
  dataintm.y = xintm

  sigintp.update()

  sigintm.update()
  //sigintp2.update()

  //sigintm2.update()


  xstring = [0]
  xstring.push(...d3.cumsum(dataxhat.y))

  datastring.y = xstring

  sigintstring.update()

}


xrange = [-0,L];
yrange = [-5, 5]
xrange2 = [-1,L];

yrange2 = [-70, 70]


ntickx = 10
nticky = 5

axisx = new Axis("#plotx", "sig", 1000, 300, margins, xrange, yrange, ntickx, nticky)
//axisy = new Axis("#ploty", "fourier", 600, 200, margins, xrange, yrange, ntickx, nticky)
axisint = new Axis("#plotint", "fourierzzz", 1000,300, margins, xrange2, yrange2, ntickx, nticky)
//axisstring = new Axis("#plotint", "fourierzzz", 600, 400, margins, xrange2, yrange2, ntickx, nticky)


sigx1 = axisx.line("sigx1", "\\(x\\)", datax)
//sigx1 = axisx.line("sigx1", "\\(x\\)", datax)

sigy = axisx.line("sigy", "\\(y\\)", datay)
sigxhat = axisx.line("sigxhat", "\\(\\hat x_\\lambda\\)", dataxhat)

sigint = axisint.line("sigint", "\\(Y\\)", dataint)
sigintp = axisint.line("sigintp", "\\(Y + \\lambda\\)", dataintp)
sigintm = axisint.line("sigintm", "\\(Y - \\lambda\\)", dataintm)
//sigintp2 = axisint.line("sigintp", "", dataintp)
//sigintm2 = axisint.line("sigintm", "", dataintm)

sigintstring = axisint.line("sigstring", "\\(\\hat X_\\lambda\\)", datastring)



d3.select('#lambda').on("input", update_lambda)
