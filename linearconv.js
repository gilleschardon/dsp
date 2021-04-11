
var margins = {
  left: 50,
  right: 200,
  bottom: 10,
  top: 10
};


// length of the signals
var L1 = 8
var L2 = 10
var Lc = L1 + L2 - 1

// indices
var t1 = [...Array(L1).keys()]
var t2 = [...Array(L2).keys()]
var tc = [...Array(Lc).keys()]

// signals
var x = Array(L1).fill(0)
var y = Array(L2).fill(0)
var z = Array(Lc).fill(0)

// radius of the disks
var r1 = Array(L1).fill(10)
var r2 = Array(L2).fill(10)
var rc = Array(Lc).fill(10)

// data for the stems
datax = {x: t1, y:x, r: r1}
datay = {x: t2, y:y, r: r2}
dataz = {x: tc, y:z, r: rc}

// ranges of the plots
xrange = [-0.5,Lc - 0.5];
yrange = [-2.5, 2.5]
yrange2 = [-4.5, 4.5]

// number of ticks
ntickx = 20
nticky = 5

// creating the axes
axisx = new Axis("#plotx", "x", 700, 150, margins, xrange, yrange, ntickx, nticky)
axisy = new Axis("#ploty", "y", 700, 150, margins, xrange, yrange, ntickx, nticky)
axisz = new Axis("#plotz", "z", 700, 300, margins, xrange, yrange2, ntickx, nticky*2)


// updating the data = computing the convolution
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

// updating the plots
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

  update()
}

// update the data when points are dragged
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

// creating the stem plots
stemx = axisx.stem("dx", "\\(x[n]\\)", datax, updatex)
stemy = axisy.stem("dy", "\\(y[n]\\)", datay, updatey)
stemz = axisz.stem("dz", "\\((x * y)[n]\\)", dataz)

d3.select('#reset').on("click", reset)
