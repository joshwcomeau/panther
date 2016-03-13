/*
 *
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright Â© 2001 Robert Penner
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */


export function linearEase(currentIteration, startValue, changeInValue, totalIterations) {
	return changeInValue * currentIteration / totalIterations + startValue;
}

export function easeInQuad(currentIteration, startValue, changeInValue, totalIterations) {
	return changeInValue * (currentIteration /= totalIterations) * currentIteration + startValue;
}

export function easeOutQuad(currentIteration, startValue, changeInValue, totalIterations) {
	return -changeInValue * (currentIteration /= totalIterations) * (currentIteration - 2) + startValue;
}

export function easeInOutQuad(currentIteration, startValue, changeInValue, totalIterations) {
	if ((currentIteration /= totalIterations / 2) < 1) {
		return changeInValue / 2 * currentIteration * currentIteration + startValue;
	}
	return -changeInValue / 2 * ((--currentIteration) * (currentIteration - 2) - 1) + startValue;
}

export function easeInCubic(currentIteration, startValue, changeInValue, totalIterations) {
	return changeInValue * Math.pow(currentIteration / totalIterations, 3) + startValue;
}

export function easeOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
	return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
}

export function easeInOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
	if ((currentIteration /= totalIterations / 2) < 1) {
		return changeInValue / 2 * Math.pow(currentIteration, 3) + startValue;
	}
	return changeInValue / 2 * (Math.pow(currentIteration - 2, 3) + 2) + startValue;
}

export function easeInQuart(currentIteration, startValue, changeInValue, totalIterations) {
	return changeInValue * Math.pow (currentIteration / totalIterations, 4) + startValue;
}

export function easeOutQuart(currentIteration, startValue, changeInValue, totalIterations) {
	return -changeInValue * (Math.pow(currentIteration / totalIterations - 1, 4) - 1) + startValue;
}

export function easeInOutQuart(currentIteration, startValue, changeInValue, totalIterations) {
	if ((currentIteration /= totalIterations / 2) < 1) {
		return changeInValue / 2 * Math.pow(currentIteration, 4) + startValue;
	}
	return -changeInValue/2 * (Math.pow(currentIteration - 2, 4) - 2) + startValue;
}

export function easeInQuint(currentIteration, startValue, changeInValue, totalIterations) {
	return changeInValue * Math.pow (currentIteration / totalIterations, 5) + startValue;
}

export function easeOutQuint(currentIteration, startValue, changeInValue, totalIterations) {
	return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 5) + 1) + startValue;
}

export function easeInOutQuint(currentIteration, startValue, changeInValue, totalIterations) {
	if ((currentIteration /= totalIterations / 2) < 1) {
		return changeInValue / 2 * Math.pow(currentIteration, 5) + startValue;
	}
	return changeInValue / 2 * (Math.pow(currentIteration - 2, 5) + 2) + startValue;
}

export function easeInSine(currentIteration, startValue, changeInValue, totalIterations) {
	return changeInValue * (1 - Math.cos(currentIteration / totalIterations * (Math.PI / 2))) + startValue;
}

export function easeOutSine(currentIteration, startValue, changeInValue, totalIterations) {
	return changeInValue * Math.sin(currentIteration / totalIterations * (Math.PI / 2)) + startValue;
}

export function easeInOutSine(currentIteration, startValue, changeInValue, totalIterations) {
	return changeInValue / 2 * (1 - Math.cos(Math.PI * currentIteration / totalIterations)) + startValue;
}

export function easeInExpo(currentIteration, startValue, changeInValue, totalIterations) {
	return changeInValue * Math.pow(2, 10 * (currentIteration / totalIterations - 1)) + startValue;
}

export function easeOutExpo(currentIteration, startValue, changeInValue, totalIterations) {
	return changeInValue * (-Math.pow(2, -10 * currentIteration / totalIterations) + 1) + startValue;
}

export function easeInOutExpo(currentIteration, startValue, changeInValue, totalIterations) {
	if ((currentIteration /= totalIterations / 2) < 1) {
		return changeInValue / 2 * Math.pow(2, 10 * (currentIteration - 1)) + startValue;
	}
	return changeInValue / 2 * (-Math.pow(2, -10 * --currentIteration) + 2) + startValue;
}

export function easeInCirc(currentIteration, startValue, changeInValue, totalIterations) {
	return changeInValue * (1 - Math.sqrt(1 - (currentIteration /= totalIterations) * currentIteration)) + startValue;
}

export function easeOutCirc(currentIteration, startValue, changeInValue, totalIterations) {
	return changeInValue * Math.sqrt(1 - (currentIteration = currentIteration / totalIterations - 1) * currentIteration) + startValue;
}

export function easeInOutCirc(currentIteration, startValue, changeInValue, totalIterations) {
	if ((currentIteration /= totalIterations / 2) < 1) {
		return changeInValue / 2 * (1 - Math.sqrt(1 - currentIteration * currentIteration)) + startValue;
	}
	return changeInValue / 2 * (Math.sqrt(1 - (currentIteration -= 2) * currentIteration) + 1) + startValue;
}


//// My easing ones
//  t: current time
//  b: beginning value
//  c: change in value
//  d: duration
export function customEaseInOutQuart(t, b, c, d) {
  if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
  return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
}

export function customLinear(t, b, c, d) {
  if ( t > d ) return b + c;
  const ratio = t / d;
  return b + (c * ratio);
}
