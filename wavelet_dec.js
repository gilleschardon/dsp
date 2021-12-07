

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

K = 10

ir = h.db2
irwave = [...ir].reverse().map((u, idx) => u * (-1)**idx)

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

datascale = {x:t, y:scale}
datawave = {x:t.map(u => u - 1), y:wave}




datascale1 = {x: t.map(u => u/2), y:scale.map(u => u*Math.sqrt(2)*ir[0])}
datascale2 = {x: t.map(u => u/2 + 1/2), y:scale.map(u => u*Math.sqrt(2)*ir[1])}
datascale3 = {x: t.map(u => u/2 + 2/2), y:scale.map(u => u*Math.sqrt(2)*ir[2])}
datascale4 = {x: t.map(u => u/2 + 3/2), y:scale.map(u => u*Math.sqrt(2)*ir[3])}

datawave1 = {x: t.map(u => u/2-1), y:scale.map(u => u*Math.sqrt(2)*irwave[0])}
datawave2 = {x: t.map(u => u/2 -1+ 1/2), y:scale.map(u => u*Math.sqrt(2)*irwave[1])}
datawave3 = {x: t.map(u => u/2 -1+ 2/2), y:scale.map(u => u*Math.sqrt(2)*irwave[2])}
datawave4 = {x: t.map(u => u/2 -1+ 3/2), y:scale.map(u => u*Math.sqrt(2)*irwave[3])}

sigrange = [-1.1,3.1];
yrangesig = [-1.1, 1.3]

ntickx = 10
nticky = 5
axisscale = new Axis("#plotscale", "sig", 1400, 300, margins, sigrange, yrangesig, ntickx, nticky)
axiswave = new Axis("#plotwave", "sig", 1400, 300, margins, sigrange, yrangesig, ntickx, nticky)


scaleline = axisscale.line("scale", "\\(\\phi_{0,0}(t)\\)", datascale)
waveline = axiswave.line("wave", "\\(\\psi_{0,0}(t)\\)", datawave)

scaleline1 = axisscale.line("scalen", "\\(\\phi_{-1,0}(t)\\)", datascale1)
scaleline2 = axisscale.line("scalen", "\\(\\phi_{-1,1}(t)\\)", datascale2)
scaleline3 = axisscale.line("scalen", "\\(\\phi_{-1,2}(t)\\)", datascale3)
scaleline4 = axisscale.line("scalen", "\\(\\phi_{-1,3}(t)\\)", datascale4)
scalewave1 = axiswave.line("scalen", "\\(\\phi_{-1,-2}(t)\\)", datawave1)
scalewave2 = axiswave.line("scalen", "\\(\\phi_{-1,1}(t)\\)", datawave2)
scalewave3 = axiswave.line("scalen", "\\(\\phi_{-1,0}(t)\\)", datawave3)
scalewave4 = axiswave.line("scalen", "\\(\\phi_{-1,1}(t)\\)", datawave4)
