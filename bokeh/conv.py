# -*- coding: utf-8 -*-


import numpy as np
from bokeh import events
from bokeh.layouts import column, row
from bokeh.models import CustomJS, Slider, PointDrawTool, ResetTool, Div
from bokeh.plotting import ColumnDataSource, figure, output_file, show
from bokeh.embed import file_html
from bokeh.io import save
from bokeh.util.browser import view
from bokeh.embed import components

import scipy.signal.windows as ws

def generate_layout():

    
    
    # +/- xlim of the plot
    L = 10;
    
    # impulse response
    x = np.zeros([L])
    x[0] = 1
    
    y = np.zeros([L])
    y[0] = 1
    
    z = np.zeros([2*L-1])
    z[0] = 1
    
    marge = 2
    
    alpha_out = 0.5
    
    code = """
    
        const data_x = source_x.data;
        const data_y = source_y.data;
    
        const data_z = source_z.data;
     
    
        const x = source_x.data['x']
        const y = source_y.data['y']
        const xz = source_x.data['xz']
        const yz = source_y.data['yz']
         
        const nx = source_x.data['n']
        const ny = source_y.data['n']
    
        const z = source_z.data['z']
    
        z.fill(0)
        nx.forEach((v, k, a) => {a[k] = k})
        ny.forEach((v, k, a) => {a[k] = k})
    
        var idxx = source_x.selected.indices[0]
        var idxy = source_y.selected.indices[0]
    
        xz.forEach((v, k, a) => {a[k] = x[k] * y[idxy]})
        yz.forEach((v, k, a) => {a[k] = y[k] * x[idxx]})
    
    
    
        for (var k = 0 ; k < nx.length ; k++)
        {
             for (var l = 0 ; l < ny.length ; l++)
             {
                     z[k+l] = z[k+l] + x[k] * y[l]
            }
        }
        
        
        
        source_x.change.emit();
        source_y.change.emit();
    
        source_z.change.emit();
    """
    
    
    
    
    source_x = ColumnDataSource(data=dict(n=np.arange(x.shape[0]), nz=np.arange(x.shape[0]), x=x, xz=x))
    source_y = ColumnDataSource(data=dict(n=np.arange(y.shape[0]), nz=np.arange(y.shape[0]), y=y, yz=y))
    
    source_z = ColumnDataSource(data=dict(n=np.arange(z.shape[0]), z=z))
    
    
    plot_x = figure(x_range=(-marge, 2*L+marge), y_range=(-2.1,2.1) , plot_width=800, plot_height=300)
    circx0 = plot_x.circle(np.hstack([np.arange(-marge,0), np.arange(L, 2*L+marge+1)]), 0,  line_width=0, alpha=alpha_out, size=10, color="green")
    
    circx = plot_x.circle('n', 'x', source=source_x, line_width=0, line_alpha=1, size=10, legend_label="x[n]", nonselection_fill_alpha=1, color="green")
    plot_x.segment('n', 0, 'n', 'x', source=source_x, line_width=1, line_alpha=1, nonselection_line_alpha=1, color="green")
    plot_x.xaxis.fixed_location = 0;
    
    
    plot_y = figure(x_range=(-marge, 2*L+marge), y_range=(-2.1,2.1) , plot_width=800, plot_height=300)
    circy0 = plot_y.circle(np.hstack([np.arange(-marge,0), np.arange(L, 2*L+marge+1)]), 0,  line_width=0, alpha=alpha_out, size=10, color='red')
    
    circy = plot_y.circle('n', 'y', source=source_y, line_width=0, line_alpha=1, size=10, legend_label="y[n]", color='red', nonselection_fill_alpha=1)
    plot_y.segment('n', 0, 'n', 'y', source=source_y, line_width=1, line_alpha=1, nonselection_line_alpha=1, color='red')
    plot_y.xaxis.fixed_location = 0;
    
    
    plot_z = figure(x_range=(-marge, 2*L+marge), y_range=(-2.1,2.1) , plot_width=800, plot_height=300)
    circz0 = plot_z.circle(np.hstack([np.arange(-marge,0), np.arange(2*L-1, 2*L+marge+1)]), 0,  line_width=0, alpha=alpha_out, size=10)
    
    
    plot_z.circle('n', 'z', source=source_z, line_width=0, line_alpha=1, size=10, legend_label="(x★y) [n]")
    plot_z.segment('n', 0, 'n', 'z', source=source_z, line_width=1, line_alpha=1)
    plot_z.xaxis.fixed_location = 0;
    
    pxz = plot_z.circle('nz', 'xz', source=source_x, line_width=0, alpha=0.2, size=20, legend_label="(x★y) [n]", color="green")
    cxz = plot_z.segment('nz', 0, 'nz', 'xz', source=source_x, line_width=1, line_alpha=0.5, color="green")
    
    
    pyz = plot_z.circle('nz', 'yz', source=source_y, line_width=0, alpha=0.2, size=20, legend_label="(x★y) [n]", color='red')
    cyz = plot_z.segment('nz', 0, 'nz', 'yz', source=source_y, line_width=1, line_alpha=0.5, color='red')
    
    
    pxz.visible = False
    cxz.visible = False
    pyz.visible = False
    cyz.visible = False
    callback = CustomJS(args=dict(source_x=source_x, source_y=source_y, source_z=source_z),
                        code=code)
    
    
    draw_tool_x = PointDrawTool(renderers=[circx], empty_value='black')
    draw_tool_x.add = False
    
    draw_tool_y = PointDrawTool(renderers=[circy], empty_value='black')
    draw_tool_y.add = False
    
    
    callback_x = CustomJS(args=dict(source_x=source_x, source_y=source_y, source_z=source_z), code="""
                    source_x.data['x'].fill(0)
                    source_x.data['x'][0] = 1
    """ + code
    )
    callback_y = CustomJS(args=dict(source_x=source_x, source_y=source_y, source_z=source_z), code="""
                    source_y.data['y'].fill(0)
                    source_y.data['y'][0] = 1
    
    """ + code
    )
    
    callback_z = CustomJS(args=dict(source_x=source_x, source_y=source_y, source_z=source_z), code="""
                    source_x.data['x'].fill(0)
                    source_x.data['x'][0] = 1
                    source_y.data['y'].fill(0)
                    source_y.data['y'][0] = 1
    """ + code
    )
    
    #plot_y.js_on_event(events.PanStart, CustomJS(args=dict(pxz=pxz, cxz=cxz, source_x=source_x,source_y=source_y), code="""
    #
    #pxz.visible = true;
    #cxz.visible = true;
    #
    #source_x.data['nz'].forEach((v, k, a) => {a[k] = k + source_y.selected.indices[0]})
    #    source_x.change.emit();
    #"""))
    #plot_y.js_on_event(events.PanEnd, CustomJS(args=dict(pxz=pxz, cxz=cxz), code="pxz.visible = false; cxz.visible = false"))
    #
    #plot_x.js_on_event(events.PanStart, CustomJS(args=dict(pyz=pyz, cyz=cyz, source_x=source_x,source_y=source_y), code="""
    #
    #pyz.visible = true;
    #cyz.visible = true;
    #
    #source_y.data['nz'].forEach((v, k, a) => {a[k] = k + source_x.selected.indices[0]})
    #    source_y.change.emit();
    #"""))
    #plot_x.js_on_event(events.PanEnd, CustomJS(args=dict(pyz=pyz, cyz=cyz), code="pyz.visible = false; cyz.visible = false"))
    
    
    
    
    
    
    
    plot_x.js_on_event(events.Pan, callback)
    plot_y.js_on_event('pan', callback)
    
    
    
    plot_x.add_tools(draw_tool_x)
    plot_y.add_tools(draw_tool_y)
    
    plot_x.js_on_event('reset', callback_x)
    plot_y.js_on_event('reset', callback_y)
    plot_z.js_on_event('reset', callback_z)
    
    plot_x.toolbar.active_tap = draw_tool_x
    plot_y.toolbar.active_tap = draw_tool_y
    email = Div(text="<p>gilles.chardon@centralesupelec.fr</p>", style={"color": "grey"})
    
    
    layout = column(plot_x, plot_y, plot_z, email)
    
    return layout


def generate_components():
    return components(generate_layout())

    
def show_layout():    
    show(generate_layout())