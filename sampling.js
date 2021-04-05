

function f(t)
{
  return t.map(u => (u == 2 ? 1 : Math.sin(3*(u-2))/(3*(u-2)))/3 + (u == 3.2 ? 1 : Math.sin(4*(u-3.2))/(4*(u-3.2)))/2)
}

var margins = {
  left: 50,
  right: 200,
  bottom: 10,
  top: 10
};

var margins2 = {
  left: 50,
  right: 200,
  bottom: 40,
  top: 10
};

var margins3 = {
  left: 20,
  right: 25,
  bottom: 10,
  top: 10
};

R = 10
var r = Array(1).fill(R)


Ntcont = 400
var Lmax = 7

var L0 = 10

var Ldis = 80

var T = 1

var tcont = [...Array(Ntcont).keys()].map(t => (t/Ntcont) * Lmax - 1)
var tdis = [...Array(Ldis).keys()].map(t => ((t-L0) * T))

Fcont = f(tcont)
Fdis = f(tdis)

var sincs = Array(Ldis)
var datasincs = Array(Ldis)

for (var i = 0 ; i < Ldis; i++)
{
  sincs[i] = tcont.map(t => t == 0 ? 1 : Math.sin(Math.PI*t/T)/t*T/Math.PI)

  datasincs[i] = {x: tcont, y : sincs[i], r: tcont}

}

var r = Array(Ldis).fill(R)

datafcont = {x: tcont, y: Fcont, r: r}
datareccont = {x: tcont, y: Fcont, r: r}

datafdis = {x: tdis, y: Fdis, r: r}

xrange = [-0.5,5 + 0.5];
yrange = [-1.1, 1.1]

nurange = [-0.5,1]
Hrange = [-0.1,5.1]

ntickx = 20
nticky = 5

function update()
{
  linetcont.update()
  stemtdis.update()
  reccont.update()

}

function update_period()
{
  T = this.value / 100 * 2
  update_data()


  update()

}


function update_data()
{
  tdis = [...Array(Ldis).keys()].map(t => ((t-L0) * T))
Fdis = f(tdis)
datafdis.x = tdis
datafdis.y = Fdis

datareccont.y = Array(Ntcont).fill(0)
for (var i = 0 ; i < Ldis; i++)
{
  sincs[i] = tcont.map(t => (t-tdis[i]) == 0 ? datafdis.y[i] : Math.sin(Math.PI*(t-tdis[i])/T)/(t-tdis[i])*T/Math.PI * datafdis.y[i])

  datasincs[i].y = sincs[i]
  sincsplots[i].update()

  datareccont.y = datareccont.y.map((t, idx) => t + sincs[i][idx])
}
}


axissig = new Axis("#plotsig", "sig", 1000, 600, margins, xrange, yrange, ntickx, nticky)


linetcont = axissig.line("sig", "signal", datafcont)
stemtdis = axissig.stem("sigd", "samples", datafdis)
reccont = axissig.line("out", "reconstruction", datareccont)

sincsplots = Array(Ldis)

for (var i = 0 ; i < Ldis ; i++)
{
  sincsplots[i] = axissig.line("sinc", "", datasincs[i])
}



d3.select('#period').on("input", update_period)

update_data()

update()
