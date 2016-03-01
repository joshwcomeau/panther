import React from 'react';
import { createDevTools } from 'redux-devtools';

import FilterMonitor  from 'redux-devtools-filter-actions';
import LogMonitor     from 'redux-devtools-log-monitor';
import DockMonitor    from 'redux-devtools-dock-monitor';

const DevTools = createDevTools(
  // Monitors are individually adjustable with props.
  // Consult their repositories to learn about those props.
  // Here, we put LogMonitor inside a DockMonitor.
  <DockMonitor
    toggleVisibilityKey='ctrl-h'
    changePositionKey='ctrl-q'
    defaultIsVisible={false}
  >
    <FilterMonitor blacklist={['EFFECT_TRIGGERED', 'EFFECT_RESOLVED']}>
      <LogMonitor theme='tomorrow' />
    </FilterMonitor>
  </DockMonitor>
);

export default DevTools;
