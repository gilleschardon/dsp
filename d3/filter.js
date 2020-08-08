

ir = [1,-1]


var margins = {
  left: 50,
  right: 200,
  bottom: 10,
  top: 10
};

var L = 20
var resol = 10

var t = [...Array(2*L).keys()].map(t => (t - L))
var tc = [...Array(2*L*resol).keys()].map(t => (t/resol - L))

var x = Array(t.length).fill(0)
var y = Array(t.length).fill(0)
var xc = Array(tc.length).fill(0)
var yc = Array(tc.length).fill(0)

var r = Array(t.length).fill(5)


Nfreq = 1000

var nu = [...Array(Nfreq).keys()].map(t => (t/Nfreq - 0.5))
var Hr = Array(Nfreq).fill(0)
var Hi = Array(Nfreq).fill(0)

for (var i = 0; i < nu.length; i++)
  {
             Hr[i] = ir.reduce((a, hh, idx) => a + Math.cos( - 2 * Math.PI * nu[i] * idx) * hh, 0)
             Hi[i] = ir.reduce((a, hh, idx) => a + Math.sin( - 2 * Math.PI * nu[i] * idx) * hh, 0)
  }

Hgain = Hr.map((t, idx) => Math.sqrt(t**2 + Hi[idx]**2))
Hphase = Hr.map((t, idx) => Math.atan2(Hi[idx], t))


datax = {x: t, y:x, r: r}
datay = {x: t, y:y, r: r}
dataxc = {x: tc, y:xc}
datayc = {x: tc, y:xc}


xrange = [-L-0.5,L + 0.5];
yrange = [-2.5, 2.5]


ntickx = 20
nticky = 5

axissig = new Axis("#plotsig", 1000, 200, margins, xrange, yrange, ntickx, nticky)

axisgain = new Axis("#plotgain", 500, 200, margins, [-0.5,0.5], yrange, ntickx, nticky)
axisphase = new Axis("#plotphase", 500, 200, margins, [-0.5,0.5], yrange, ntickx, nticky)


freq = document.getElementById("freq").value / document.getElementById("freq").getAttribute("max") * 0.5

datadg = {x: [freq], y:[0], r:[10]}
datadp = {x: [freq], y:[0], r:[10]}



function update_data()
{

  const cosf = (t => Math.cos(freq * Math.PI * 2 * t))


  datax.y = datax.x.map(t => cosf(t))
  dataxc.y = dataxc.x.map(t => cosf(t))

  for (var i = 0; i < datay.x.length; i++)
          {
               datay.y[i] = ir.reduce((a, hh, idx) => a + cosf(datay.x[i]-idx) * hh, 0)
          }

          for (var i = 0; i < datayc.x.length; i++)
          {
              datayc.y[i] = ir.reduce((a, hh, idx) => a + cosf(datayc.x[i]-idx) * hh, 0)
          }

  Hdr = ir.reduce((a, hh, idx) => a + Math.cos( - 2 * Math.PI * freq * idx) * hh, 0)
  Hdi = ir.reduce((a, hh, idx) => a + Math.sin( - 2 * Math.PI * freq * idx) * hh, 0)

  Hdotgain = Math.sqrt(Hdr**2 + Hdi**2)
  Hdotphase = Math.atan2(Hdi, Hdr);

  datadg.x = [freq]
  datadp.x = [freq]

  datadg.y = [Hdotgain]
  datadp.y = [Hdotphase]


}

function update_freq()
{
  freq = this.value / 200
  update()
}

function update()
{
  update_data()


  linexc.update()

  stemx.update()

  lineyc.update()

  stemy.update()

  scatgain.update()
  scatphase.update()
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

stemx = axissig.stem("in", "x[n]", datax)
stemy = axissig.stem("out", "y[n]", datay)
console.log(datax)
linexc = axissig.line("in", dataxc)
lineyc = axissig.line("out", datayc)

scatgain = axisgain.scatter("gain", datadg)
scatphase = axisphase.scatter("phase", datadp)

datagain = {x:nu, y:Hgain}
dataphase = {x:nu, y:Hphase}


axisgain.line("gain", datagain)
axisphase.line("phase", dataphase)


d3.select('#freq').on("input", update_freq)

update()
