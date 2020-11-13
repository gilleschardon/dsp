# -*- coding: utf-8 -*-


import numpy as np

from bokeh.layouts import column, row
from bokeh.models import CustomJS, Slider, PointDrawTool, ResetTool, Div
from bokeh.plotting import ColumnDataSource, figure, output_file, show
from bokeh.embed import components
from bokeh.io import save
from bokeh.util.browser import view

import scipy.signal.windows as ws

# filter name
title = "Handmade filter"
file_name="handmade_filter.html"
impulse_label = "Impulse response"
sinus_label = "Sinusoidal input"
gain_label = "Gain"
phase_label = "Phase"
real_label = "Real part"
imag_label="Imaginary part"
input_label="Input"
output_label="Output"
freq_label="Frequency"# ν"
# initial frequency
nu0 = 0.1;

# +/- xlim of the plot
L = 20;

# impulse response
h = np.zeros([20])
h[0] = 1


def filt(x, nu, h):
    output = np.zeros(x.shape)
    for k in range(h.shape[0]):
        output = output + np.cos(2*np.pi* (x-k) * nu0) * h[k]

    return output

def Hfilt(nu, h):
    output = np.zeros(nu.shape)
    for k in range(h.shape[0]):
        output = output + np.exp(- 2*np.pi * 1j * k * nu) * h[k]

    return output

