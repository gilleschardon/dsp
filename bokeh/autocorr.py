# -*- coding: utf-8 -*-


import numpy as np
from bokeh.layouts import column, row
from bokeh.models import CustomJS, Slider, Select, Div
from bokeh.plotting import ColumnDataSource, figure, show
from bokeh.embed import components


import pydub


#%%

def read(f, normalized=False):
    """MP3 to numpy array"""
    a = pydub.AudioSegment.from_mp3(f)
    y = np.array(a.get_array_of_samples())
    if a.channels == 2:
        y = y.reshape((-1, 2))
    if normalized:
        return a.frame_rate, np.float32(y) / 2**15
    else:
        return a.frame_rate, y

def generate_layout():
    fs, cello = read('cello.mp3', normalized=True)
    fs, saxophone = read('saxophone.mp3', normalized=True)
    fs, clarinet = read('clarinet.mp3', normalized=True)
    
    N = 800
    ss = 4
    
    c_start = 15000
    cello = cello[c_start:c_start+N:ss]
    cello = cello / np.amax(np.abs(cello))
    
    s_start = 3500
    saxophone = saxophone[s_start:s_start+N:ss]
    saxophone = saxophone / np.amax(np.abs(saxophone))
    
    c_start = 12000
    clarinet = clarinet[c_start:c_start+N:ss]
    clarinet = clarinet / np.amax(np.abs(clarinet))
    
    #%%
    N = N//ss
    L = N/(fs/ss)
   
    
    step = L/N
    
    idx = np.arange(N)
    idx_conv = np.arange(2*N-1)
    idx_prod = np.arange(3*N-2)
    
    T0 = 0#L/2;#step * N/2
    
    t = idx * step - T0
    t_conv = idx_conv * step - (L-step)
    t_prod = idx_prod * step - T0 - (N-1)*step
    
    
    default = cello
    
    
    
    x0 = np.zeros(t_prod.shape[0])
    y0 = np.zeros(t_prod.shape[0])
    
    x0[N-1:2*N-1] = default
    y0[N-1:2*N-1] = default
    
    XLIMS = [t_prod[0], t_prod[-1]]
    YLIMS = (-1.1, 1.1)
    nn = (np.sum(default**2)*step)
    YLIM_conv = (-1.2*nn, 1.2*nn)
    
    plot_width=1200
    plot_height=300
    
    #%%
    
    
    prod = x0 * y0
    prodplus = prod * (prod > 0)
    prodminus = prod * (prod < 0)
    
    conv = np.zeros(t_conv.shape)
    conv[:] = np.nan
    conv[N] = np.sum(x0*y0)*step;
    
    title = "F0 estimation with autocorrelation"
   
    
    signals = [('cello', 'cello'),
               ('saxophone', 'saxophone'),
               ('clarinet', 'clarinet')]
    
    source_xy = ColumnDataSource(data=dict(t=t, cello=cello, saxophone=saxophone, clarinet=clarinet))
    
    code = """
    
        const data_xy = source_xy.data;
    
        const data_int = source_int.data;
        const data_conv = source_conv.data;
    
        
        const T = x_slider.value
        const shift = Math.round((T-T0) / step)
    
    
        var xfun = x_select.value
        var yfun = x_select.value
            
        console.log(xfun)
        
        const x = data_xy[xfun]
        const y = data_xy[yfun]
        
        
        plot_x.glyph.y.field = xfun
            
            data_int['y'] = new Float64Array(3 * N - 2)
            data_int['y'].fill(0)
            data_int['x'] = new Float64Array(3 * N - 2)
            data_int['x'].fill(0)   
       
        
        
            for (var k = 0; k < N ; k++)
            {
                    data_int['x'][N-1+k] = x[k]
                    data_int['y'][k+shift] = y[k]                        
                }
         
    
         
        const prod = data_int['x'].map((v, i) => v * data_int['y'][i])    
                   
        data_int['prodplus'] = prod.map(v => (v> 0 ? v : 0))
        data_int['prodminus'] = prod.map(v => (v> 0 ? 0 : v))
    
           
        
        const result = prod.reduce((a, b) => a + b, 0) * step
        
        source_conv_c.data['c0'][0] = result
        source_conv_c.data['t0'][0] = data_conv['t_conv'][shift]
    
        
        data_conv['conv'][shift] = result
    
        source_int.change.emit()
        source_conv.change.emit()
        source_xy.change.emit()
        source_conv_c.change.emit()
    
    """
    
    
    
    
    # cas particulier, symétrique
    source_int = ColumnDataSource(data=dict(t_prod=t_prod, x=x0, y=y0, prodplus=prodplus, prodminus=prodminus))
    
    source_conv = ColumnDataSource(data=dict(t_conv=t_conv, conv=conv, conv0=conv))
    t0 = [0]
    conv0 = [np.sum(x0*y0)*step]
    source_conv_c = ColumnDataSource(data=dict(t0=t0, c0=conv0))
    
    YLIMS = (-1.1, 1.1)
    
    plot_x = figure(x_range=XLIMS, y_range=YLIMS , plot_width=plot_width, plot_height=plot_height)
    px = plot_x.line('t', 'cello', source=source_xy, line_width=2, line_alpha=1, nonselection_line_alpha=1, color="indigo")
    plot_x.xaxis.fixed_location = 0;
    
    plot_int = figure(x_range=XLIMS, y_range=YLIMS , plot_width=plot_width, plot_height=plot_height)
    plot_int.line('t_prod', 'x', source=source_int, line_width=2, line_alpha=1, nonselection_line_alpha=1, color="gold")
    plot_int.line('t_prod', 'y', source=source_int, line_width=2, line_alpha=1, nonselection_line_alpha=1, color="green")
    plot_int.varea('t_prod', 'prodplus', source=source_int, color="blue", fill_alpha=0.5)
    plot_int.varea('t_prod', 'prodminus', source=source_int, color="red", fill_alpha=0.5)
    
    plot_int.xaxis.fixed_location = 0;
    
    
    
    plot_conv = figure(x_range=XLIMS, y_range=YLIM_conv , plot_width=plot_width, plot_height=plot_height)
    #plot_conv.line('t', 'conv', source=source_conv, line_width=1, line_alpha=1, color="black")
    plot_conv.line('t_conv', 'conv', source=source_conv, line_width=2, line_alpha=1, color="black")
    plot_conv.circle('t_conv', 'conv', source=source_conv, size=2, color="black")
    
    plot_conv.circle('t0', 'c0', source=source_conv_c, size=10, color="red")
    plot_conv.xaxis.fixed_location = 0;
    
    x_select = Select(title='Signal x(t)', value='cello', options=signals)
    y_select = Select(title='Signal y(t)', value='cello', options=signals)
    
    x_slider = Slider(start=t_conv[0], end=t_conv[-1], value=0, step=step, title="t")
    
    
    callback = CustomJS(args=dict(T0=t_conv[0],N = N, source_xy=source_xy, source_int=source_int, source_conv=source_conv, x_slider=x_slider, step=step, x_select=x_select, plot_x=px, source_conv_c=source_conv_c), code=code)
    
    #callback2 = CustomJS(args=dict(source_xy=source_xy, source_int=source_int, source_conv=source_conv, mode_box=mode_box, x_slider=x_slider, l=l, step=step, x_select=x_select, y_select=y_select, plot_x=px, plot_y=py), code="""
    callback2 = CustomJS(args=dict(T0=t_conv[0],N = N, source_xy=source_xy, source_int=source_int, source_conv=source_conv,  x_slider=x_slider, step=step, x_select=x_select, plot_x=px, source_conv_c=source_conv_c), code="""
    
        source_conv.data['conv'] = new Float64Array(source_conv.data['conv0'])
        x_slider.value = 0 
        
        
    """ + code)
    
    
    x_select.js_on_change('value', callback2)
    y_select.js_on_change('value', callback2)
    
    x_slider.js_on_change('value', callback)
    email = Div(text="<p>gilles.chardon@centralesupelec.fr</p>", style={"color": "grey"})
    
    
    layout = column(x_select, x_slider, plot_int, plot_conv, email)
    
    return layout

def generate_components():
    return components(generate_layout())

    
def show_layout():    
    show(generate_layout())