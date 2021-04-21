

function convolve(arr1, arr2)
{
  output = Array(arr1.length + arr2.length - 1).fill(0)

  for (var k = 0 ; k < arr1.length ; k++)
  {
    output.splice(k, arr2.length, ...output.slice(k, k+arr2.length).map((v, idx) => v + arr2[idx] * arr1[k]))
  }

  return output
}

function circularconvolve(arr1, arr2)
{
  N = Math.max(arr1.length, arr2.length)
  output = Array(N).fill(0)

  if (arr1.length < N)
  {
    for (var k = 0 ; k < arr1.length ; k++)
    {
      output.splice(k, N-k, ...output.slice(k, N).map((v, idx) => v + arr2[idx] * arr1[k]))
      output.splice(0, k, ...output.slice(0, k).map((v, idx) => v + arr2[idx+N-k] * arr1[k]))
    }
  }
  else
  {
    for (var k = 0 ; k < arr2.length ; k++)
    {
      output.splice(k, N-k, ...output.slice(k, N).map((v, idx) => v + arr1[idx] * arr2[k]))
      output.splice(0, k, ...output.slice(0, k).map((v, idx) => v + arr1[idx+N-k] * arr2[k]))
    }
  }
  return output
}

function up2(array)
{
  output = Array(array.length * 2 - 1).fill(0)
  array.forEach((v, idx) => output[2*idx] = v)
  return output
}

function down2(array)
{
  if (array.length == 0)
  {
    return Array(0)
  }

  output = Array(Math.ceil(array.length/2)).fill(0)
  output.forEach((v, idx) => output[idx] = array[2*idx])

  return output
}

function down2s(array)
{
  if (array.length < 2)
  {
    return Array(0)
  }
  output = Array(Math.floor(array.length/2)).fill(0)
  output.forEach((v, idx) => output[idx] = array[2*idx+1])

  return output
}

function fft(real, imag, N = 0)
{
  if (real.length == 0)
  {
    return {real: Array(N).fill(0), imag: Array(N).fill(0)}
  }

  N = N == 0 ? real.length : N

  if (N == 1)
  {
    return {real: [...real], imag: [...imag]}
  }

  var F1 = fft(down2(real), down2(imag), N/2)
  var F2 = fft(down2s(real), down2s(imag), N/2)

  var R1 = F1.real.concat(F1.real)
  var R2 = F2.real.concat(F2.real)

  var I1 = F1.imag.concat(F1.imag)
  var I2 = F2.imag.concat(F2.imag)

  var R = R1.map((u, idx) => u + Math.cos(-2*Math.PI * idx / N) * R2[idx] - Math.sin(-2*Math.PI * idx / N) * I2[idx])
  var I = I1.map((u, idx) => u + Math.sin(-2*Math.PI * idx / N) * R2[idx] + Math.cos(-2*Math.PI * idx / N) * I2[idx])

  return {real: [...R],   imag: [...I]}
}

function ifft(real, imag)
{
  var N = real.length

  F = fft(imag, real)

  IF = {
    real: F.imag.map(t => t/N),
    imag: F.real.map(t => t/N)
  }
  return IF
}

function proxtv(y, lam)
{
    var N = y.length

    var x = Array(N).fill(0)

    var k = 0
    var kp = 0
    var km = 0
    var k0 = 0

    var vmin = y[0] - lam
    var vmax = y[0] + lam
    var umin = lam
    var umax = - lam

    while(k < N - 1)
    {
        if (y[k+1] + umin < vmin - lam)
        {
            x.splice(k0, km-k0 + 1, ...Array(km-k0 + 1).fill(vmin))
            k = km + 1 ; kp = k ; km = k ; k0 = k
            vmin = y[k] ;           vmax = y[k] + 2 *lam
            umin = lam ;            umax = -lam
       }
       else if (y[k+1] + umax > vmax + lam)
       {
            x.splice(k0, kp-k0 + 1, ...Array(kp-k0 + 1).fill(vmax))
            k = kp + 1 ; kp = k ; km = k ; k0 = k
            vmin = y[k] - 2 * lam ;            vmax = y[k]
            umin = lam ;                       umax = -lam
       }
       else
       {
            k = k + 1
            umin = umin + y[k] - vmin
            umax = umax + y[k] - vmax
            if (umin >= lam)
            {
                vmin = vmin + (umin - lam)/(k-k0 + 1)
                umin = lam
                km = k
            }
            if (umax <= - lam)
            {
                vmax = vmax + (umax + lam)/(k-k0 + 1)
                umax = - lam
                kp = k
            }
        if (k == N - 1)
        {
            if (umin < 0)
            {
                x.splice(k0, km-k0 + 1, ...Array(km-k0 + 1).fill(vmin))
                k = km + 1 ; km = k ;k0 = k
                vmin = y[k]
                umin = lam
                umax = y[k] + lam - vmax
            }
            else if (umax > 0)
            {
                x.splice(k0, kp-k0 + 1, ...Array(kp-k0 + 1).fill(vmax))
                k = kp + 1 ; kp = k ; k0 = k
                vmax = y[k]
                umax = - lam
                umin = y[k] - lam - vmin
            }
            else
            {
                x.splice(k0, N - k0 + 1, ...Array(N-k0 + 1).fill(vmin + umin / (k-k0+1)))
                return x
            }
          }
       }
     }
    x[k] = vmin + umin
    return x
}

