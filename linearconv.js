
var margins = {
  left: 50,
  right: 200,
  bottom: 10,
  top: 10
};

var L1 = 8
var L2 = 10
var Lc = L1 + L2 - 1

var t1 = [...Array(L1).keys()]
var t2 = [...Array(L2).keys()]

var tc = [...Array(Lc).keys()]

var x = Array(L1).fill(0)
var y = Array(L2).fill(0)

var z = Array(Lc).fill(0)
var r1 = Array(L1).fill(10)
var r2 = Array(L2).fill(10)

var rc = Array(Lc).fill(10)

datax = {x: t1, y:x, r: r2}
datay = {x: t2, y:y, r: r2}
dataz = {x: tc, y:z, r: rc}

xrange = [-0.5,Lc - 0.5];
yrange = [-2.5, 2.5]
yrange2 = [-4.5, 4.5]

ntickx = 20
nticky = 5

axisx = new Axis("#plotx", 700, 150, margins, xrange, yrange, ntickx, nticky)
axisy = new Axis("#ploty", 700, 150, margins, xrange, yrange, ntickx, nticky)
axisz = new Axis("#plotz", 700, 300, margins, xrange, yrange2, ntickx, nticky*2)



function update_data()
{
  dataz.y.fill(0)
  for (var k = 0 ; k < L1 ; k++)
  {
       for (var l = 0 ; l < L2  ; l++)
       {
               dataz.y[(k+l)] = dataz.y[(k+l)] + datax.y[k] * datay.y[l]
      }
  }

}

function update()
{
  update_data()

  stemx.update()
  stemy.update()
  stemz.update()
}

function reset()
{
  datax.y.fill(0)
  datay.y.fill(0)
  dataz.y.fill(0)

    stemx.update()
    stemy.update()
    stemz.update()
}

function updatex(i, x, y)
{
  datax.y[i] = y
  update()
}
function updatey(i, x, y)
{
  datay.y[i] = y
  update()
}
stemx = axisx.stem("dx", "x[n]", datax, updatex)
stemy = axisy.stem("dy", "y[n]", datay, updatey)
stemz = axisz.stem("dz", "(x * y)[n]", dataz)

d3.select('#reset').on("click", reset)
