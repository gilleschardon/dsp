Wintype= 'rect'

var Lmax = 100
var Lmin = 20
var Zmax = 500
var Nfreq = 2000

var Lwin = 20

nu1 = 0.1047;
nu2 = 0.1361;
nu3 = 0.2761;

ir = [...Array(Lmax).keys()].map(t => Math.cos(2 * Math.PI * nu1 * t)/2 + Math.cos(2 * Math.PI * nu2 * t)/2 + 0.005 * Math.cos(2 * Math.PI * nu3 * t))
win = Array(Lmax).fill(0);
win.splice(0, Lwin, ...Array(Lwin).fill(1))

var margins = {
  left: 50,
  right: 200,
  bottom: 10,
  top: 10
};

var margins2 = {
  left: 50,
  right: 200,
  bottom: 40,
  top: 10
};

var margins3 = {
  left: 20,
  right: 25,
  bottom: 10,
  top: 10
};

document.getElementById("zeropad").setAttribute("min", Lmin)
document.getElementById("zeropad").value=Lmin

document.getElementById("length").setAttribute("min", Lmin)
document.getElementById("length").value=Lmin


R = (5)
var r = Array(Lwin).fill(R)


irwin = ir.map((t, i) => t * win[i])

var nu = [...Array(Nfreq).keys()].map(t => (t/Nfreq*1.5-0.5))
var Hr = Array(Nfreq).fill(0)
var Hi = Array(Nfreq).fill(0)

var fftshift = false;
for (var i = 0; i < nu.length; i++)
{
  Hr[i] = irwin.reduce((a, hh, idx) => a + Math.cos( - 2 * Math.PI * nu[i] * idx) * hh, 0)
  Hi[i] = irwin.reduce((a, hh, idx) => a + Math.sin( - 2 * Math.PI * nu[i] * idx) * hh, 0)
}

Hgain = Hr.map((t, idx) => (10*Math.log10(t**2 + Hi[idx]**2)))

datair = {x: [...Array(Lwin).keys()], y: irwin, r: r}

datadft = {x: [...Array(Lwin).keys()], y: irwin, r: r}


datagain = {x: nu, y:Hgain}
xrange = [-0.5,Zmax + 0.5];
yrange = [-1.1, 1.1]

nurange = [-0.5,1]
Hrange = [-70.1,30.1]

ntickx = 20
nticky = 5

axisir = new Axis("#plotir", "ir", 1000, 200, margins, xrange, yrange, ntickx, nticky)

axisgain = new Axis("#plotgain", "gain", 1000, 400, margins2, nurange, Hrange, ntickx, nticky)

Lzero = Lwin

function update_data()
{
  shift = fftshift ? Math.floor(Lzero/2) : 0

  datair.x = [...Array(+Lzero).keys()]
  datair.r = Array(+Lzero).fill(R)
  datair.y = Array(+Lzero).fill(0)
  datair.y.splice(0, Lmax, ...irwin)

  datadft.x = [...Array(+Lzero).keys()].map((t) => ((t - shift)/Lzero))
  datadft.r = Array(+Lzero).fill(R)
  datadft.y = Array(+Lzero).fill(0)

  for (var i = 0; i < Lzero; i++)
  {

    RR = irwin.reduce((a, hh, idx) => a + Math.cos( - 2 * Math.PI * (i-shift) * (idx/ Lzero)) * hh, 0)
    II = irwin.reduce((a, hh, idx) => a + Math.sin( - 2 * Math.PI * (i-shift) * (idx/ Lzero)) * hh, 0)

    datadft.y[i] = 10*Math.log10(RR**2 + II**2)

  }

  datagain.y = Hgain


}

function update_zero()
{

  Lzero = Math.max(this.value, Lwin)
  document.getElementById("zeropad").value = Lzero

  update()
}
function update_length()
{

  Lwin = +this.value
  Lzero = Math.max(Lwin, Lzero)
  document.getElementById("zeropad").value = Lzero

  update_spectrum()
}

function update_win()
{

  Wintype = this.value

  update_spectrum()

}

function update_spectrum()
{
  win = Array(Lmax).fill(0);

  if (Wintype == "Hann")
  {
    winloc = [...Array(+Lwin).keys()].map((t) =>  -Math.cos( t * Math.PI * 2 / Lwin)/2 + 1/2)
    win.splice(0, Lwin, ...winloc)
  }
  else if (Wintype == "Hamming")
  {
    winloc = [...Array(+Lwin).keys()].map((t) =>  -Math.cos( t * Math.PI * 2 / Lwin)*0.46 + 0.54)
    win.splice(0, Lwin, ...winloc)
  }
  else if (Wintype == "sine")
  {
    winloc = [...Array(+Lwin).keys()].map((t) =>  Math.sin( t * Math.PI / Lwin))
    win.splice(0, Lwin, ...winloc)
  }
  else
  {
    win.splice(0, Lwin, ...Array(Lwin).fill(1))
  }
  irwin = ir.map((t, i) => t * win[i])
  for (var i = 0; i < nu.length; i++)
  {


    Hr[i] = irwin.reduce((a, hh, idx) => a + Math.cos( - 2 * Math.PI * nu[i] * idx) * hh, 0)
    Hi[i] = irwin.reduce((a, hh, idx) => a + Math.sin( - 2 * Math.PI * nu[i] * idx) * hh, 0)
  }

  Hgain = Hr.map((t, idx) => (t**2 + Hi[idx]**2)).map(t => 10*Math.log10(t))


  update()
}

function update_shift()
{
  fftshift = this.checked;
  update()
}

function update()
{
  update_data()


  dftscatter.update()
  linegain.update()
  stemir.update()

}


stemir = axisir.stem("ir", "zero-padded signal", datair)
linegain = axisgain.line("gain", "DTFT", datagain)
dftscatter = axisgain.scatter("dft", "DFT", datadft)




d3.select('#zeropad').on("input", update_zero)
d3.select('#fftshift').on("input", update_shift)
d3.select('#length').on("input", update_length)
d3.select("#win").on("change", update_win)

update()
