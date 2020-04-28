#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Apr 22 12:30:02 2020

@author: gilleschardon
"""
import numpy as np
import FFT_demo


def signal_filter(t):
    h = np.zeros(t.shape)
    h[:5] = np.array([1, -1, 1, -1, 1])
    return h

def generate_components():
    return FFT_demo.FFT_demo(signal_filter, mode='filter', Nmin=5, Nmax=50, log=False)