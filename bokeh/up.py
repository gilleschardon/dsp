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

    #initial subsampling
    K = 1
    
    # +/- xlim of the time plot
    Lt = 20;
    
    # +/- xlim of the frequency plot
    Lf = 0.5;
    
    
    x = np.linspace(-Lt, Lt, 500)
    y = np.cos(2*np.pi*x * nu)
    
    xd = np.arange(-Lt,Lt+1)
    yd = np.cos(2*np.pi*xd * nu)
    
    xds = K * xd
    yds = np.cos(2*np.pi*xds * nu)



    Ylim =[-1.1, 1.1]
    
    source_signal = ColumnDataSource(data=dict(x=x, y=y, ys=y))
    
    source_signal_disc = ColumnDataSource(data=dict(xd=xd,yd=yd,xds=xds, yds=yds))
    
    plot_signal = figure(x_range=(-Lt,Lt), y_range=Ylim, plot_width=800, plot_height=300, title="Time", toolbar_location=None)
     
    plot_signal.line('x', 'y', source=source_signal, line_width=3, line_alpha=0.2, color="blue")
    plot_signal.circle('xd', 'yd', source=source_signal_disc, line_width=3, line_alpha=1, size=10, legend_label="Upsampled", color="blue")
    plot_signal.line('x', 'ys', source=source_signal, line_width=3, line_alpha=0.2, color="red")
    plot_signal.circle('xds', 'yds', source=source_signal_disc, line_width=3, line_alpha=1, size=10, color="red", legend_label="Original")
 

    
    LL = 10
    LLL = np.arange(-LL, LL+1)
    nup = nu + LLL
    num = -nu + LLL
    
    nup2 = K*nu + LLL
    num2 = -K*nu + LLL
    h = np.ones(nup.shape)/(2*K)
    
    
    source_nu = ColumnDataSource(data=dict(nup=nup, num=num, LLL=LLL, h=h))
    
    source_nu2 = ColumnDataSource(data=dict(nup=nup2, num=num2, LLL=LLL))

    
    
    plot_frequency = figure(x_range=(-Lf, Lf), y_range=(0, 1), plot_width=800, plot_height=200, title="Upsampled signal, Frequency", toolbar_location=None)
    
    plot_frequency.varea(x=[-1/2, 1/2],y1 = 0, y2 = 1, fill_alpha=0.1, color="blue")
    
    
    plot_frequency.triangle('nup', 'h', source=source_nu, line_width=1, line_alpha=1, color="blue", size=10)
    plot_frequency.segment('nup', 0, 'nup', 'h', source=source_nu, line_width=3, line_alpha=1, color="blue")
    
    plot_frequency.triangle('num', 'h', source=source_nu, line_width=1, line_alpha=1, color="blue", size=10)
    plot_frequency.segment('num', 0, 'num', 'h', source=source_nu, line_width=3, line_alpha=1, color="blue")
    
    
    
    plot_frequency.xaxis.axis_label = 'Fréquence ν'
  
    plot_frequency2 = figure(x_range=(-Lf*2, Lf*2), y_range=(0, 1), plot_width=800, plot_height=200, title="Original signal, Frequency", toolbar_location=None)
    
    plot_frequency2.varea(x=[-1/2, 1/2],y1 = 0, y2 = 1, fill_alpha=0.1, color="blue")
    
    
    plot_frequency2.triangle('nup', 1/2, source=source_nu2, line_width=1, line_alpha=1, color="red", size=10)
    plot_frequency2.segment('nup', 0, 'nup', 1/2, source=source_nu2, line_width=3, line_alpha=1, color="red")
    
    plot_frequency2.triangle('num', 1/2, source=source_nu2, line_width=1, line_alpha=1, color="red", size=10)
    plot_frequency2.segment('num', 0, 'num', 1/2, source=source_nu2, line_width=3, line_alpha=1, color="red")
    
    
    
    plot_frequency2.xaxis.axis_label = 'Fréquence ν'
  
      
    
    
    
    
    freq_slider = Slider(start=0, end=0.5, value=nu, step=.002, title="Frequency")
    sub_slider = Slider(start=1, end=5, value=K, step=1, title="Upsampling factor")
    

    
    callback = CustomJS(args=dict(pf2=plot_frequency2, LL=LL, source_signal=source_signal, source_signal_disc=source_signal_disc, source_nu = source_nu, source_nu2 = source_nu2, sub=sub_slider,freq=freq_slider),
                        code="""
    
        const data_signal = source_signal.data;
        const data_signal_disc = source_signal_disc.data;
        const data_nu = source_nu.data;
        const data_nu2 = source_nu2.data;
    
        const K = sub.value;

        const x = data_signal['x']  
        const xd = data_signal_disc['xd']
        
        data_signal_disc['xds'] = xd.map(v => K*v)
        
        const xds = data_signal_disc['xds']
        const F = freq.value;
        const Fs = freq.value / K

        
        const coscos = ((t, f) => Math.cos(f * Math.PI * 2 * t))

       
        
        data_signal_disc['yd'] = xd.map((v, i) => (xd[i] % K == 0) ? coscos(v, Fs) : 0)
        
        data_signal['ys'] = x.map(v => coscos(v, Fs))

        
        
        data_signal_disc['yds'] = xds.map(v => coscos(v, Fs))
        data_signal['y'] = x.map(v => 0)
        for (var n = 0 ; n < K ; n++)
        {
                var ff = Fs + n/K;
                var fff = ff - Math.round(ff)
                data_signal['y'] = data_signal['x'].map((v, i) => data_signal['y'][i] +  coscos(v, fff)/K)
        }

        const FF = Math.abs(K*F - Math.round(K*F)) / K
    
        const cosf2 = (t => Math.cos(FF * Math.PI * 2 * t))
    


        data_nu['nup'] = data_nu['LLL'].map(v => v/K + F/K)
        data_nu['num'] = data_nu['LLL'].map(v => v/K - F/K)
    
        data_nu2['nup'] = data_nu['LLL'].map(v => v + F)
        data_nu2['num'] = data_nu['LLL'].map(v => v - F)
        
        data_nu['h'] = data_nu['LLL'].map(v => 1/(2*K))
        data_nu['h'] = data_nu['LLL'].map(v => 1/(2*K))

        pf2.x_range.start= -K/2
        pf2.x_range.end = K/2        
        
        source_signal.change.emit();
        source_signal_disc.change.emit();
        source_nu.change.emit();
        source_nu2.change.emit();
    
    """)
    
    freq_slider.js_on_change('value', callback)
    sub_slider.js_on_change('value', callback)
    email = Div(text="<p>gilles.chardon@centralesupelec.fr</p>", style={"color": "grey"})
    
    layout = column(
          freq_slider, sub_slider,
        plot_signal, plot_frequency2, plot_frequency,
     email   
    )
    
    return layout


def generate_components():
    return components(generate_layout())

    
def show_layout():    
    show(generate_layout())