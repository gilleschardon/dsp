

var margins = {
  left: 50,
  right: 110,
  bottom: 10,
  top: 10
};

xrange = [-5, 5]
yrange = [-2, 2]

 ntickx =  10
 nticky =  10

axisin1 = new Axis("#plotin1", "ax1", 380, 200, margins, xrange, yrange, ntickx, nticky)

axisin2 = new Axis("#plotin2", "ax2", 380, 200, margins, xrange, yrange, ntickx, nticky)
axisprod = new Axis("#plotprod", "axprod", 380, 200, margins, xrange, yrange, ntickx, nticky)
axisout = new Axis("#plotout", "axz", 380, 200, margins, xrange, yrange, ntickx, nticky)



var Tmax_graph = 5;
var Tmax = 10;
var l = 1000;
var L = 2*l+1

var step = Tmax/l

t = [...Array(L).keys()].map(t => (t/L*2*Tmax - Tmax))

const names = {
  rect: "Rectangle",
  expm: "exp(-t)",
  expp: "exp(t)",
  heaviside: "Heaviside",
  sinus: "Sinus"
}

square = t.map( t=> (Math.abs(t) < 0.5 ? 1 : 0))

expm = t.map(t => t <0 ? 0 : Math.exp(-t))
expp = t.map(t => t >0 ? 0 : Math.exp(t))
heaviside = t.map(t => t >0 ? 1 : 0)
sinus = t.map(t => Math.sin(1.5*t))

const inputs = {
  rect: square,
  expm: expm,
  expp: expp,
  heaviside: heaviside,
  sinus: sinus
}


var datain1 = {x:t, y:square}

var datain2 = {x:t, y:square}

var dataprod = {x:t, y:Array(L).fill(0)}


var datain1B = {x:t, y:[...datain1.y]}

var datain2B = {x:t, y:Array(L).fill(0)}
var dataprod = {x:t, y:Array(L).fill(0)}

var dataout = {x:[], y:[], r:[]}

var datacurrent = {x:[0], y:[0], r:[10]}


R = 5;

var shift = 0

function update_delay()
{
  shift = parseInt(this.value);



  update()
}

function update_data()
{
  datain1B.y = datain1.y

  datain2B.y.fill(0)

  for (var k = 0; k < L ; k++)
  {
   if (((L - 1) + shift - k > -1) &  ((L - 1) + shift - k < L))
   {
     datain2B.y[k] = datain2.y[(L - 1) + shift - k]
     dataprod.y[k] = datain2B.y[k] * datain1.y[k]
    }
  }

ss = dataprod.y.reduce((t, c) => (t+c)) * step
  dataout.x.push(shift*step)
  dataout.y.push(ss)
  dataout.r.push(R)

datacurrent.x = [shift*step]
datacurrent.y = [ss]
}

function update_in1()
{
  datain1.y = inputs[this.value]
  dataout.x = []
  dataout.y = []
  dataout.r = []
  update()
}

function update_in2()
{
  datain2.y = inputs[this.value]
  dataout.x = []
  dataout.y = []
  dataout.r = []
  update()
}

function update()
{
  update_data()

  line1.update()
  line2.update()
  line1B.update()
  line2B.update()
  lineprod.update()
  scatterout.update()
  scattercurrent.update()

}
function reset()
{

}


line1 = axisin1.line("in1", "\\(x(t)\\)", datain1)
line2 = axisin2.line("in2", "\\(y(t)\\)", datain2)

line1B = axisprod.line("in1", "\\(x(t)\\)", datain1B)
line2B = axisprod.line("in2", "\\(y(u-t)\\)", datain2B)
lineprod = axisprod.area("prod", "\\(x(t)y(u_0-t)\\)", dataprod)
scatterout = axisout.scatter("prod", "\\(z(u)\\)", dataout)
scattercurrent = axisout.scatter("current", "\\(z(u_0)\\)", datacurrent)

d3.select('#delay').on("input", update_delay)

d3.select('#in1').on("input", update_in1)
d3.select('#in2').on("input", update_in2)


in1 = document.getElementById('in1')
in2 = document.getElementById('in2')

keys = (Object.keys(names))
for (idin of keys)
{
opt1 = document.createElement("option")
opt1.value = idin
opt1.text =  names[idin]

opt2 = document.createElement("option")
opt2.value = idin
opt2.text =  names[idin]
if (idin == "rect")
{
  opt1.selected="selected"
  opt2.selected="selected"

}
in1.add(opt1, null)
in2.add(opt2, null)

}
update()
