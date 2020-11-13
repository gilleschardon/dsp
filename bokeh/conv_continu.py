# -*- coding: utf-8 -*-


import numpy as np
from bokeh import events
from bokeh.layouts import column, row
from bokeh.models import CustomJS, Slider, PointDrawTool, ResetTool, Div, CheckboxGroup, Select, RadioButtonGroup
from bokeh.plotting import ColumnDataSource, figure, output_file, show
from bokeh.embed import components
from bokeh.io import save
from bokeh.util.browser import view

import scipy.signal.windows as ws

def generate_layout():

    
    Tmax_graph = 5;
    
    Tmax = 10;
    
    l = 1000
    L = 2*l+1;
    step = Tmax/l
    
    t = np.linspace(-Tmax, Tmax, L)
    
    square = (np.abs(t) < 0.5)
    rect = np.zeros(t.shape)
    rect[square] = 1
    
    square = np.exp(-t)
    square[t<0]= 0
    
    expm = square
    expp = expm[::-1]
    
    x0 = rect
    y0 = rect[::-1]
    
    conv = np.zeros(t.shape)
    conv[:] = np.nan
    conv[t==0] = np.sum(x0*y0);
    
    prod = x0 * y0[::-1]
    
    prodplus = prod * (prod > 0)
    prodminus = prod * (prod < 0)
    
    Hann = np.cos(t*2*np.pi)/2 + 1/2;
    Hann[np.abs(t)>1/2] = 0
    
    sin = np.cos(1.5*np.pi*t)
    
    rect_causal = np.zeros(t.shape)
    rect_causal[t>=0] = 1
    rect_causal[t>1] = 0
    
    pulse = np.zeros(t.shape)
    pulse[t==0] = 1/step
    
    echelon = np.zeros(t.shape)
    echelon[t>=0] = 1
    
    signals = [('rect', 'Rect'),
               ('expm', 'exp(-t)'),
               ('hann', 'Hann'),
               ('sin', 'Sinus'),
               ('rect_causal', 'Rect causal'),
               ('pulse', 'Pulse'),
               ('echelon', 'Echelon')]
    
    source_xy = ColumnDataSource(data=dict(t=t, rect=rect, expm=expm, hann=Hann, sin=sin, rect_causal=rect_causal, pulse=pulse, echelon=echelon))
    
    code = """
    
        const data_xy = source_xy.data;
    
        const data_int = source_int.data;
        const data_conv = source_conv.data;
    
        const IDX0 = l
        
        const T = x_slider.value
        const shift = Math.round(T / step)
    
        const X = x_select.value
        const Y = y_select.value
    
        var xfun
        var yfun
        
        xfun = x_select.value
        yfun = y_select.value
            
        const x = data_xy[xfun]
        const y = data_xy[yfun]
        
        
        plot_x.glyph.y.field = xfun
        plot_y.glyph.y.field = yfun
    
        
        const S = mode_box.active
        
        const prod = new Float64Array(data_int['prodplus'].length)
        prod.fill(0)
    
    
        if(S==0)
        {
    
        data_int['x'] = x
        data_int['y'] = new Float64Array(x.length)
        data_int['y'].fill(0)
        
       
        for (var k = 0; k < y.length ; k++)
        {
           if (((y.length - 1) + shift - k > -1) &  ((y.length - 1) + shift - k < y.length))
           {
           data_int['y'][k] = y[(y.length - 1) + shift - k]
           prod[k] = data_int['y'][k] * x[k]
         }
        }
        }
           else
           {
        data_int['y'] = y
        data_int['x'] = new Float64Array(x.length)
        data_int['x'].fill(0)
        
        for (var k = 0; k < y.length ; k++)
        {
           if (((x.length - 1) + shift - k > -1) &  ((x.length - 1) + shift - k < x.length))
           {
           data_int['x'][k] = x[(x.length - 1) + shift - k]
           prod[k] = data_int['x'][k] * y[k]
         }
        }
           
           }
           
        data_int['prodplus'] = prod.map(v => (v> 0 ? v : 0))
        data_int['prodminus'] = prod.map(v => (v> 0 ? 0 : v))
    
           
        
        const result = prod.reduce((a, b) => a + b, 0) * step
        
        source_conv_c.data['conv'][0] = result
        source_conv_c.data['t'][0] = T
    
        
        data_conv['conv'][IDX0 + shift] = result
    
        source_int.change.emit()
        source_conv.change.emit()
        source_xy.change.emit()
        source_conv_c.change.emit()
    
    """
    
    
    # cas particulier, symétrique
    source_int = ColumnDataSource(data=dict(tx=t, ty=t, x=x0, y=y0[::-1], prodplus=prodplus, prodminus=prodminus))
    
    source_conv = ColumnDataSource(data=dict(t=t, conv=conv, conv0=conv))
    t0 = [0]
    conv0 = [1]
    source_conv_c = ColumnDataSource(data=dict(t=t0, conv=conv0))
    
    YLIMS = (-1.1, 1.1)
    
    plot_x = figure(x_range=(-Tmax_graph, Tmax_graph), y_range=YLIMS , plot_width=800, plot_height=200)
    px = plot_x.line('t', 'rect', source=source_xy, line_width=2, line_alpha=1, nonselection_line_alpha=1, color="lightcoral")
    plot_x.xaxis.fixed_location = 0;
    
    plot_y = figure(x_range=(-Tmax_graph, Tmax_graph), y_range=YLIMS , plot_width=800, plot_height=200)
    py = plot_y.line('t', 'rect', source=source_xy, line_width=2, line_alpha=1, nonselection_line_alpha=1, color="green")
    plot_y.xaxis.fixed_location = 0;
    
    plot_int = figure(x_range=(-Tmax_graph, Tmax_graph), y_range=YLIMS , plot_width=800, plot_height=200)
    plot_int.line('tx', 'x', source=source_int, line_width=2, line_alpha=1, nonselection_line_alpha=1, color="lightcoral")
    plot_int.line('ty', 'y', source=source_int, line_width=2, line_alpha=1, nonselection_line_alpha=1, color="green")
    plot_int.varea('tx', 'prodplus', source=source_int, color="blue", fill_alpha=0.5)
    plot_int.varea('tx', 'prodminus', source=source_int, color="red", fill_alpha=0.5)
    
    plot_int.xaxis.fixed_location = 0;
    
    
    
    plot_conv = figure(x_range=(-Tmax_graph, Tmax_graph), y_range=YLIMS , plot_width=800, plot_height=200)
    #plot_conv.line('t', 'conv', source=source_conv, line_width=1, line_alpha=1, color="black")
    plot_conv.circle('t', 'conv', source=source_conv, line_width=1, line_alpha=1, color="black")
    plot_conv.circle('t', 'conv', source=source_conv_c, size=10, color="red")
    plot_conv.xaxis.fixed_location = 0;
    
    x_select = Select(title='Signal x(t)', value='rect', options=signals)
    y_select = Select(title='Signal y(t)', value='rect', options=signals)
    
    
    
    mode_box = RadioButtonGroup(labels = ['x(u) y(t-u)', 'y(u) x(t-u)'], active=0)
    
    x_slider = Slider(start=-Tmax_graph, end=Tmax_graph, value=0, step=.02, title="t")
    
    
    callback = CustomJS(args=dict(source_xy=source_xy, source_int=source_int, source_conv=source_conv, mode_box=mode_box, x_slider=x_slider, l=l, step=step, x_select=x_select, y_select=y_select, plot_x=px, plot_y=py, source_conv_c=source_conv_c), code=code)
    
    #callback2 = CustomJS(args=dict(source_xy=source_xy, source_int=source_int, source_conv=source_conv, mode_box=mode_box, x_slider=x_slider, l=l, step=step, x_select=x_select, y_select=y_select, plot_x=px, plot_y=py), code="""
    callback2 = CustomJS(args=dict(source_xy=source_xy, source_int=source_int, source_conv=source_conv, mode_box=mode_box, x_slider=x_slider, l=l, step=step, x_select=x_select, y_select=y_select, plot_x=px, plot_y=py, source_conv_c=source_conv_c), code="""
    
        source_conv.data['conv'] = new Float64Array(source_conv.data['conv0'])
        x_slider.value = 0 
        
                         
    """ + code)
    
    
    x_select.js_on_change('value', callback2)
    y_select.js_on_change('value', callback2)
    
    x_slider.js_on_change('value', callback)
    mode_box.js_on_click(callback)
    email = Div(text="<p>gilles.chardon@centralesupelec.fr</p>", style={"color": "grey"})
    
    
    layout = row(column(x_select, plot_x, y_select, plot_y, email) , column( x_slider, mode_box, plot_int, plot_conv))
    
    return layout

def generate_components():
    return components(generate_layout())

    
def show_layout():    
    show(generate_layout())