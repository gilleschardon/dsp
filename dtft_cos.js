

var margins = {
  left: 50,
  right: 200,
  bottom: 10,
  top: 10
};


var resol = 400
var freq = 1;
var T = 20

var t = [...Array(2*resol).keys()].map((t) => (t-resol)/resol * T)

var sigreal = Array(resol).fill(0)
var sigimag = Array(resol).fill(0)

var n = [...Array(2*T).keys()].map((t) => t - T)
var sigD = Array(2*T).fill(0)


grid = [...Array(10).keys()].map((t) => (t- 5))
heights = Array(10).fill(0.5)
heights2 = Array(10).fill(1)

r = Array(10).fill(8)

datasigreal = {x: t, y:sigreal}
datasigimag = {x: t, y:sigimag}

datasigD = {x: n, y:sigD, r:Array(2*T).fill(10)}

dataPR = {x: grid.map(t => t + freq), y:heights, r: r}
//dataPI = {x: [freq], y:[0], r: r}
dataNR = {x: grid.map(t => t - freq), y:heights, r: r}
//dataNI = {x: [-freq], y:[0], r: r}

sigrange = [-T,T];
FSrange = [-2, 2]
yrangesig = [-1.5, 1.5]
yrangedft = [-1.1, 1.1]

ntickx = 10
nticky = 5

axissig = new Axis("#plotsig", 1500, 400, margins, sigrange, yrangesig, ntickx, nticky)
axisdft = new Axis("#plotdft", 1500, 400, margins, FSrange, yrangedft, ntickx, nticky)



function update()
{

  datasigreal.y = t.map((a) => Math.cos(2 * Math.PI * freq * a))
  //datasigimag.y = t.map((a) => Math.sin(2 * Math.PI * freq * a) * (dataPR.y[0] - dataNR.y[0]) + Math.cos(2 * Math.PI * freq * a) * (dataPI.y[0] + dataNI.y[0]))
  datasigD.y = n.map((a) => Math.cos(2 * Math.PI * freq * a))

  if (Math.abs(freq%0.5) < 0.01)
  {
    dataPR.y = heights2;
    dataNR.y = heights2;
  }
  else
  {
    dataPR.y = heights;
    dataNR.y = heights;
  }

  dataPR.x = grid.map(t => t + freq);
//  dataPI.x[0] = freq;
  dataNR.x = grid.map(t => t - freq);

//  dataNI.x[0] = -freq;


  stemsigreal.update()
  stemPR.update()
  //stemPI.update()
  stemNR.update()
  //stemNI.update()
scatterD.update()
  console.log()

}

function update_freq()
{
  freq = this.value/100
  update()
}


symbolreal = "M 0 0 L 1 2 L -1 2 Z"
//symbolimag = "M 0 1 L 1 0 L 0 -1 Z"

scatterD = axissig.scatter("sigD", "\\(x[n]\\)", datasigD, null)
area = axisdft.area("area", "", {x:[-0.5, 0.5], y:[10, 10]})

stemsigreal = axissig.line("sigreal", "\\(x_c(t)\\)", datasigreal)
//stemsigimag = axissig.line("sigimag", "\\(\\Im x[n]\\)", datasigimag)
stemPR = axisdft.stem("PR", "\\(X(\\nu)\\)", dataPR, null, symbolreal)
//stemPI = axisdft.stem("PI", "\\(\\Im X[k]\\)", dataPI, null, symbolimag)
stemNR = axisdft.stem("NR", "", dataNR, null, symbolreal)
//stemNI = axisdft.stem("NI", "\\(\\Im X[k]\\)", dataNI, null, symbolimag)


d3.select('#freq').on("input", update_freq)



update()
