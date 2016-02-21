import React, { Component }     from 'react';
import ReactCSSTransitionGroup  from 'react-addons-css-transition-group';
import classNames               from 'classnames';

export default function HomeBase(DevTools = null) {
  return class Home extends Component {
    render() {
      let classes = classNames({
        'wrapped-for-devtools': process.env.NODE_ENV !== 'production'
      });

      return (
        <div id="layout" className={classes}>
          { this.props.children }

          { DevTools ? <DevTools /> : null }
        </div>
      );
    }
  };
}
