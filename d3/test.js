
var margins = {
  left: 50,
  right: 20,
  bottom: 20,
  top: 30
};

var L = 12

var t = [...Array(L).keys()]

var x = Array(L).fill(0)
var y = Array(L).fill(0)
var z = Array(L).fill(0)
var r = Array(L).fill(5)

datax = {x: t, y:x, r: r}
datay = {x: t, y:y, r: r}
dataz = {x: t, y:z, r: r}

xrange = [-1,L];
yrange = [-2, 2]

axisx = new Axis("#plotx", 500, 150, margins, xrange, yrange)
axisy = new Axis("#ploty", 500, 150, margins, xrange, yrange)
axisz = new Axis("#plotz", 500, 150, margins, xrange, yrange)



function update_data()
{
  dataz.y.fill(0)
  for (var k = 0 ; k < L ; k++)
  {
       for (var l = 0 ; l < L ; l++)
       {
               dataz.y[(k+l)%L] = dataz.y[(k+l)%L] + datax.y[k] * datay.y[l]
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

stemx = axisx.stem(datax, true, update)
stemy = axisy.stem(datay, true, update)
stemz = axisz.stem(dataz, false, update)

d3.select('#reset').on("click", reset)
