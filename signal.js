

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
