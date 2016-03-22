import React, { Component }     from 'react';
import classNames               from 'classnames';
import ReactCSSTransitionGroup  from 'react-addons-css-transition-group';

import { getQueryVariable }     from '../../helpers/url.helpers';
import GraphContainer           from '../../containers/GraphContainer.jsx';
import ArtistAvatarContainer    from '../../containers/ArtistAvatarContainer.jsx';
import SamplesContainer         from '../../containers/SamplesContainer.jsx';
import Search                   from '../Search';
import Header                   from '../Header';

export default function HomeBase(DevTools = null) {
  return class Home extends Component {
    componentWillMount() {
      // Figure out if the user has followed a specific artist URL.
      // If so, dispatch the action to select that artist.
      // This is a weird place to do this, but I can't think of a good alternative.
      const artistId = getQueryVariable('artistId');

      if ( artistId ) {
        this.props.actions.selectArtist(artistId);
      }
    }

    render() {
      let classes = classNames({
        'wrapped-for-devtools': process.env.NODE_ENV !== 'production'
      });

      const isGraphRunning = this.props.graph.get('status');

      return (
        <div id="layout" className={classes}>
          <ReactCSSTransitionGroup
            transitionName="search-animation"
            transitionAppear={true}
            transitionAppearTimeout={750}
            transitionEnterTimeout={0}
            transitionLeaveTimeout={2500}
          >
            { isGraphRunning ? null : <Search /> }
          </ReactCSSTransitionGroup>
          { isGraphRunning ? <GraphContainer /> : null }
          { isGraphRunning ? <ArtistAvatarContainer /> : null }
          { isGraphRunning ? <SamplesContainer /> : null }


          { DevTools ? <DevTools /> : null }
        </div>
      );
    }
  };
}
