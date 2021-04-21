

h = {
  db1: [1/Math.sqrt(2), 1/Math.sqrt(2)],
  db2: [0.4829, 0.8365, 0.2241, -0.1294],
  db3: [0.3327, 0.8069, 0.4599, -0.1350, -0.0854, 0.0352],
  db4: [0.2304, 0.7148, 0.6309, -0.0280, -0.1870, 0.0308, 0.0329, -0.0106],
  sym4: [0.0322, -0.0126, -0.0992, 0.2979, 0.8037, 0.4976, -0.0296, -0.0758],
  C6: [-0.1029, 0.4779, 1.206, 0.5443, -0.1029,-0.0221].map(t =>t/Math.sqrt(2))
}

names =
{
  db1: "Haar/db1",
  db2: "db2",
  db3: "db3",
  db4: "db4",
  sym4: "sym4",
  C6: "C6"
}

var margins = {
  left: 50,
  right: 200,
  bottom: 10,
  top: 10
};

K = 1

ir = h.db2

scale = ir
wave = [...ir].reverse().map((u, idx) => u * (-1)**idx)

t = [...scale.keys()].map(t => t/2)

R = 10

ir = h.db2

datascale = {x: t, y:scale, r: Array(t.length).fill(Math.min(R, R/(K+1)*20))}
datawave = {x: t, y:wave, r: Array(t.length).fill(Math.min(R, R/(K+1)*20))}


sigrange = [0,7];
yrangesig = [-1.5, 1.5]

ntickx = 10
nticky = 5
axisscale = new Axis("#plotscale", "sig", 1400, 300, margins, sigrange, yrangesig, ntickx, nticky)
axiswave = new Axis("#plotwave", "sig", 1400, 300, margins, sigrange, yrangesig, ntickx, nticky)


function updateK()
{
  K = this.value
  update()
}

function updatewavelet()
{
  ir = h[this.value]
  update()
}

function update()
{
  scale = ir
  wave = [...ir].reverse().map((u, idx) => u * (-1)**idx)
  for (var i = 0 ; i < K - 1 ; i++)
  {
    cup = up2(scale)
    scale = convolve(cup, ir)
    scale = scale.map(t => t * Math.sqrt(2))

    cup = up2(wave)
    wave = convolve(cup, ir)
    wave = wave.map(t => t * Math.sqrt(2))
  }

  var t = [...Array(scale.length).keys()].map((t) => t / 2**K)

  datascale.x = t
  datascale.y = scale
  datascale.r = Array(t.length).fill( K < 5 ? R : 0)

  datawave.x = t
  datawave.y = wave
  datawave.r = Array(t.length).fill( K < 5 ? R : 0)

  scaleline.update()
  scaledot.update()

  waveline.update()
  wavedot.update()
}


scaledot = axisscale.scatter("scaledot", "", datascale)
scaleline = axisscale.line("scale", "\\(\\phi(t)\\)", datascale)
wavedot = axiswave.scatter("wavedot", "", datawave)
waveline = axiswave.line("wave", "\\(\\psi(t)\\)", datawave)

d3.select('#K').on("input", updateK)
d3.select('#wavelet').on("input", updatewavelet)


wavelet = document.getElementById('wavelet')

keys = (Object.keys(names))
for (idin of keys)
{
  opt1 = document.createElement("option")
  opt1.value = idin
  opt1.text =  names[idin]

  if (idin == "db2")
  {
    opt1.selected="selected"
  }
  wavelet.add(opt1, null)
}
