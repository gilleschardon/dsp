// G. Chardon, 2020
// No licence yet, work in progress


var margins = {
  left: 50,
  right: 20,
  bottom: 20,
  top: 30
};
data1 = Array()
data2 = Array()

labels = Array()
var rx = d3.randomNormal(0, 1)
var ry = d3.randomNormal(0, 1)

for(var i = 0 ; i < 20 ; i++)
{
  d = Array(2)
  d[0] = rx()
  d[1] = ry()

  data1.push(d)
  labels.push(-1)
}

var rx = d3.randomNormal(4, 1)
var ry = d3.randomNormal(4, 1)

for(var i = 0 ; i < 20 ; i++)
{
  d = Array(2)
  d[0] = rx()
  d[1] = ry()

  data2.push(d)
  labels.push(1)

}

xrange = [-4,8];
yrange = [-4, 8]

datat1 = d3.transpose(data1)
datat2 = d3.transpose(data2)

datad1 = {x: datat1[0], y: datat1[1], r: Array(20).fill(10)}
datad2 = {x: datat2[0], y: datat2[1], r: Array(20).fill(10)}




var SVMp = libsvm

var SVM = 0
var svm = 0


SVMp.then(function(result){ SVM = result



C = 1

var sel = document.getElementById('kernel');
k = (sel.options[sel.selectedIndex].value)

if (k == "linear")
{
  kernel = SVM.KERNEL_TYPES.LINEAR
}
else if (k == "RBF")
{
  kernel = SVM.KERNEL_TYPES.RBF
}
else if (k == "polynomial")
{
  kernel = SVM.KERNEL_TYPES.POLYNOMIAL
}

svm = new SVM({
    //kernel: SVM.KERNEL_TYPES.LINEAR, // The type of kernel I want to use

    kernel: kernel, // The type of kernel I want to use


    type:SVM.SVM_TYPES.C_SVC,    // The type of SVM I want to run
    cost: C,                    // C_SVC cost parameter
    degree: 2
});

datasvm = d3.zip(datad1.x, datad1.y).concat(d3.zip(datad2.x, datad2.y))
datatrans = d3.transpose(datasvm)
svm.train(datasvm, labels);
S = svm.serializeModel()
plot_svm(kernel == SVM.KERNEL_TYPES.LINEAR)
drawclasses()

})


axis = new Axis("#plot", 600, 600, margins, xrange, yrange)
canvas = d3.select("#canvas")
W = 600;
H = 600
canvas.attr("width", 600).attr("height", 600)

var context = canvas.node().getContext("2d")



function extractSV(svm)
{
  var SV = {x: [], y:[], w:[]}

  var S = svm.serializeModel()
  Sarr = S.split("\n")

  rho = parseFloat(Sarr[Sarr.indexOf("SV")-3].split(" ")[1])

  for (var k = Sarr.indexOf("SV")+1 ; k < Sarr.length-1; k++)
  {
    z = Sarr[k].split(" ")
    w = parseFloat(z[0])
    x = parseFloat(z[1].split(":")[1])
    y = parseFloat(z[2].split(":")[1])


    SV.w.push(w)
    SV.x.push(x)
    SV.y.push(y)

  }
  return [SV, rho]
}



function plot_svm(margin = false)
{

  ssvrho = extractSV(svm)
  ssv = ssvrho[0]
  rho = ssvrho[1]
  sv.x = ssv.x
  sv.y = ssv.y
  sv.w = ssv.w

  sv.r = Array(sv.y.length).fill(20)
svsc.update()

dataline.x = [-1000, -2000]
dataline.y = [-1000, -2000]
dataline1.x = [-1000, -2000]
dataline1.y = [-1000, -2000]
dataline2.x = [-1000, -2000]
dataline2.y = [-1000, -2000]
  if (margin)
  {
  normalx = 0
  normaly = 0

    centerx = 0
    centery = 0
    sum = 0

    centerxp = 0
    centeryp = 0
    centerxm = 0
    centerym = 0
    summ = 0
    sump = 0



  for (var k = 0 ; k < sv.x.length ; k++)
  {
    normalx = normalx + sv.w[k]*sv.x[k]
    normaly = normaly + sv.w[k]*sv.y[k]

    sum = sum + Math.abs(sv.w[k])
  }
  n2 = normalx**2 + normaly**2

  zz = sv.x[0]*normalx + sv.y[0]*normaly - rho

  alpha = (-zz)/n2
  alphap = (-zz-1)/n2
  alpham = (-zz+1)/n2

  centerx = sv.x[0] + alpha * normalx
  centery = sv.y[0] + alpha * normaly

  centerxp = sv.x[0] + alphap * normalx
  centeryp = sv.y[0] + alphap * normaly

  centerxm = sv.x[0] + alpham * normalx
  centerym = sv.y[0] + alpham * normaly

  dirx = normaly
  diry = -normalx

  n2 = normalx**2 + normaly**2
  dataline.x = [centerx + 100*dirx, centerx  - 100*dirx]
  dataline.y = [centery  + 100*diry, centery   - 100* diry]
  dataline1.x = [centerxp + 100*dirx, centerxp  - 100*dirx]
  dataline1.y = [centeryp  + 100*diry, centeryp   - 100* diry]
  dataline2.x = [centerxm + 100*dirx, centerxm  - 100*dirx]
  dataline2.y = [centerym  + 100*diry, centerym   - 100* diry]
}
  line.update()
  line1.update()
  line2.update()


}


