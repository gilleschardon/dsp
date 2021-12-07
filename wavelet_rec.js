

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

datascale = {x:t.map(u => u), y:scale}
datascaleb = {x:t.map(u => u+1), y:scale}



datascale1 = {x: t.map(u => u*2 - 2), y:scale.map(u => u/Math.sqrt(2)*ir[2])}
datascale2 = {x: t.map(u => u*2 ), y:scale.map(u => u/Math.sqrt(2)*ir[0])}

datawave1 = {x: t.map(u => u*2-2), y:wave.map(u => u/Math.sqrt(2)*irwave[2])}
datawave2 = {x: t.map(u => u*2 -2+ 2), y:wave.map(u => u/Math.sqrt(2)*irwave[0])}

datascale1b = {x: t.map(u => u*2 - 2), y:scale.map(u => u/Math.sqrt(2)*ir[3])}
datascale2b = {x: t.map(u => u*2 ), y:scale.map(u => u/Math.sqrt(2)*ir[1])}

datawave1b = {x: t.map(u => u*2-2), y:wave.map(u => u/Math.sqrt(2)*irwave[3])}
datawave2b = {x: t.map(u => u*2 -2+ 2), y:wave.map(u => u/Math.sqrt(2)*irwave[1])}


sigrange = [-2.1,6.1];
yrangesig = [-0.6, 1.1]

ntickx = 10
nticky = 5
axisscale = new Axis("#plotscale", "sig", 1400, 400, margins, sigrange, yrangesig, ntickx, nticky)


scaleline = axisscale.line("scale", "\\(\\phi_{0,0}(t)\\)", datascale)

scaleline1 = axisscale.line("scalen", "\\(\\phi_{1,-1}(t)\\)", datascale1)
scaleline2 = axisscale.line("scalen", "\\(\\phi_{1,0}(t)\\)", datascale2)

scalewave1 = axisscale.line("waven", "\\(\\psi_{1,0}(t)\\)", datawave1)
scalewave2 = axisscale.line("waven", "\\(\\psi_{1,1}(t)\\)", datawave2)

axisscaleb = new Axis("#plotscale", "sig", 1400, 400, margins, sigrange, yrangesig, ntickx, nticky)


scalelineb = axisscaleb.line("scale", "\\(\\phi_{0,1}(t)\\)", datascaleb)

scaleline1b = axisscaleb.line("scalen", "\\(\\phi_{1,-1}(t)\\)", datascale1b)
scaleline2b = axisscaleb.line("scalen", "\\(\\phi_{1,0}(t)\\)", datascale2b)

scalewave1b = axisscaleb.line("waven", "\\(\\psi_{1,0}(t)\\)", datawave1b)
scalewave2b = axisscaleb.line("waven", "\\(\\psi_{1,1}(t)\\)", datawave2b)
