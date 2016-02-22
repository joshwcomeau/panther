import React, { Component }     from 'react';
import ReactCSSTransitionGroup  from 'react-addons-css-transition-group';
import classNames               from 'classnames';

class Nodes extends Component {
  render() {

    return (
      <div id="nodes">
        <div id="graveyard" className="nodes-region">

        </div>
        <div id="past" className="nodes-region">
          <div className="node-wrapper">
            <div className="node">Celine Dion</div>
          </div>
        </div>
        <div id="present" className="nodes-region">
          <div className="node-wrapper">
            <div className="node">Sheryl Crow</div>
          </div>
        </div>
        <div id="future" className="nodes-region">
          <div className="node-wrapper">
            <div className="node">Britney Spears</div>
          </div>
          <div className="node-wrapper">
            <div className="node">Ke$ha</div>
          </div>
          <div className="node-wrapper">
            <div className="node">Lady Gaga</div>
          </div>
        </div>
      </div>
    );
  }
};

export default Nodes;
