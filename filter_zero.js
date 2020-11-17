

ir = [1,-1, 1, -1, 1]


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

var L = ir.length

document.getElementById("zeropad").setAttribute("min", L)
document.getElementById("zeropad").value=L


var Lmax = 50


R = 10
var r = Array(L).fill(R)


Nfreq = 1000

var nu = [...Array(Nfreq).keys()].map(t => (t/Nfreq*1.5-0.5))
var Hr = Array(Nfreq).fill(0)
var Hi = Array(Nfreq).fill(0)

var fftshift = false;
for (var i = 0; i < nu.length; i++)
  {
             Hr[i] = ir.reduce((a, hh, idx) => a + Math.cos( - 2 * Math.PI * nu[i] * idx) * hh, 0)
             Hi[i] = ir.reduce((a, hh, idx) => a + Math.sin( - 2 * Math.PI * nu[i] * idx) * hh, 0)
  }

Hgain = Hr.map((t, idx) => Math.sqrt(t**2 + Hi[idx]**2))

datair = {x: [...Array(L).keys()], y: ir, r: r}

datadft = {x: [...Array(L).keys()], y: ir, r: r}


datagain = {x: nu, y:Hgain}
xrange = [-0.5,Lmax + 0.5];
yrange = [-1.1, 1.1]

nurange = [-0.5,1]
Hrange = [-0.1,5.1]

ntickx = 20
nticky = 5

axisir = new Axis("#plotir", "ir", 1000, 200, margins, xrange, yrange, ntickx, nticky)

axisgain = new Axis("#plotgain", "gain", 1000, 200, margins2, nurange, Hrange, ntickx, nticky)

Lzero = L

function update_data()
{
  shift = fftshift ? Math.floor(Lzero/2) : 0

  datair.x = [...Array(+Lzero).keys()]
  datair.r = Array(+Lzero).fill(R)
  datair.y = Array(+Lzero).fill(0)
  datair.y.splice(0, L, ...ir)

  datadft.x = [...Array(+Lzero).keys()].map((t) => ((t - shift)/Lzero))
  datadft.r = Array(+Lzero).fill(R)
  datadft.y = Array(+Lzero).fill(0)

  for (var i = 0; i < Lzero; i++)
    {

      RR = ir.reduce((a, hh, idx) => a + Math.cos( - 2 * Math.PI * (i-shift) * (idx/ Lzero)) * hh, 0)
      II = ir.reduce((a, hh, idx) => a + Math.sin( - 2 * Math.PI * (i-shift) * (idx/ Lzero)) * hh, 0)

      datadft.y[i] = Math.sqrt(RR**2 + II**2)

    }



}

function update_zero()
{

  Lzero = this.value
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


  stemir.update()
  dftscatter.update()

}


stemir = axisir.stem("ir", "IR", datair)
linegain = axisgain.line("gain", "Gain", datagain)
dftscatter = axisgain.scatter("dft", "DFT", datadft)




d3.select('#zeropad').on("input", update_zero)
d3.select('#fftshift').on("input", update_shift)

update()
