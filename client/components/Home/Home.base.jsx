import React, { Component }     from 'react';
import { Map }                  from 'immutable';
import classNames               from 'classnames';
import ReactCSSTransitionGroup  from 'react-addons-css-transition-group';
import Sentry                   from 'react-activity/lib/Sentry';

import { isMobile }             from '../../helpers/device.helpers';
import GithubLink               from '../GithubLink';
import Footer                   from '../Footer';
import FullScreenError          from '../FullScreenError';
import SadCatIcon               from '../SadCatIcon';
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

      // Sadly, for now, we don't support mobile devices; too many quirks.
      // If the user is on a phone, return a sad error message instead.
      if ( isMobile() ) {
        return (
          <FullScreenError title="Sorry, I can't run on your device.">
            <SadCatIcon />

            <p>
              Sadly, Panther is a desktop-only experience at the moment. Mobile version is in the works, but I'd rather you have no experience than a glitchy one!
            </p>
            <p>
              Feel free to
              &nbsp;
              <a href="https://twitter.com/joshwcomeau">
                hassle me on Twitter
              </a>
              &nbsp;
              if you want this to be expedited!
            </p>

            <br />
            <p className="small">
              Sad cat icon by
              &nbsp;
              <a href="https://thenounproject.com/Gilleas/">Rikki Lorie</a>
            </p>
          </FullScreenError>
        )
      }

      const isSearching     = this.props.mode === 'search';
      const isGraphRunning  = this.props.mode === 'graph';
      const isLoading       = this.props.graph.get('loading');
      const isRepositioning = this.props.graph.get('repositioning');

      return (
        <div id="layout" className={classes}>
          <ReactCSSTransitionGroup
            transitionName="search-animation"
            transitionEnterTimeout={1000}
            transitionLeaveTimeout={1000}
          >
            { isSearching ? <SearchContainer /> : null }
          </ReactCSSTransitionGroup>

          { isGraphRunning ? this.renderRunning() : null }

          <ReactCSSTransitionGroup
            transitionName="graph-loader"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={1500}
          >
            {
              isLoading
              ? <div id="graph-loader"><Sentry size={45} /></div>
              : null
            }
          </ReactCSSTransitionGroup>

          <GithubLink />
          <Footer />

          { DevTools ? <DevTools /> : null }

        </div>
      );
    }
  };
}
