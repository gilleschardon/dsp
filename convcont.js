

// limits

// T gmax raph
var Tmax_graph = 5;
// T max signals
var Tmax = 10;
// number of steps
var l = 1000;
var L = 2*l+1

var step = Tmax/l

t = [...Array(L).keys()].map(t => (t/L*2*Tmax - Tmax))

// number of possible delays
Ndelay = 500
// delays in samples
delay = [...Array(2*Ndelay+1).keys()].map(t => (t-Ndelay))
// delays in time
delayt = [...Array(2*Ndelay+1).keys()].map(t => (t-Ndelay) * step)

// holds the computed values
conv = Array(2*Ndelay+1).fill(NaN)

// signals

const names = {
  rect: "Rectangle",
  crect: "Causal rectangle",
  expm: "exp(-t)",
  expp: "exp(t)",
  heaviside: "Heaviside",
  sinus: "Sinus"
}

square = t.map( t=> (Math.abs(t) < 0.5 ? 1 : 0))
csquare = t.map( t=> (t > 0 & t < 1 ? 1 : 0))
expm = t.map(t => t <0 ? 0 : Math.exp(-t))
expp = t.map(t => t >0 ? 0 : Math.exp(t))
heaviside = t.map(t => t >0 ? 1 : 0)
sinus = t.map(t => Math.sin(1.5*t))

const inputs = {
  rect: square,
  crect: csquare,
  expm: expm,
  expp: expp,
  heaviside: heaviside,
  sinus: sinus
}

// data structure for the plots

var datain1 = {x:t, y:square}
var datain2 = {x:t, y:square}

var dataprod = {x:t, y:Array(L).fill(0)}
var datain1B = {x:t, y:[...datain1.y]}
var datain2B = {x:t, y:Array(L).fill(0)}
var dataprod = {x:t, y:Array(L).fill(0)}
var dataout = {x:[], y:[]}
var datacurrent = {x:[0], y:[0], r:[10]}


R = 5;

// current shift
var shift = Ndelay-1
// new shift
var newshift = Ndelay
// at initialization, computes the value at Ndelay

// interactivity, dragging the red dot
function update_delay(i, x, y)
{

  newshift = Math.floor(x/step+Ndelay)
  newshift = (newshift > 2*Ndelay) ? 2*Ndelay : newshift
  newshift = (newshift < 0) ? 0 : newshift

  update()
}

// updating the data
// computes the convolution values between the previous delay and the new delay
// shift y(t)
// add the values to the plot
function update_data()
{
  datain1B.y = datain1.y

  stepsamp = (newshift > shift) ? 1 : -1
  if (newshift != shift)
  {
    for (var i = shift + stepsamp ; i != newshift + stepsamp; i += stepsamp)
    {
      console.log(i)
      datain2B.y.fill(0)

      // this is where the convolution is computed

      // computing the product
      for (var k = 0; k < L ; k++)
      {
        if (((L - 1) + delay[i] - k > -1) &  ((L - 1) + delay[i] - k < L))
        {
          datain2B.y[k] = datain2.y[(L - 1) + delay[i] - k]
          dataprod.y[k] = datain2B.y[k] * datain1.y[k]
        }
      }
      // summing
      ss = dataprod.y.reduce((t, c) => (t+c)) * step
      conv[i] = ss
    }
  }



 shift = newshift

 // filtering the nonNaN values, keeping the computing values
 dataout.x = delayt.filter((v, i) => ! isNaN(conv[i]))
 dataout.y = conv.filter(v => ! isNaN(v))

 // current index and value
 datacurrent.x = [delayt[shift]]
 datacurrent.y = [ss]

}

// changes the first signal
function update_in1()
{
  datain1.y = inputs[this.value]
  // remove the previous values
  conv = Array(2*Ndelay+1).fill(NaN)

  // recentering the plot and compute the first value
  shift = Ndelay-1
  newshift = Ndelay

  update()
}

// same for second signal
function update_in2()
{
  datain2.y = inputs[this.value]

  conv = Array(2*Ndelay+1).fill(NaN)

  shift = Ndelay-1
  newshift = Ndelay

  update()
}

function update()
{
  // updates the data
  update_data()

  // and the plots
  line1.update()
  line2.update()
  line1B.update()
  line2B.update()
  lineprod.update()
  scatterout.update()
  scattercurrent.update()

}



// margins, ranges, etc.

var margins = {
  left: 50,
  right: 120,
  bottom: 10,
  top: 10
};

xrange = [-5, 5]
yrange = [-2, 2]

ntickx =  10
nticky =  10

// axes

axisin1   = new Axis("#plotin1", "ax1", 380, 200, margins, xrange, yrange, ntickx, nticky)
axisin2   = new Axis("#plotin2", "ax2", 380, 200, margins, xrange, yrange, ntickx, nticky)
axisprod  = new Axis("#plotprod", "axprod", 380, 200, margins, xrange, yrange, ntickx, nticky)
axisout   = new Axis("#plotout", "axz", 380, 200, margins, xrange, yrange, ntickx, nticky)

// plots

line1 = axisin1.line("in1", "\\(x(t)\\)", datain1)

line2 = axisin2.line("in2", "\\(y(t)\\)", datain2)

line1B = axisprod.line("in1", "\\(x(t)\\)", datain1B)
line2B = axisprod.line("in2", "\\(y(u_0-t)\\)", datain2B)
lineprod = axisprod.area("prod", "\\(x(t)y(u_0-t)\\)", dataprod)

scatterout = axisout.line("prod", "\\(z(u)\\)", dataout)
scattercurrent = axisout.scatter("current", "\\(z(u_0)\\)", datacurrent, update_delay)

// signal selection

d3.select('#in1').on("input", update_in1)
d3.select('#in2').on("input", update_in2)

document.addEventListener('keydown', keypress)

function keypress(e)
{
  if (e.code == "ArrowRight" && e.ctrlKey)
  {
    newshift = shift+10
    update()
  }
  else if (e.code == "ArrowLeft" && e.ctrlKey)
  {
    newshift = shift-10
    update()
  }
  else if (e.code == "ArrowRight")
  {
    newshift = shift+1
    update()
  }
  else if (e.code == "ArrowLeft")
  {
    newshift = shift-1
    update()
  }
}
// populating the options

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

// initialization

update()
