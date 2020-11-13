# -*- coding: utf-8 -*-


import numpy as np

from bokeh.layouts import column, row
from bokeh.models import CustomJS, Slider, CheckboxGroup, Select, Div, Paragraph
from bokeh.plotting import ColumnDataSource, figure, output_file, show
from bokeh.embed import components



import scipy.fft as fft
import scipy.signal.windows as ws
    
def FFT_demo(signal, mode='filter', Nmin=10, Nmax=100, log=False, nu0 = 0, A = 0, estimation=False):

    if mode=='filter':
    
        plot_cont_t = False
        plot_cont_f = True
        
        window_visible = False
        slider_title = "Zero-padded length N"
    if mode=='zeropad':
    
        plot_cont_t = True
        plot_cont_f = True
        
        window_visible = True
        slider_title = "Zero-padded length N"
    
    if mode=='resolution':
    
        plot_cont_t = True
        plot_cont_f = False
        
        window_visible = True
        slider_title = "Observation length N" 
    estimation_visible = estimation
    
    # discrétisation du signal continu (si nécessaire)
    Ldiscret = 1000
    
    # longueur min et max de l'observation/zero-padding

    
    # signal
    idx = np.arange(Nmax)
    h = signal(idx)
    
    # signal continu
    
    if mode == 'zeropad' or mode == 'filter':
        Lcont = Nmin
    else:
        Lcont = Nmax
        
    tt = np.linspace(0, Lcont, Ldiscret)
    
    hh = signal(tt)
    
    
    zeropad0 = 1000;
    if mode == 'zeropad'or mode == 'filter':
        zeropad0 = Nmin
    
    
    #%% Plots temporels
    
    idx0 = np.arange(Nmin)
    h0 = h[:Nmin]
    
    source_h_pad = ColumnDataSource(data=dict(idx=idx0, h = h0))
    
    source_h = ColumnDataSource(data=dict(idx=idx, h = h))
    
    if mode == "resolution":
        titlex = "x"
        titleH = "Absolute value squared of the DTFT"
    else:
        titlex = "Zero-padded x"
        titleH = "Absolute value squared of the DFT"

    plot_h = figure(x_range=(-0.1, Nmax-1+0.1), plot_width=800, plot_height=200, title=titlex, toolbar_location=None)
    plot_h.xaxis.fixed_location = 0;

    if mode=='filter':
        plot_h.circle('idx', 'h', source=source_h_pad, line_width=3, line_alpha=1, size=5)
        plot_h.segment('idx',0,'idx', 'h', source=source_h_pad, line_width=1, line_alpha=1)

    else:
        plot_h.circle('idx', 'h', source=source_h_pad, line_width=3, line_alpha=1, size=2)

    plot_h_cont = plot_h.line(tt, np.real(hh), line_width=1, line_alpha=0.5)
    plot_h_cont.visible = plot_cont_t
    
    
    #%% plots fréquence
    if log:
        plot_H = figure(title=titleH, x_range=(-0.55, 1.05), y_range=(1e-7, 1e1), plot_width=800, plot_height=400, toolbar_location=None, y_axis_type="log")
    else:
        plot_H = figure(title=titleH, x_range=(-0.55, 1.05), plot_width=800, plot_height=400, toolbar_location=None)
        plot_H.xaxis.fixed_location = 0;

    plot_H.xaxis.axis_label = 'Frequency ν'
    
    # DTFT fenêtrée 
    Nfft = 1000; # pair
    
    wh = ws.hann(Nmin) + 1e-10
    whg = ws.hamming(Nmin) + 1e-10
    
    if mode=="filter":
        w = 1
    else:
        w = Nmin
    
    source_H_cont = ColumnDataSource(data=dict(nu_cont =                np.arange(Nfft)/Nfft,
                                               H_cont_Rect =            np.abs(fft.fft(h[0:Nmin], Nfft))**2 / w**2 ,              
                                               H_cont_Hann =            np.abs(fft.fft(h[0:Nmin] * wh, Nfft) )**2 / np.sum(wh)**2,
                                               H_cont_Hamming =         np.abs(fft.fft(h[0:Nmin] * whg, Nfft) )**2 / np.sum(whg)**2,
                                               nu_cont_shift =          np.arange(Nfft)/Nfft - 1/2,
                                               H_cont_shift_Rect =      fft.fftshift(np.abs(fft.fft(h[0:Nmin], Nfft))**2) / w**2 ,
                                               H_cont_shift_Hann =      fft.fftshift(np.abs(fft.fft(h[0:Nmin] * wh, Nfft))**2)/ np.sum(wh)**2,
                                               H_cont_shift_Hamming =   fft.fftshift(np.abs(fft.fft(h[0:Nmin] * whg, Nfft))**2/ np.sum(whg)**2)))
    
    
    if plot_cont_f:

        plot_H_cont = plot_H.line('nu_cont', 'H_cont_Rect', source=source_H_cont, line_width=3, line_alpha=0.5, legend_label = 'DTFT')
    else:
        plot_H_cont = plot_H.line('nu_cont', 'H_cont_Rect', source=source_H_cont, line_width=3, line_alpha=0.5)
    plot_H_cont.visible = plot_cont_f
    
    
    
    H_pad = np.abs(fft.fft(h[:Nmin], zeropad0))**2/ w**2 
    nu_pad = np.arange(zeropad0) / zeropad0
    
    source_H_pad = ColumnDataSource(data=dict(nu_pad=nu_pad, H_pad=H_pad))
    
    if plot_cont_f:
        plot_H.circle('nu_pad', 'H_pad', source=source_H_pad, line_width=3, line_alpha=1, color="red", size=5, legend_label='DFT')
    else:
        plot_H.line('nu_pad', 'H_pad', source=source_H_pad, line_width=3, line_alpha=1, color="red", legend_label='DTFT')
    
    
    idxmax = np.argmax(np.abs(H_pad))
    
    source_max = ColumnDataSource(data=dict(nu0=nu_pad[idxmax:idxmax+1], A0 = np.abs(H_pad[idxmax:idxmax+1]), phi0 = np.angle(H_pad[idxmax:idxmax+1]), text=[" max "], para=["test"]))
    
    plotmax = plot_H.circle(x='nu0', y='A0', source=source_max, color='blue', size=10)
    plotmax.visible = estimation_visible
    
    
    
    
    #%% sliders
    
    
    zero_slider = Slider(start=Nmin, end=Nmax, value=Nmin, step=1, title=slider_title)
    shift_box = CheckboxGroup(labels=['FFT shift'])

    window_select = Select(title='Window', value='Rect', options=['Rect', 'Hann', 'Hamming'])
    
    
    
       
    par = Div(text = ("<table><tr><th></th><th>Actual</th><th>Estimated</th></tr> <tr><td>Frequency</td><td>" + '{:.3f}'.format(nu0) + "</td><td>" +'{:.2f}'.format(nu_pad[idxmax]) + "</td></tr> <tr><td>Amplitude</td><td>" + '{:.2f}'.format(A) + "</td><td>" + '{:.2f}'.format(2*np.sqrt((np.abs(H_pad[idxmax]))))+"</td></tr></table>"))
    
    #%% callback
    
    callback = CustomJS(args=dict(Pad0=zeropad0, Lmin=Nmin, mode=mode, plot_H_cont = plot_H_cont, SH =source_H_cont, par=par, source_max=source_max, source_h_pad=source_h_pad,source_H_pad=source_H_pad, source_h=source_h, zero=zero_slider, shift=shift_box, window=window_select),
                        code="""
    
        const data_h = source_h.data;
        const data_H_pad = source_H_pad.data;
        const data_h_pad = source_h_pad.data;
    
    
        const Z = zero.value    
        const S = shift.active    
        const W = window.value    
       
        
        const h = data_h['h']
        const Lh =  0;
    
        
        var Ldata = 0
        var Lpad = 0
            
        if (mode=='zeropad' | mode=='filter')
        {
            Ldata = Lmin; 
            Lpad = Z
        }
        else
        {
             Ldata = Z;
             Lpad = Pad0
        }
        
        
        // fenêtres
        
        const timew = Float64Array.from({length: Ldata}, (v, k) => k)
    
        switch(W)
        {
                case "Rect":
                    window = timew.map( kk => 1)
                    break;
                case "Hann":
                    window = timew.map(kk => (-Math.cos( 2*Math.PI * kk / (Ldata-1)) + 1)/2)
                    break;
                case "Hamming":
                    window = timew.map(kk => (0.46*(-Math.cos( 2*Math.PI * kk / (Ldata-1))) + 0.54))
        }
    
        const sumw = (mode == 'filter') ? 1 : window.reduce((a, b) => a + b)
       
     
        // changement des graphes fréquentiels
        plot_H_cont.glyph.x.field =  (S.includes(0)) ? 'nu_cont_shift' : 'nu_cont'
        plot_H_cont.glyph.y.field =  ((S.includes(0)) ? 'H_cont_shift_' : 'H_cont_') + W   
                       
      
        data_h_pad['idx'] = Float64Array.from({length: Z}, (v, k) => k)
        data_h_pad['h'] = new Float64Array(Z)
        
        for (var l = 0 ; l < Z  ; l++)
        {
         data_h_pad['h'][l] = ((l < Ldata) ? data_h['h'][l] * window[l] : 0)
        }
                
    
        data_H_pad['nu_pad'] = new Float64Array(Lpad)
        data_H_pad['H_pad']  = new Float64Array(Lpad)
        
        var Hpos = new Float64Array(Lpad);
        
        for (var k = 0 ; k < Lpad ; k++)
        {
        
         var freq = k/Lpad - (S.includes(0) ? Math.floor(Lpad/2)/Lpad : 0)

         data_H_pad['nu_pad'][k] = freq
         
         // DFT
         const re = h.slice(0, Ldata).map((v, l) =>  Math.cos(- 2 * Math.PI * l * freq) * v * window[l]).reduce((a, b) => a + b)
         const im = h.slice(0, Ldata).map((v, l) =>  Math.sin(- 2 * Math.PI * l * freq) * v * window[l]).reduce((a, b) => a + b)

         data_H_pad['H_pad'][k] = ((re**2 + im**2) / sumw**2)
    
    
         Hpos[k] = (freq>0 & freq < 0.5) ? data_H_pad['H_pad'][k] : 0
        }
      
        // recherche du max
        var maxH = Math.max(...Hpos)
        
        var idxmax = Hpos.indexOf(maxH)
        
        source_max.data['nu0'][0] = data_H_pad['nu_pad'][idxmax]
        source_max.data['A0'][0] = data_H_pad['H_pad'][idxmax]
        
        var nu0 = data_H_pad['nu_pad'][idxmax]
        var A0 = 2 * Math.sqrt(data_H_pad['H_pad'][idxmax]);
              
        par.text = `<table><tr><th></th><th>Actual</th><th>Estimated</th></tr> <tr><td>Frequency</td><td>""" + '{:.3f}'.format(nu0) + """</td><td>${nu0.toFixed(3)}</td></tr> <tr><td>Amplitude</td><td>""" + '{:.2f}'.format(A) +""" </td><td>${A0.toFixed(3)}</td></tr></table>`
  
    
    
    
        source_h_pad.change.emit();
        source_H_pad.change.emit();
        source_max.change.emit();
        SH.change.emit()
    
    """)
                
    zero_slider.js_on_change('value', callback)
    shift_box.js_on_click(callback)

    window_select.js_on_change('value',callback)
    
    window_select.visible = window_visible
    
    par.visible = estimation_visible
    
    email = Div(text="<p>gilles.chardon@centralesupelec.fr</p>", style={"color": "grey"})
    
    layout = column(
                row(
                        column(zero_slider, shift_box),
                        par,
                        window_select),
                plot_h,
                plot_H, email)
    
    script, div = components(layout)
    
    #output_file("zero.html", title="Zero-padding")
    #show(layout)
    return script, div