

ir = [1,-1]


var margins = {
  left: 50,
  right: 200,
  bottom: 10,
  top: 10
};

var L = 128

rdn = d3.randomNormal(0, 0.2)

var t = [...Array(L).keys()]
//var x = t.map((t) => -1 + (1 - Math.cos(2*Math.PI * t / L))**8/64 + Math.cos(2*Math.PI * t * 16/ L) + 0.4* Math.cos(2*Math.PI * t * 7/ L)- 0.3* Math.cos(2*Math.PI * t * 21/ L) + rdn())
//var x = t.map((t) =>  + Math.cos(2*Math.PI * t * 3/ L) + 0.4* Math.cos(2*Math.PI * t * 7/ L)- 0.3* Math.cos(2*Math.PI * t * 21/ L) + rdn())

var x = []
x.push(...Array(20).fill(0))
x.push(...Array(22).fill(1))
x.push(...Array(44).fill(-1))
x.push(...Array(22).fill(1))
x.push(...Array(20).fill(0))

x = x.map(t => t+ rdn())

var tint = [...Array(L+1).keys()].map(t => t-1)


lam = 1

y = proxtv(x, lam)

datax = {x: t, y:x}
datay = {x: t, y:y}

xint = [0]
xint.push(...d3.cumsum(x))

xstring = [0]
xstring.push(...d3.cumsum(x))


dataint = {x: tint, y:xint}

dataintm = {x: tint, y:xint}
dataintp = {x: tint, y:xint}
datastring = {x: tint, y:xstring}

function update_lambda()
{
  lam = +this.value
  datay.y = proxtv(x, lam)
  sigy.update()

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
  sigintp2.update()

  sigintm2.update()


  xstring = [0]
  xstring.push(...d3.cumsum(datay.y))

  datastring.y = xstring

  sigintstring.update()

}


xrange = [-0,L];
yrange = [-5, 5]
xrange2 = [-1,L];

yrange2 = [-20, 30]


ntickx = 10
nticky = 5

axisx = new Axis("#plotx", "sig", 600, 200, margins, xrange, yrange, ntickx, nticky)
axisy = new Axis("#ploty", "fourier", 600, 200, margins, xrange, yrange, ntickx, nticky)
axisint = new Axis("#plotint", "fourierzzz", 600, 400, margins, xrange2, yrange2, ntickx, nticky)
axisstring = new Axis("#plotint", "fourierzzz", 600, 400, margins, xrange2, yrange2, ntickx, nticky)


sigx = axisx.line("sigx", "", datax)
sigy = axisy.line("sigy", "", datay)
sigint = axisint.line("sigint", "", dataint)
sigintp = axisint.line("sigintp", "", dataintp)
sigintm = axisint.line("sigintm", "", dataintm)

sigintp2 = axisstring.line("sigintp", "", dataintp)
sigintm2 = axisstring.line("sigintm", "", dataintm)



sigintstring = axisstring.line("sigstring", "", datastring)



d3.select('#lambda').on("input", update_lambda)
