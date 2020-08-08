var margins = {
  left: 50,
  right: 20,
  bottom: 20,
  top: 30
};

var L = 12

var t = [...Array(L).keys()]

var x = [1,1,2, 1.5, 2.5]
var y = [1,2,1, 1.5, 1.5]
var r = Array(x.length).fill(10)
datax = {x: x, y:y, r:r}


xrange = [-1,3];
yrange = [-1, 3]

axisx = new Axis("#plot", 300, 300, margins, xrange, yrange)



function update_plots()
{
  //update_data()

  stem.update()

}


stem = axisx.scatter("voronoi",datax, true, update_plots, true)
