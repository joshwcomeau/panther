import React, { Component, PropTypes } from 'react';

import { repositionLength } from '../../config/timing';
import { repositionEasing } from '../../config/easing';

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      circle: { cx: 300, cy: 300, r: 100, fill: '#ABCDEF' },
      line: { x1: 300, y1: 300, x2: 300, y2: 300, stroke: '#FFFFFF', 'stroke-width': 4 }
    };
  }

  moveTo(ev) {
    const [ cx, cy ] = [ ev.clientX, ev.clientY ];
    animateCircle(this.state.circle, this.setState.bind(this), cx, cy, 1000);
    animateLine(this.state.line, this.setState.bind(this), cx, cy, 300, 300, 1000);
  }

  render() {
    const { vertices, edges, actions } = this.props;

    return (
      <svg id="graph" onClick={(ev) => this.moveTo(ev)}>
        <line {...this.state.line} />
        <circle {...this.state.circle} />

      </svg>
    );
  }
};

function animateCircle(circle, updater, cx, cy, duration) {
  const startTime = new Date().getTime();
  const startingCx = circle.cx;
  const startingCy = circle.cy;

  function updatePosition() {
    requestAnimationFrame( () => {
      const time = new Date().getTime() - startTime;
      const newCx = easeInOutQuart(time, startingCx, cx - startingCx, duration);
      const newCy = easeInOutQuart(time, startingCy, cy - startingCy, duration);
      updater({
        circle: { ...circle, cx: newCx, cy: newCy }
      }, () => {
        if ( time < duration ) updatePosition()
      });
    })
  }

  updatePosition();
}

function animateLine(line, updater, x1, y1, x2, y2, duration) {
  console.log("Animating line to", x1, y1, x2, y2)
  const startTime = new Date().getTime();
  const startingX1 = line.x1;
  const startingY1 = line.y1;
  const startingX2 = line.x2;
  const startingY2 = line.y2;

  function updatePosition() {
    requestAnimationFrame( () => {
      const time = new Date().getTime() - startTime;
      const newX1 = easeInOutQuart(time, startingX1, x1 - startingX1, duration);
      const newY1 = easeInOutQuart(time, startingY1, y1 - startingY1, duration);
      const newX2 = easeInOutQuart(time, startingX2, x2 - startingX2, duration);
      const newY2 = easeInOutQuart(time, startingY2, y2 - startingY2, duration);
      updater({
        line: { ...line, x1: newX1, y1: newY1, x2: newX2, y2: newY2 }
      }, () => {
        if ( time < duration ) updatePosition()
      });
    })
  }

  updatePosition();
}


//
// http://easings.net/#easeInOutQuart
//  t: current time
//  b: beginning value
//  c: change in value
//  d: duration
//
function easeInOutQuart(t, b, c, d) {
  if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
  return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
}


export default Graph;
