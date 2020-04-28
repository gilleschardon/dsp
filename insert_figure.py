#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Apr  2 10:21:58 2020

@author: gilleschardon
"""
import sys
import re
from bs4 import BeautifulSoup
from importlib import import_module

html = open(sys.argv[1], "r")

dom = BeautifulSoup(html, features='html5lib')


#%%

include1 = '<script src="https://cdn.bokeh.org/bokeh/release/bokeh-2.0.1.min.js" crossorigin="anonymous"></script>'
include2 =  '<script src="https://cdn.bokeh.org/bokeh/release/bokeh-widgets-2.0.1.min.js"  crossorigin="anonymous"></script>' 
      
includes = BeautifulSoup(include1+include2, 'html.parser')


for head in dom.find_all("head"):
     head.append(includes)

   
reg = re.compile("INSERTFIG%(.*)%")

for p in dom.find_all("p"):

    m = reg.match(p.string)
    
    if m:
        fig_name = m.groups()[0]
       
        fig_module = import_module(fig_name)

        script, div = fig_module.generate_components()

        pp = p.parent
        p.decompose()
        pp.append(BeautifulSoup(div, 'html.parser'))
        for head in dom.find_all("head"):
            head.append(BeautifulSoup(script, 'html.parser'))


f = open(sys.argv[2], "w")
f.write(str(dom))
f.close()