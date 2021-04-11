

var margins = {
  left: 50,
  right: 200,
  bottom: 10,
  top: 10
};


L = 1000
var tt = [...Array(L+1).keys()].map(t => (t/L))

function mfun(t)
{return Math.cos(10*(t+0.2)**2)}

var ff = tt.map(mfun)

var datafun = {x:tt, y:ff}


var n = 1

R = 10
var r = Array(n+1).fill(R)

var logf = [0.0, 0.000000, 0.693147, 1.791759, 3.178054, 4.787492, 6.579251, 8.525161, 10.604603, 12.801827, 15.104413, 17.502308, 19.987214, 22.552164, 25.191221, 27.899271, 30.671860, 33.505073, 36.395445, 39.339884, 42.335616, 45.380139, 48.471181, 51.606676, 54.784729, 58.003605, 61.261702, 64.557539, 67.889743, 71.257039, 74.658236, 78.092224, 81.557959, 85.054467, 88.580828, 92.136176, 95.719695, 99.330612, 102.968199, 106.631760, 110.320640, 114.034212, 117.771881, 121.533082, 125.317271, 129.123934, 132.952575, 136.802723, 140.673924, 144.565744, 148.477767, 152.409593, 156.360836, 160.331128, 164.320112, 168.327445, 172.352797, 176.395848, 180.456291, 184.533829, 188.628173, 192.739047, 196.866182, 201.009316, 205.168199, 209.342587, 213.532241, 217.736934, 221.956442, 226.190548, 230.439044, 234.701723, 238.978390, 243.268849, 247.572914, 251.890402, 256.221136, 260.564941, 264.921650, 269.291098, 273.673124, 278.067573, 282.474293, 286.893133, 291.323950, 295.766601, 300.220949, 304.686857, 309.164194, 313.652830, 318.152640, 322.663499, 327.185288, 331.717887, 336.261182, 340.815059, 345.379407, 349.954118, 354.539086, 359.134205, 363.739376, 368.354496, 372.979469, 377.614198, 382.258589, 386.912549, 391.575988, 396.248817, 400.930948, 405.622296, 410.322777, 415.032307, 419.750806, 424.478193, 429.214392, 433.959324, 438.712914, 443.475088, 448.245773, 453.024896, 457.812388, 462.608179, 467.412200, 472.224384, 477.044665, 481.872979, 486.709261, 491.553448, 496.405478, 501.265291, 506.132825, 511.008023, 515.890825, 520.781174, 525.679014, 530.584288, 535.496943, 540.416924, 545.344178, 550.278652, 555.220294, 560.169054, 565.124881, 570.087726, 575.057539, 580.034273, 585.017879, 590.008312, 595.005524, 600.009471, 605.020106, 610.037386, 615.061266, 620.091704, 625.128657, 630.172082, 635.221938, 640.278184, 645.340779, 650.409683, 655.484857, 660.566261, 665.653857, 670.747608, 675.847474, 680.953420, 686.065407, 691.183401, 696.307365, 701.437264, 706.573062];

function binomial(n, k) {
    return Math.exp(logf[n] - logf[n-k] - logf[k]);
}

Nfreq = 1000

var w = [...Array(n+1).keys()].map(t => (t/n))
var p = [0.9, 0.1]


dataproba = {x: w, y: p, r: r}

xrange = [-0.1,1.1];
yrange = [0, 1.1]
yrange2 = [-1.1, 1.1]


ntickx = 20
nticky = 5

axisir = new Axis("#plotproba", "ir", 1000, 200, margins, xrange, yrange, ntickx, nticky)
axisfun = new Axis("#plotfun", "fun", 1000, 200, margins, xrange, yrange2, ntickx, nticky)

var x = 0.1


var datascat = {x:[x], y:[0.9*mfun(0) + 0.1*mfun(1)], r:[R]}

var databern = {x:tt, y: tt.map(t => (1 - t)*mfun(0) + t*mfun(1))}

var binoms = dataproba.x.map((t, k) => binomial(n, k))

function update_xx()
{
  dataproba.y = dataproba.x.map((t, k) => binoms[k] * x**k * (1-x)**(n-k))


  datascat.x = [x]
  datascat.y = [dataproba.y.reduce((acc, v, idx) => acc + v * mfun(dataproba.x[idx]), 0)]

}

function update_nn()
{
  dataproba.x = [...Array(n+1).keys()].map(t => (t/n))
  dataproba.r = Array(n+1).fill(R)
  binoms = dataproba.x.map((t, k) => binomial(n, k))

  databern.y = Array(n+1)

  for (idx = 0 ; idx < L+1; idx++)
  {
    weights = dataproba.x.map((t, k) => binoms[k] * tt[idx]**k * (1-tt[idx])**(n-k))
    databern.y[idx] = weights.reduce((acc, v, idx) => acc + v * mfun(dataproba.x[idx]), 0)
  }



  update_xx()
}

function update_n()
{

  n = parseInt(this.value)
  update_nn()
  update()
}

function update_x()
{
  x = this.value/100;
  update_xx()
  update()
}

function update()
{


  stem.update()
  scat.update()
  bern.update()
}


stem = axisir.stem("proba", "\\(P_{S'_n}\\)", dataproba)

fun = axisfun.line("fun", "\\(f(x)\\)", datafun)

scat = axisfun.scatter("sc", "\\(p_n(x)\\)", datascat)
bern = axisfun.line("bern", "\\(p_n\\)", databern)

d3.select('#n').on("input", update_n)
d3.select('#x').on("input", update_x)

update()