/*
 * Free FFT and convolution (JavaScript)
 *
 * Copyright (c) 2014 Project Nayuki
 * http://www.nayuki.io/page/free-small-fft-in-multiple-languages
 *
 * (MIT License)
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * - The above copyright notice and this permission notice shall be included in
 *   all copies or substantial portions of the Software.
 * - The Software is provided "as is", without warranty of any kind, express or
 *   implied, including but not limited to the warranties of merchantability,
 *   fitness for a particular purpose and noninfringement. In no event shall the
 *   authors or copyright holders be liable for any claim, damages or other
 *   liability, whether in an action of contract, tort or otherwise, arising from,
 *   out of or in connection with the Software or the use or other dealings in the
 *   Software.
 *
 * Slightly restructured by Chris Cannam, cannam@all-day-breakfast.com
 */

"use strict";

/*
 * Construct an object for calculating the discrete Fourier transform (DFT) of size n, where n is a power of 2.
 */
function FFTNayuki(n) {

    this.n = n;
    this.levels = -1;

    for (var i = 0; i < 32; i++) {
        if (1 << i == n) {
            this.levels = i;  // Equal to log2(n)
	}
    }
    if (this.levels == -1) {
        throw "Length is not a power of 2";
    }

    this.cosTable = new Array(n / 2);
    this.sinTable = new Array(n / 2);
    for (var i = 0; i < n / 2; i++) {
        this.cosTable[i] = Math.cos(2 * Math.PI * i / n);
        this.sinTable[i] = Math.sin(2 * Math.PI * i / n);
    }

    /*
     * Computes the discrete Fourier transform (DFT) of the given complex vector, storing the result back into the vector.
     * The vector's length must be equal to the size n that was passed to the object constructor, and this must be a power of 2. Uses the Cooley-Tukey decimation-in-time radix-2 algorithm.
     */
    this.forward = function(real, imag) {

	var n = this.n;

	// Bit-reversed addressing permutation
	for (var i = 0; i < n; i++) {
            var j = reverseBits(i, this.levels);
            if (j > i) {
		var temp = real[i];
		real[i] = real[j];
		real[j] = temp;
		temp = imag[i];
		imag[i] = imag[j];
		imag[j] = temp;
            }
	}

	// Cooley-Tukey decimation-in-time radix-2 FFT
	for (var size = 2; size <= n; size *= 2) {
            var halfsize = size / 2;
            var tablestep = n / size;
            for (var i = 0; i < n; i += size) {
		for (var j = i, k = 0; j < i + halfsize; j++, k += tablestep) {
                    var tpre =  real[j+halfsize] * this.cosTable[k] +
			        imag[j+halfsize] * this.sinTable[k];
                    var tpim = -real[j+halfsize] * this.sinTable[k] +
			        imag[j+halfsize] * this.cosTable[k];
                    real[j + halfsize] = real[j] - tpre;
                    imag[j + halfsize] = imag[j] - tpim;
                    real[j] += tpre;
                    imag[j] += tpim;
		}
            }
	}

	// Returns the integer whose value is the reverse of the lowest 'bits' bits of the integer 'x'.
	function reverseBits(x, bits) {
            var y = 0;
            for (var i = 0; i < bits; i++) {
		y = (y << 1) | (x & 1);
		x >>>= 1;
            }
            return y;
	}
    }

    /*
     * Computes the inverse discrete Fourier transform (IDFT) of the given complex vector, storing the result back into the vector.
     * The vector's length must be equal to the size n that was passed to the object constructor, and this must be a power of 2. This is a wrapper function. This transform does not perform scaling, so the inverse is not a true inverse.
     */
    this.inverse = function(real, imag) {
	this.forward(imag, real);
    }
}
