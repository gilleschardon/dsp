#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Apr 22 12:30:02 2020

@author: gilleschardon
"""
import numpy as np
import FFT_demo


def signal_resol(t):
    h = np.cos(2 * np.pi * 0.123 * t) - np.cos(2 * np.pi * 0.15 * t)
    return h



def generate_components():
    return FFT_demo.FFT_demo(signal_resol, mode='resolution', Nmin=20, Nmax=200, log=True)