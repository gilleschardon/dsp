#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Apr 20 18:16:08 2021

@author: gilleschardon
"""

import numpy as np
import matplotlib.pyplot as plt
import numpy.random as rd

def tvprox(y, lam):
    
    x = np.zeros(y.shape)
    N = y.shape[0]
    
    k = 0
    kp = 0
    km = 0
    k0 = 0
    
    vmin = y[0] - lam
    vmax = y[0] + lam
    umin = lam
    umax = - lam
    
    while k < N - 1:
        if y[k+1] + umin < vmin - lam: # b1
            x[k0:km+1] = vmin
            k = km + 1
            kp = k
            km = k
            k0 = k
            vmin = y[k]
            vmax = y[k] + 2 *lam
            umin = lam
            umax = -lam
        elif y[k+1] + umax > vmax + lam: # b2
            x[k0:kp+1] = vmax
            k = kp + 1
            kp = k
            km = k
            k0 = k
            vmin = y[k] - 2 * lam
            vmax = y[k]
            umin = lam
            umax = -lam
        else: # b3
            k = k + 1
            umin = umin + y[k] - vmin
            umax = umax + y[k] - vmax
            if umin >= lam: # b31
                vmin = vmin + (umin - lam)/(k-k0 + 1)
                umin = lam
                km = k
            if umax <= - lam: # b32
                vmax = vmax + (umax + lam)/(k-k0 + 1)
                umax = - lam
                kp = k
        if k == N - 1:
            if umin < 0:# c1
                x[k0:km+1] = vmin
                k = km + 1
                km = k
                k0 = k
                vmin = y[k]
                umin = lam
                umax = y[k] + lam - vmax
            elif umax > 0:
                x[k0:kp+1] = vmax
                k = kp + 1
                kp = k
                k0 = k
                vmax = y[k]
                umax = - lam
                umin = y[k] - lam - vmin
            else:
                x[k0:N+1] = vmin + umin / (k-k0+1)
                return x
    x[k] = vmin + umin
    return x        



def plottv(x, lam):
    xtv = tvprox(x, lam)
    
    
    xint = np.hstack([0, x.cumsum()])
    
    plt.figure()
    #plt.plot(xint)
    xp = xint + lam
    xp[0] = 0
    xp[-1] = xint[-1]
    xm = xint - lam
    xm[0] = 0
    xm[-1] = xint[-1]
    
    plt.plot(np.hstack([0, xtv.cumsum()]))
    plt.plot(xp)
    plt.plot(xm)

    plt.figure()
    plt.plot(x)
    plt.plot(xtv)
    return xtv

t = np.arange(100)

x = np.zeros([100])
x[ np.logical_and(t < 80 , t>30)] = 1

xn = x+ rd.normal(0, 0.5, 100)
