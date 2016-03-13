//  t: current time
//  b: beginning value
//  c: change in value
//  d: duration
export function easeInOutQuart(t, b, c, d) {
  if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
  return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
}

export function linear(t, b, c, d) {
  console.log("Called")
  if ( t > d ) return b + c;
  const ratio = t / d;
  return b + (c * ratio);
}
