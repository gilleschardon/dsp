
var margins = {
  left: 50,
  right: 200,
  bottom: 10,
  top: 10
};

var L = 8
var Lc = 2*L-1

var t = [...Array(L).keys()]
var tc = [...Array(Lc).keys()]

var x = Array(L).fill(0)
var y = Array(L).fill(0)
var z = Array(Lc).fill(0)
var r = Array(L).fill(5)
var rc = Array(Lc).fill(5)

datax = {x: t, y:x, r: r}
datay = {x: t, y:y, r: r}
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
  for (var k = 0 ; k < L ; k++)
  {
       for (var l = 0 ; l < L ; l++)
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

stemx = axisx.stem("dx", "x[n]", datax, true, update)
stemy = axisy.stem("dy", "y[n]", datay, true, update)
stemz = axisz.stem("dz", "(x * y)[n]", dataz, false, update)

d3.select('#reset').on("click", reset)
