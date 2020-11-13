#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Apr 22 12:30:02 2020

@author: gilleschardon
"""
import numpy as np
import FFT_demo


def signal_resol_w(t):
    nu_1 = 0.12
    nu_2 = 0.2
    h = np.cos(2 * np.pi * nu_1 * t) - 0.01 * np.cos(2 * np.pi * nu_2 * t)
 
    return h





def generate_components():
    return FFT_demo.FFT_demo(signal_resol_w, mode='resolution', Nmin=20, Nmax=200, log=True)