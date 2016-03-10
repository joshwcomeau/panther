import React, { Component }     from 'react';
import classNames               from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import GraphContainer           from '../../containers/GraphContainer.jsx';
import ArtistInfo               from '../ArtistInfo';
import Search                   from '../Search';
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
          <ReactCSSTransitionGroup
            transitionName="search-animation"
            transitionAppear={true}
            transitionAppearTimeout={750}
            transitionEnterTimeout={500}
            transitionLeaveTimeout={2500}
          >
            { isGraphRunning ? null : <Search /> }
          </ReactCSSTransitionGroup>
          { isGraphRunning ? <GraphContainer /> : null }
          { isGraphRunning ? <ArtistInfo /> : null }


          { DevTools ? <DevTools /> : null }
        </div>
      );
    }
  };
}
