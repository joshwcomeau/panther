import React, { Component }     from 'react';
import classNames               from 'classnames';

import GraphContainer           from '../../containers/GraphContainer.jsx';
import SearchContainer          from '../../containers/SearchContainer.jsx';
import Header                   from '../Header';

export default function HomeBase(DevTools = null) {
  return class Home extends Component {
    render() {
      let classes = classNames({
        'wrapped-for-devtools': process.env.NODE_ENV !== 'production'
      });

      const isGraphRunning = this.props.graph.get('nodeGroups');

      return (
        <div id="layout" className={classes}>
          <Header centered={isGraphRunning} />

          { isGraphRunning ? null : <SearchContainer /> }
          { isGraphRunning ? <GraphContainer /> : null }

          { DevTools ? <DevTools /> : null }

          <div className="background">
            <div />
            <div />
            <div />
          </div>
        </div>
      );
    }
  };
}
