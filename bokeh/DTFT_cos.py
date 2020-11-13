# -*- coding: utf-8 -*-


import numpy as np

from bokeh.layouts import column, row
from bokeh.models import CustomJS, Slider, Div
from bokeh.plotting import ColumnDataSource, figure, output_file, show
from bokeh.embed import components
from bokeh.io import save

import scipy.signal.windows as ws

def generate_layout():

    # initial frequency
    nu = 0.1;
    
    # +/- xlim of the time plot
    Lt = 20;
    
    # +/- xlim of the frequency plot
    Lf = 2.1;
    
    
    x = np.linspace(-Lt, Lt, 500)
    y = np.cos(2*np.pi*x * nu)
    
    xd = np.arange(-Lt,Lt+1)
    yd = np.cos(2*np.pi*xd * nu)
    
    
    Ylim =[-1.1, 1.1]
    
    source_signal = ColumnDataSource(data=dict(x=x, y=y))
    
    source_signal_disc = ColumnDataSource(data=dict(xd=xd,yd=yd))
    
    plot_signal = figure(x_range=(-Lt,Lt), y_range=Ylim, plot_width=800, plot_height=300, title="Time", toolbar_location=None)
    
    plot_signal.line('x', 'y', source=source_signal, line_width=3, line_alpha=0.2)
    plot_signal.circle('xd', 'yd', source=source_signal_disc, line_width=3, line_alpha=1, size=10, legend_label="Entrée")
    
    LL = 10
    LLL = np.arange(-LL, LL+1)
    nup = nu + LLL
    num = -nu + LLL
    
    
    source_nu = ColumnDataSource(data=dict(nup=nup, num=num, LLL=LLL))
    
    
    
    plot_frequency = figure(x_range=(-Lf, Lf), y_range=(0, 1), plot_width=800, plot_height=300, title="Frequency", toolbar_location=None)
    
    plot_frequency.varea(x=[-1/2, 1/2],y1 = 0, y2 = 1, fill_alpha=0.1, color="blue")
    
    
    plot_frequency.triangle('nup', 1/2, source=source_nu, line_width=1, line_alpha=1, color="red", size=10)
    plot_frequency.segment('nup', 0, 'nup', 1/2, source=source_nu, line_width=3, line_alpha=1, color="red")
    
    plot_frequency.triangle('num', 1/2, source=source_nu, line_width=1, line_alpha=1, color="red", size=10)
    plot_frequency.segment('num', 0, 'num', 1/2, source=source_nu, line_width=3, line_alpha=1, color="red")
    
    
    
    plot_frequency.xaxis.axis_label = 'Fréquence ν'
    
    
    freq_slider = Slider(start=0, end=2, value=nu, step=.002, title="fréquence")
    
    
    callback = CustomJS(args=dict(LL=LL, source_signal=source_signal, source_signal_disc=source_signal_disc, source_nu = source_nu, freq=freq_slider),
                        code="""
    
        const data_signal = source_signal.data;
        const data_signal_disc = source_signal_disc.data;
        const data_nu = source_nu.data;
    
        const x = data_signal['x']  
        const xd = data_signal_disc['xd']
    
        const F = freq.value;
        
        const cosf = (t => Math.cos(F * Math.PI * 2 * t))
    
       
        data_signal['y'] = x.map(cosf)
        data_signal_disc['yd'] = xd.map(cosf)
    
        data_nu['nup'] = data_nu['LLL'].map(v => v + F)
        data_nu['num'] = data_nu['LLL'].map(v => v - F)
    
        
                
        source_signal.change.emit();
        source_signal_disc.change.emit();
        source_nu.change.emit();
    
    """)
    
    freq_slider.js_on_change('value', callback)
    email = Div(text="<p>gilles.chardon@centralesupelec.fr</p>", style={"color": "grey"})
    
    layout = column(
          freq_slider,
        plot_signal, plot_frequency,
     email   
    )
    
    return layout


def generate_components():
    return components(generate_layout())

    
def show_layout():    
    show(generate_layout())