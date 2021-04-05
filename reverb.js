
var filterbuffer
var filternode

Tmax = 4;
L = 11;

var margins = {
  left: 50,
  right: 200,
  bottom: 10,
  top: 10
};




var t = [...Array(L).keys()].map(t => (t/L * Tmax ))
var ir = Array(L).fill(0)
ir[0] = 1
var rir = Array(t.length).fill(10)

const names = {
  dirac: "Dirac",
  delay: "Delay",
  delays: "Delays",
  room: "Room",
}

const IRdelays = {
  dirac: t,
  delay: t,
  delays: t,
  room: [0, 0.01, 0.03, 0.04, 0.09, 0.13, 0.14, 0.19, 0.25, 0.29, 0.31],
}
const IRgains = {
  dirac: ir,
  delay: [1,0,0,0,0,0,0.5,0,0,0, 0],
  delays: t.map(u => Math.exp(-u*2)),
  room: [1, 0.3, 0.2, 0.25, 0.15, 0.2, 0.15, 0.13, 0.12, 0.1, 0.11],
}


datair = {x: t, y:ir, r: rir}

xrange = [-0.5,Tmax + 0.5];
yrange = [-1.1, 1.1]

ntickx = 20
nticky = 5

axisir = new Axis("#plotir", "ir", 1000, 200, margins, xrange, yrange, ntickx, nticky)

function update_ir()
{

  datair.y = ir
  datair.x = t



stemir.update()


  // buf = filterbuffer.getChannelData(0)
  // console.log(buf)
  // buf.set(irplot)
  // filterNode.buffer = filterbuffer;

}


function select_ir()
{



  ir = [...IRgains[this.value]]
  t = [...IRdelays[this.value]]

  for (var i = 0 ; i < L ; i++)
  {
    delaylines[i].delayTime.value = t[i]
    gains[i].gain.value = ir[i]
  }

  update_ir()
}


function drag_ir(i, x, y)
{
  ir[i] = y;
  t[i] = x;

  delaylines[i].delayTime.value = x
  gains[i].gain.value = y
console.log(delaylines[i].delayTime.value)
  update_ir()
}

stemir = axisir.stem("ir", "IR", datair, drag_ir)










irchoice = document.getElementById('filter')


var AudioCtx = window.AudioContext || window.webkitAudioContext;

var audioCtx = new AudioCtx({sampleRate : 8000})

var myAudio = document.querySelector('audio');

var source = audioCtx.createMediaElementSource(myAudio);

var delaylines = []
var gains = []

for (var i = 0 ; i < L ; i++)
{
  delaylines[i] = audioCtx.createDelay(5)
  gains[i] = audioCtx.createGain()

  delaylines[i].delayTime.value = t[i]
  gains[i].gain.value = (i==0) ? 1 : 0

  source.connect(gains[i])
  gains[i].connect(delaylines[i])
  delaylines[i].connect(audioCtx.destination)

}

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
