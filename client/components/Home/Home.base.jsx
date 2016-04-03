import React, { Component }     from 'react';
import { Map }                  from 'immutable';
import classNames               from 'classnames';
import ReactCSSTransitionGroup  from 'react-addons-css-transition-group';
import Sentry                   from 'react-activity/lib/Sentry';

import { getArtistIdFromUrl }   from '../../helpers/url.helpers';
import GraphContainer           from '../../containers/GraphContainer.jsx';
import ArtistAvatarContainer    from '../../containers/ArtistAvatarContainer.jsx';
import SamplesContainer         from '../../containers/SamplesContainer.jsx';
import RestartContainer         from '../../containers/RestartContainer.jsx';
import SearchContainer          from '../../containers/SearchContainer.jsx';


export default function HomeBase(DevTools = null) {
  return class Home extends Component {
    renderRunning() {
      return (
        <div>
          <GraphContainer />
          <ArtistAvatarContainer />
          <SamplesContainer />
          <RestartContainer />
        </div>
      )
    }

    render() {
      let classes = classNames({
        'wrapped-for-devtools': process.env.NODE_ENV !== 'production'
      });

      const isSearching     = this.props.mode === 'search';
      const isGraphRunning  = this.props.mode === 'graph';
      const graphStatus     = this.props.graph.get('status');
      const isLoading       = isGraphRunning && graphStatus !== 'idle';

      return (
        <div id="layout" className={classes}>
          <ReactCSSTransitionGroup
            transitionName="search-animation"
            transitionEnterTimeout={1000}
            transitionLeaveTimeout={2500}
          >
            { isSearching ? <SearchContainer /> : null }
          </ReactCSSTransitionGroup>

          { isGraphRunning ? this.renderRunning() : null }

          <ReactCSSTransitionGroup
            transitionName="graph-loader"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={1500}
          >
            { isLoading ? <div id="graph-loader"><Sentry size={45} /></div> : null }
          </ReactCSSTransitionGroup>

          { DevTools ? <DevTools /> : null }
        </div>
      );
    }
  };
}