function drag()
{
  datasvm = d3.zip(datad1.x, datad1.y).concat(d3.zip(datad2.x, datad2.y))
  datatrans = d3.transpose(datasvm)

  svm.free()
  svm = new SVM({
      //kernel: SVM.KERNEL_TYPES.LINEAR, // The type of kernel I want to use

      kernel: kernel, // The type of kernel I want to use


      type:SVM.SVM_TYPES.C_SVC,    // The type of SVM I want to run
      cost: C,                    // C_SVC cost parameter
      degree: 2
  });


  svm.train(datasvm, labels);

  plot_svm(kernel == SVM.KERNEL_TYPES.LINEAR)
  drawclasses()
  scat1.update()
  scat2.update()

}
dataline = {x: [0,0], y: [0,0], r:  [0,0]}
dataline1 = {x: [0,0], y: [0,0], r:  [0,0]}
dataline2 = {x: [0,0], y: [0,0], r:  [0,0]}

sv = {x: [0,0], y: [0,0], r:  [0,0]}
svsc = axis.scatter("data3", sv)
line = axis.line('line', dataline)
line1 = axis.line('line1', dataline1)
line2 = axis.line('line2', dataline2)
scat1 = axis.scatter("data1", datad1, true, drag)
scat2 = axis.scatter("data2", datad2, true, drag)




Nx = 50
Ny = 50

const XY = new Array()

dx = (xrange[1]-xrange[0])/Nx
dy = (yrange[1]-yrange[0])/Ny
for (var k = 0; k < Nx ; k++)

{
  for (var j = 0; j < Ny ; j++)
  {
    XY.push([(k + 0.5)*dx + xrange[0], (j + 0.5)*dy + yrange[0]])
  }
}

ws = W/Nx
hs = H/Ny

oldpred = Array(Nx*Ny).fill(0)

function drawclasses()
{
  context.fillStyle = "white"
context.globalAlpha = 1
  //context.fillRect(0, 0, W, H);

s = new Date()
pred = svm.predict(XY)
e = new Date()

console.log(e - s)

var ii = 0
context.globalAlpha = 1
context.fillStyle = "white"

for (var k = 0; k < Nx ; k++)
{
  for (var j = 0; j < Ny ; j++)
  {
    if (pred[ii] != oldpred[ii])
    {

      //context.beginPath();
      context.fillRect(Math.round(k*ws), Math.round(H-j*hs), Math.round(ws), Math.round(hs))

}
    ii++
  }
}

context.globalAlpha = 0.3
context.fillStyle = "blue"

var ii = 0
for (var k = 0; k < Nx ; k++)
{
  for (var j = 0; j < Ny ; j++)
  {
    if (pred[ii] != oldpred[ii] && pred[ii]==1)
    {
      context.fillRect(Math.round(k*ws), Math.round(H-j*hs), Math.round(ws), Math.round(hs))
    }
    ii++
  }
}
context.fillStyle = "red"

var ii = 0
for (var k = 0; k < Nx ; k++)
{
  for (var j = 0; j < Ny ; j++)
  {
    if (pred[ii] != oldpred[ii] && pred[ii]==-1)
    {
      context.fillRect(Math.round(k*ws), Math.round(H-j*hs), Math.round(ws), Math.round(hs))


      //context.fill()
}
    ii++
  }
}

// var ii = 0
// for (var k = 0; k < Nx ; k++)
// {
//   for (var j = 0; j < Ny ; j++)
//   {
//     if (pred[ii] != oldpred[ii])
//     {
//       context.globalAlpha = 1
//
//       context.fillStyle = "white"
//       //context.beginPath();
//       //context.ellipse(k*ws + ws/2, H-j*hs - hs/2, ws/2, hs/2, 0, 0, 2*Math.PI)
//       //context.ellipse(k*ws + ws/2, H-j*hs - hs/2, ws/2, hs/2, 0, 0, 2*Math.PI)
//       context.fillRect(k*ws, H-j*hs, ws, hs)
//
//       //context.fill()
//       context.globalAlpha = 0.3
//
//       context.fillStyle = (pred[ii] == 1) ? "blue" : "red"
//       context.fillRect(k*ws, H-j*hs, ws, hs)
//
//       //context.beginPath();
//       //context.ellipse(k*ws + ws/2, H-j*hs - hs/2, ws/2, hs/2, 0, 0, 2*Math.PI)
//       //context.fill()
// }
//     ii++
//   }
// }

oldpred = pred
}

function invC()
{
  C = this.value
  drag()
}

function change_kernel()
{
  k = this.value

  if (k == "linear")
  {
    kernel = SVM.KERNEL_TYPES.LINEAR
  }
  else if (k == "RBF")
  {
    kernel = SVM.KERNEL_TYPES.RBF
  }
  else if (k == "polynomial")
  {
    kernel = SVM.KERNEL_TYPES.POLYNOMIAL
  }
  drag()
}


d3.select('#invC').on("input", invC)
d3.select('#kernel').on("input", change_kernel)
