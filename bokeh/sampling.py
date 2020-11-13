# -*- coding: utf-8 -*-


import numpy as np

from bokeh.layouts import column, row
from bokeh.models import CustomJS, Slider, CheckboxGroup, Select
from bokeh.plotting import ColumnDataSource, figure, output_file, show
from bokeh.embed import components

import scipy.fft as fft

def generate_layout():
        
    
    Pwidth=600
    Pheight=200
    
    Tmax = 10;
    
    Nt = 1000
    
    t = np.linspace(-Tmax, Tmax, Nt)
    
    
    Fmax = 3;
    Fmax_data = 10;

    
    Nf = 1000
    
    f = np.linspace(-Fmax_data, Fmax_data, Nf)
    
    x = np.sinc(t)
    
    xx = np.zeros(f.shape)
    xx[np.abs(f) < 0.5] = 1;
    
    source_time = ColumnDataSource(data=dict(t=t, x=x))
    source_frequency = ColumnDataSource(data=dict(f=f, xx=xx))
    
    plot_time = figure(x_range=(-Tmax, Tmax), plot_width=Pwidth, plot_height=Pheight, title="x(t)", toolbar_location=None)
    
    plot_time.line('t', 'x', source=source_time, line_width=1, line_alpha=1, color="red")
 
    
    plot_time.xaxis.axis_label = 'Temps t'
    
    plot_frequency = figure(x_range=(-Fmax, Fmax), y_range=(-2,2), plot_width=Pwidth, plot_height=Pheight, title="x(t)", toolbar_location=None)
    
    plot_frequency.line('f', 'xx', source=source_frequency, line_width=1, line_alpha=1, color="red")
    
    
    plot_time.xaxis.axis_label = 'Fréquence f'
   
    
    T = 0.5;
    nT = 100

    
    
    Tdirac0 = np.arange(-nT, nT+1)
    td = Tdirac0 * T;
    xd = np.sinc(td)
    
    xxd = np.zeros(f.shape)

    for nn in range(-10, 10):
        xxd[np.abs(f - nn/T) < 0.5] = xxd[np.abs(f - nn/T) < 0.5] + 1;
 
    angle = np.zeros(xd.shape)
    angle[xd < 0] = np.pi;
    
    source_dirac_time = ColumnDataSource(data=dict(t=td, x=xd, angle=angle))
    source_dirac_frequency = ColumnDataSource(data=dict(f=f, xx=xxd))
   
    
    plot_dirac_time = figure(x_range=(-Tmax, Tmax), y_range=(-2, 2), plot_width=Pwidth, plot_height=Pheight, title="x(t)", toolbar_location=None)

    plot_dirac_time.triangle('t', 'x', angle='angle', source=source_dirac_time, line_width=1, line_alpha=1, color="red", size=10)
    plot_dirac_time.segment('t', 0, 't', 'x', source=source_dirac_time, line_width=3, line_alpha=1, color="red")

    plot_dirac_frequency = figure(x_range=(-Fmax, Fmax), y_range=(-2,5), plot_width=Pwidth, plot_height=Pheight, title="x(t)", toolbar_location=None)
    
    plot_dirac_frequency.line('f', 'xx', source=source_dirac_frequency, line_width=1, line_alpha=1, color="red")
 
    
    
    source_dis_time = ColumnDataSource(data=dict(t=Tdirac0, x=xd))
    source_dis_frequency = ColumnDataSource(data=dict(f=f, xx=xxd))
   
    
    plot_dis_time = figure(x_range=(-Tmax, Tmax), y_range=(-2, 2), plot_width=Pwidth, plot_height=Pheight, title="x(t)", toolbar_location=None)

    plot_dis_time.circle('t', 'x', source=source_dis_time, line_width=1, line_alpha=1, color="red", size=10)
    plot_dis_time.segment('t', 0, 't', 'x', source=source_dis_time, line_width=3, line_alpha=1, color="red")

    plot_dis_frequency = figure(x_range=(-0.5, 0.5), y_range=(-2,5), plot_width=Pwidth, plot_height=Pheight, title="x(t)", toolbar_location=None)
    
    plot_dis_frequency.line('f', 'xx', source=source_dis_frequency, line_width=1, line_alpha=1, color="red")

    
    
    
    
    
    Copies = np.arange(-10, 10)
    
    
    
    
    
    freq_slider = Slider(start=0.1, end=2, value=1, step=.01, title="Width")
    #center_slider = Slider(start=-4, end=4, value=0, step=.01, title="Center")
    
    callback = CustomJS(args=dict(pdt = plot_dis_time, source_dis_time=source_dis_time, source_dis_frequency=source_dis_frequency, source_dirac_time=source_dirac_time, source_dirac_frequency=source_dirac_frequency, Tdirac0=Tdirac0, Copies=Copies, freq=freq_slider),
                        code="""
    
        const data_dirac_time = source_dirac_time.data;
        const data_dirac_frequency = source_dirac_frequency.data;
 
        const data_dis_time = source_dis_time.data;
        const data_dis_frequency = source_dis_frequency.data;
 
    
        const P = freq.value
        
        const t = data_dirac_time['t']
        const x = data_dirac_time['x']
    
       
        const f = data_dirac_frequency['f']
        
        const sinc = t => t==0 ? 1 : Math.sin(Math.PI * t) / (Math.PI*t)
        
        const sincf = f => (Math.abs(f) < 0.5) ? 1 : 0
        
        const sinc2 = (t, ct, cf, w) => (Math.cos(2*Math.PI*(t-ct)*cf))*sinc((t-ct)*w/2)**2
        
        const sinc2fr = (t, ct, cf, w) => Math.cos(-2*Math.PI * ct*t) * (Math.max(0, 1 - Math.abs((t-cf)*2/w)) * 2/w + Math.max(0, 1 - Math.abs((t+cf)*2/w)) * 2/w)
        const sinc2fi = (t, ct, cf, w) => Math.sin(-2*Math.PI * ct*t) * (Math.max(0, 1 - Math.abs((t-cf)*2/w)) * 2/w + Math.max(0, 1 - Math.abs((t+cf)*2/w)) * 2/w)
        
                
        const ct = 1
        const cf = 1.2
        const w = 1.5
        
        const ftime = (t) => sinc2(t, ct, cf, w)
        
        const ffreqr = (t) => sinc2fr(t, ct, cf, w)
        const ffreqi = (t) => sinc2fi(t, ct, cf, w)

        data_dirac_time['t'] = Tdirac0.map(t => t * P)
        data_dirac_time['x'] = data_dirac_time['t'].map(ftime)
        
        var xxr = new Float64Array(f.length)
        var xxi = new Float64Array(f.length)

        xxr.fill(0)
        xxi.fill(0)

        for (var c = 0; c < Copies.length; c++)
        {
            xxr = xxr.map((x, i) => x + ffreqr(f[i] - Copies[c]/P))
            xxi = xxi.map((x, i) => x + ffreqi(f[i] - Copies[c]/P))    

        }
        data_dirac_frequency['xx'] = xxr.map((v, i) => Math.sqrt(v**2 + xxi[i]**2))

        data_dis_time['x'] = data_dirac_time['x']

        data_dis_frequency['xx'] = data_dirac_frequency['xx']
        data_dis_frequency['f'] = data_dirac_frequency['f'].map(v => v * P)

        pdt.x_range.start = -10/P
        pdt.x_range.end = 10/P
        
        source_dirac_time.change.emit();
        source_dirac_frequency.change.emit();
        source_dis_time.change.emit();
        source_dis_frequency.change.emit();


    
    """)
    #center_slider.js_on_change('value', callback)
    freq_slider.js_on_change('value', callback)
    
    
    
    layout = column(
        row(  freq_slider),#, center_slider),
        row(plot_time, plot_frequency),
        row(plot_dirac_time, plot_dirac_frequency),

        row(plot_dis_time, plot_dis_frequency)
    )
    
    return layout

def generate_components():
    return components(generate_layout())

    
def show_layout():    
    show(generate_layout())