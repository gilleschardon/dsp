

ir = [1,-1]


var margins = {
  left: 50,
  right: 200,
  bottom: 10,
  top: 10
};


var resol = 400
var freq = 1;
var T = 10

var t = [...Array(2*resol).keys()].map((t) => (t-resol)/resol * 10)

var sigreal = Array(resol).fill(0)
var sigimag = Array(resol).fill(0)

var r = [8]


datasigreal = {x: t, y:sigreal}
datasigimag = {x: t, y:sigimag}
dataPR = {x: [freq], y:[0.5], r: r}
dataPI = {x: [freq], y:[0], r: r}
dataNR = {x: [-freq], y:[0.5], r: r}
dataNI = {x: [-freq], y:[0], r: r}

sigrange = [-T,T];
FSrange = [-2, 2]
yrangesig = [-1.5, 1.5]
yrangedft = [-1.1, 1.1]

ntickx = 10
nticky = 5

axissig = new Axis("#plotsig", "sig", 600, 200, margins, sigrange, yrangesig, ntickx, nticky)
axisdft = new Axis("#plotdft", "dft", 600, 200, margins, FSrange, yrangedft, ntickx, nticky)



function update()
{

  datasigreal.y = t.map((a) => Math.cos(2 * Math.PI * freq * a) * (dataPR.y[0] + dataNR.y[0]) - Math.sin(2 * Math.PI * freq * a) * (dataPI.y[0] - dataNI.y[0]))
  datasigimag.y = t.map((a) => Math.sin(2 * Math.PI * freq * a) * (dataPR.y[0] - dataNR.y[0]) + Math.cos(2 * Math.PI * freq * a) * (dataPI.y[0] + dataNI.y[0]))

  dataPR.x[0] = freq;
  dataPI.x[0] = freq;
  dataNR.x[0] = -freq;
  dataNI.x[0] = -freq;


  stemsigreal.update()
  stemsigimag.update()
  stemPR.update()
  stemPI.update()
  stemNR.update()
  stemNI.update()
}

function updatePR(i, x, y)
{
  dataPR.y[0] = y;
  freq = (x > 0) ? x : 0
  update()
}
function updatePI(i, x, y)
{
  dataPI.y[0] = y;
  freq = (x > 0) ? x : 0
  update()
}
function updateNR(i, x, y)
{

  dataNR.y[0] = y;
  freq = (x < 0) ? -x : 0

  update()
}
function updateNI(i, x, y)
{
  dataNI.y[0] = y;
  freq = (x < 0) ? -x : 0

  update()
}

symbolreal = "M 0 1 L -1 0 L 0 -1 Z"
symbolimag = "M 0 1 L 1 0 L 0 -1 Z"


stemsigreal = axissig.line("sigreal", "\\(\\Re x[n]\\)", datasigreal)
stemsigimag = axissig.line("sigimag", "\\(\\Im x[n]\\)", datasigimag)
stemPR = axisdft.stem("PR", "\\(\\Re X[k]\\)", dataPR, updatePR, symbolreal)
stemPI = axisdft.stem("PI", "\\(\\Im X[k]\\)", dataPI, updatePI, symbolimag)
stemNR = axisdft.stem("NR", "\\(\\Re X[k]\\)", dataNR, updateNR, symbolreal)
stemNI = axisdft.stem("NI", "\\(\\Im X[k]\\)", dataNI, updateNI, symbolimag)




update()