def generate_layout():
    
        
    code = """
    
        console.log('callback')
        const data_signal = source_signal.data;
        const data_signal_disc = source_signal_disc.data;
        const data_point = source_Hpoint.data;
    
        const data_H = source_H.data
    
        const h = source_h.data['h']
         const xh = source_h.data['xh']
    
        const x = data_signal['x']
        const y = data_signal['y']
        const y1 = data_signal['y1']
    
        
        const xd = data_signal_disc['xd']
        const yd = data_signal_disc['yd']
        const y1d = data_signal_disc['y1d']
    
    
        const F = freq.value;
    
        const cosf = (t => Math.cos(F * Math.PI * 2 * t))
        
        source_h.data['xh'].forEach((v, k, a) => {a[k] = k})
        
        const nu = data_H['nu']
        for (var n = 0 ; n < nu.length ; n++)
        {
             const Hre = h.reduce((a, hh, idx) => a + hh * Math.cos(- 2 * Math.PI * idx * nu[n]), 0)
             const Him = h.reduce((a, hh, idx) => a + hh * Math.sin(- 2 * Math.PI * idx * nu[n]), 0) 
    
             data_H['Hr'][n] = Hre
             data_H['Hi'][n] = Him
             
             data_H['Habs'][n] = Math.sqrt(Hre**2 + Him**2)
             data_H['Hphase'][n] = Math.atan2(Him, Hre)
        }
        
        
        const Hre = h.reduce((a, hh, idx) => a + hh * Math.cos(- 2 * Math.PI * idx * F), 0)
        const Him = h.reduce((a, hh, idx) => a + hh * Math.sin(- 2 * Math.PI * idx * F), 0)
    
        data_point['Habs0'][0] = Math.sqrt(Hre**2 + Him**2)
        data_point['nu0'][0] = F
        data_point['Hphase0'][0] = Math.atan2(Him, Hre)
        data_point['Hreal0'][0] = Hre
        data_point['Himag0'][0] = Him
    
    
         data_signal['y'] = x.map(cosf)
         data_signal_disc['yd'] = xd.map(cosf)
    
        for (var i = 0; i < x.length; i++)
        {
             y1[i] = h.reduce((a, hh, idx) => a + cosf(x[i]-idx) * hh, 0)
        }
           
        for (var i = 0; i < xd.length; i++)
        {
            y1d[i] = h.reduce((a, hh, idx) => a + cosf(xd[i]-idx) * hh, 0)
        }
    
         
        
        
        source_H.change.emit();
        source_signal.change.emit();
        source_h.change.emit();
        source_Hpoint.change.emit();
        source_signal_disc.change.emit();
    """
    
    
    
    
    
    Nnu = 1000;
    nu = np.linspace(-0.5, 0.5, Nnu)
    
    x = np.linspace(-L, L, 500)
    y = np.cos(2*np.pi*x * nu0)
    y1 = filt(x, nu0, h)
    
    
    H = Hfilt(nu, h)
    
    
    xd = np.arange(-L,L+1)
    yd = np.cos(2*np.pi*xd * nu0)
    y1d = filt(xd, nu0, h)
    
    
    Ylim = 3*np.max([1, np.max(np.abs(H))]) + 0.1
    
    
    
    source_h = ColumnDataSource(data=dict(xh=np.arange(h.shape[0]), h=h))
    
    source_signal = ColumnDataSource(data=dict(x=x, y=y, y1=y1))
    
    source_signal_disc = ColumnDataSource(data=dict(xd=xd,yd=yd,y1d=y1d))
    
    plot_h = figure(x_range=(-1, L-1), y_range=(-np.max(np.abs(h))*1.1,np.max(np.abs(h))*1.1) , plot_width=800, plot_height=300, title=impulse_label)
    circ = plot_h.circle('xh', 'h', source=source_h, line_width=0, line_alpha=1, size=10, legend_label=impulse_label, nonselection_fill_alpha=1)
    plot_h.segment('xh', 0, 'xh', 'h', source=source_h, line_width=1, line_alpha=1, nonselection_line_alpha=1)
    plot_h.xaxis.fixed_location = 0;
    
    
    
    
    plot_signal = figure(x_range=(-L+1, L-1), y_range=(-Ylim, Ylim), plot_width=800, plot_height=300, title=sinus_label, toolbar_location=None)
    plot_signal.xaxis.fixed_location = 0;
    plot_signal.line('x', 'y', source=source_signal, line_width=3, line_alpha=0.2)
    plot_signal.circle('xd', 'yd', source=source_signal_disc, line_width=0, line_alpha=1, size=10, legend_label=input_label)
    
    plot_signal.line('x', 'y1', source=source_signal, line_width=3, line_alpha=0.2, color="red")
    plot_signal.circle('xd', 'y1d', source=source_signal_disc, line_width=0, line_alpha=1, size=10, color="red", legend_label=output_label)
    
    
    source_H = ColumnDataSource(data=dict(nu=nu, Habs=np.abs(H), Hphase=np.angle(H), Hr=np.real(H), Hi=np.imag(H)))
    
    source_Hpoint = ColumnDataSource(data=dict(nu0=[nu0],
                                               Habs0=np.abs(Hfilt(np.array([nu0]),h)),
                                               Hphase0=np.angle(Hfilt(np.array([nu0]),h)),
                                               Hreal0 = np.real(Hfilt(np.array([nu0]),h)),
                                               Himag0 = np.imag(Hfilt(np.array([nu0]),h))))
    
    
    plot_Habs = figure(y_range=(-0.3, 4), title=gain_label, plot_width=400, plot_height=400, toolbar_location=None)
    plot_Habs.line('nu', 'Habs', source=source_H, line_width=3, line_alpha=0.8)
    plot_Habs.xaxis.fixed_location = 0;
    
    plot_Habs.circle('nu0', 'Habs0',source=source_Hpoint, size=10)
    
    plot_Hphase = figure(y_range=(-np.pi-0.1, np.pi+0.1), title=phase_label,plot_width=400, plot_height=400, toolbar_location=None)
    plot_Hphase.xaxis.fixed_location = 0;
    
    
    plot_Hphase.line('nu', 'Hphase', source=source_H, line_width=3, line_alpha=0.8)
    
    plot_Hphase.circle('nu0', 'Hphase0',source=source_Hpoint, size=10)
    
    plot_Habs.xaxis.axis_label = freq_label
    plot_Hphase.xaxis.axis_label = freq_label
    
    source_Hcart = ColumnDataSource(data=dict(nu=nu, Habs=np.real(H), Hphase=np.imag(H)))
    plot_Hre = figure(y_range=(-4, 4), plot_width=400, plot_height=400, toolbar_location=None, title=real_label)
    plot_Hre.xaxis.fixed_location = 0;
    plot_Hre.line('nu', 'Hr', source=source_H, line_width=3, line_alpha=0.8)
    
    plot_Him = figure(y_range=(-4, 4),plot_width=400, plot_height=400, toolbar_location=None, title=imag_label)
    
    plot_Him.xaxis.fixed_location = 0;
    
    plot_Him.line('nu', 'Hi', source=source_H, line_width=3, line_alpha=0.8)
    
    plot_Hre.xaxis.axis_label = freq_label
    plot_Him.xaxis.axis_label = freq_label
    
    plot_Hre.circle('nu0', 'Hreal0',source=source_Hpoint, size=10)
    plot_Him.circle('nu0', 'Himag0',source=source_Hpoint, size=10)
    
    
    freq_slider = Slider(start=0, end=0.5, value=nu0, step=.001, title=freq_label)
    
    
    callback = CustomJS(args=dict(source_H=source_H, source_h=source_h, source_Hpoint=source_Hpoint,source_signal=source_signal, source_signal_disc=source_signal_disc, freq=freq_slider),
                        code=code)
    
    freq_slider.js_on_change('value', callback)
    
    draw_tool = PointDrawTool(renderers=[circ], empty_value='black')
    draw_tool.add = False
    
    
    callback2 = CustomJS(args=dict(source_H=source_H, source_h=source_h, source_Hpoint=source_Hpoint,source_signal=source_signal, source_signal_disc=source_signal_disc, freq=freq_slider), code="""
                         console.log("c2")
                    const hh = source_h.data['h']
                    hh.fill(0)
                    hh[0] = 1;
                    
    """ + code
    )
    
    plot_h.js_on_event('pan', callback)
    
    
    
    plot_h.add_tools(draw_tool)
    
    plot_h.js_on_event('reset', callback2)
    
    plot_h.toolbar.active_tap = draw_tool
    
    email = Div(text="<p>gilles.chardon@centralesupelec.fr</p>", style={"color": "grey"})
    
    layout = row(column(plot_h,
          freq_slider,
        plot_signal, email),
    column(
    row(plot_Habs, plot_Hphase), row(plot_Hre, plot_Him))
    )
    
    return layout


def generate_components():
    return components(generate_layout())

    
def show_layout():    
    show(generate_layout())