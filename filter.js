


const names = {
  dirac: "Dirac",
  delay: "Delay",
  diff: "Diff",
  diff2: "Diff 2",
  ma5: "MA-5",
  ma10: "MA-10",
  hann:"Hann",
  hannsinc: "Sinc*Hann",
  hanncos: "Sinc*Hann*Cos"
}
Lh = 20
Nh = 2*Lh+1
var hann = [...Array(Nh).keys()].map(t => (1 - Math.cos(t / Lh * Math.PI))/40)

var hannsinc = [...Array(Nh).keys()].map(t => t == Lh ? 4*Math.PI*0.2/10 : (1 - Math.cos(t / Lh * Math.PI))/10 * Math.sin((t-Lh)*2*Math.PI*0.2)/ (t - Lh))
var S  = hannsinc.reduce((u, v) => (u+v))
hannsinc = hannsinc.map(t => t/S)

var hanncos = [...Array(Nh).keys()].map(t => 2*(t == Lh ? 4*Math.PI*0.1/10 : (1 - Math.cos(t / Lh * Math.PI))/10 * Math.sin((t-Lh)*2*Math.PI*0.1)/ (t - Lh)))
var S  = hanncos.reduce((u, v) => (u+v))
hanncos = hanncos.map(t => t/S*2)
hanncos = [...Array(Nh).keys()].map((t, u) => hanncos[u] * Math.cos(Math.PI * 2 * t * 0.2))

const IR = {
  dirac: [1],
  delay: [0,0,0,0,1],
  diff: [1/2,-1/2],
  diff2: [1, -2, 1].map(t=>t/4),
  ma5: Array(5).fill(1/5),
  ma10: Array(10).fill(1/10),
  hann:hann,
  hannsinc: hannsinc,
  hanncos: hanncos
}


var margins = {
  left: 50,
  right: 200,
  bottom: 10,
  top: 10
};

var margins2 = {
  left: 50,
  right: 100,
  bottom: 10,
  top: 10
};

var margins3 = {
  left: 20,
  right: 100,
  bottom: 10,
  top: 10
};

var L = 45
var resol = 10

var shift = 2
var t = [...Array(L).keys()].map(t => (t -shift))
var tc = [...Array(L*resol).keys()].map(t => (t/resol-shift))

var x = Array(t.length).fill(0)
var y = Array(t.length).fill(0)
var xc = Array(tc.length).fill(0)
var yc = Array(tc.length).fill(0)

var rir = Array(t.length).fill(10)
var r = Array(t.length).fill(5)


Nfreq = 1000



var nu = [...Array(Nfreq).keys()].map(t => (t/Nfreq - 0.5))
var Hr = Array(Nfreq).fill(0)
var Hi = Array(Nfreq).fill(0)

var ir = [1];

var Hgain = Array(Nfreq).fill(0)
var Hphase = Array(Nfreq).fill(0)


datair = {x: t, y:Array(t.length).fill(0), r: rir}
datair.y[shift] = 1

datax = {x: t, y:x, r: r}
datay = {x: t, y:y, r: r}
dataxc = {x: tc, y:xc}
datayc = {x: tc, y:xc}


xrange = [-shift+0.5,L - shift - 0.5];
yrange = [-1.1, 1.1]
yrangegain = [-0.2, 1.1]


yrangephase = [-3.5, 3.5]
yrangeir = [-1.1, 1.1]


ntickx = 20
nticky = 5

axissig = new Axis("#plotsig", "sig", 1000, 200, margins, xrange, yrange, ntickx, nticky)
axisir = new Axis("#plotir", "ir", 1000, 200, margins, xrange, yrangeir, ntickx, nticky)

axisgain = new Axis("#plotgain", "gain", 380, 200, margins2, [-0.5,0.5], yrangegain, ntickx, nticky)
axisphase = new Axis("#plotphase", "phase", 380, 200, margins3, [-0.5,0.5], yrangephase, ntickx, nticky)


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

function select_ir()
{



  ir = [...IR[this.value]]
  update_ir()
}

function update_ir()
{
  irplot = Array(t.length).fill(0)
  irplot.splice(shift, ir.length, ...ir)
  datair.y = irplot

  for (var i = 0; i < nu.length; i++)
    {
               Hr[i] = ir.reduce((a, hh, idx) => a + Math.cos( - 2 * Math.PI * nu[i] * idx) * hh, 0)
               Hi[i] = ir.reduce((a, hh, idx) => a + Math.sin( - 2 * Math.PI * nu[i] * idx) * hh, 0)
    }

  datagain.y = Hr.map((t, idx) => Math.sqrt(t**2 + Hi[idx]**2))
  dataphase.y = Hr.map((t, idx) => Math.atan2(Hi[idx], t))

stemir.update()
lg.update()
lp.update()

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

function drag_ir(i, x, y)
{
  idx = i - shift;
  if (idx < 0)
  {
      return;
  }

  if (idx > ir.length)
  {
    ir.splice(ir.length, 0, ...Array(idx-ir.length + 1).fill(0))
  }
  ir[idx] = y;
  update_ir()

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

stemir = axisir.stem("ir", "IR", datair, drag_ir)

stemx = axissig.stem("in", "\\(x[n]\\)", datax)
stemy = axissig.stem("out", "\\(y[n]\\)", datay)
linexc = axissig.line("in", "", dataxc)
lineyc = axissig.line("out", "", datayc)

scatgain = axisgain.scatter("gain", "Gain", datadg)
scatphase = axisphase.scatter("phase", "Phase", datadp)

datagain = {x:nu, y:Array(nu.length).fill(1)}
dataphase = {x:nu, y:Array(nu.length).fill(0)}


lg = axisgain.line("gain", "", datagain)
lp = axisphase.line("phase", "", dataphase)


d3.select('#freq').on("input", update_freq)
d3.select('#filter').on("input", select_ir)


irchoice = document.getElementById('filter')

keys = (Object.keys(names))
for (idin of keys)
{
opt = document.createElement("option")
opt.value = idin
opt.text =  names[idin]

if (idin == "Dirac")
{
  opt.selected="selected"

}
irchoice.add(opt, null)

}

update()
