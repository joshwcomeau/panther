import React, { Component, PropTypes }  from 'react';
import ReactDOM, { render }             from 'react-dom';
import { Provider }                     from 'react-redux';
import classNames                       from 'classnames';

import configureStore from './store';
import Home           from './components/Home';

require('./scss/main.scss');

const store = configureStore();

render((
  <Provider store={store}>
    <Home />
  </Provider>
), document.getElementById('render-target'))
