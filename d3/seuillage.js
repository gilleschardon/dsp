
var margins = {
  left: 50,
  right: 20,
  bottom: 20,
  top: 30
};

var L = 8
var Lc = 2*L-1

var t = [...Array(L).keys()]

var x = Array(L).fill(0)
var y = Array(L).fill(0)
var r = Array(L).fill(5)

var xx = Array(L).fill(0)
var yy = Array(L).fill(0)

datax = {x: t, y:x, r: r}
datay = {x: t, y:y, r: r}

dataxx = {x: t, y:xx, r: r}
datayy = {x: t, y:yy, r: r}

xrange = [-1,L];
yrange = [-2, 2]

axisx = new Axis("#plotx", 500, 150, margins, xrange, yrange)
axisy = new Axis("#ploty", 500, 150, margins, xrange, yrange)

axisxx = new Axis("#plotx", 500, 150, margins, xrange, yrange)
axisyy = new Axis("#ploty", 500, 150, margins, xrange, yrange)


var T = 0

var dft = new DFT(L, L)

function softthreshold(x, T)
{
    return Math.max(Math.abs(x)-T, 0) * Math.sign(x)
}
function hardthreshold(x, T)
{
    return Math.abs(x) > T ? x : 0
}


function update()
{
  datay.y = datax.y.map(d => hardthreshold(d, T))

  dft.forward(datax.y)
  dataxx.y = Array.from(dft.real)
  dft.forward(datay.y)

  datayy.y = Array.from(dft.real)

  stemx.update()
  stemy.update()
  stemxx.update()
  stemyy.update()

}

function reset()
{
  T = this.value
  console.log(T)
  update()
}

stemx = axisx.stem("s1","z",datax, true, update)
stemy = axisy.stem("s2","z",datay, false, update)
stemxx = axisxx.stem("s3","z",dataxx, true, update)
stemyy = axisyy.stem("s4","z",datayy, false, update)

d3.select('#seuil').on("input", reset)

d3.select('#seuil').on("input", updateC)
