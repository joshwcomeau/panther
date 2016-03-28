import React, { Component } from 'react';
// TODO: Move this into an external module

const immutableProps = propNamesOrTargetComponent => {
  // If our decorator was not invoked, propNames is actually our Target Component.
  // It may, however, just be our array of propNames.

  // If it's our TargetComponent, we can wrap it right away.
  if ( Object.getPrototypeOf(propNamesOrTargetComponent) === Component ) {
    const TargetComponent = propNamesOrTargetComponent;
    return wrapComponent(TargetComponent)
  }

  // If it's our prop names, we need to return a function that will wrap it
  // once it receives the TargetComponent
  const propNames = propNamesOrTargetComponent;
  return TargetComponent => wrapComponent(TargetComponent, propNames);
}

function wrapComponent(TargetComponent, propNames) {
  return class immutablePropChecker extends Component {
    shouldComponentUpdate(nextProps) {
      // If we haven't supplied propNames, check all of them
      if ( !propNames ) propNames = Object.keys(this.props);

      return propNames.some( p => this.props[p] !== nextProps[p] );
    }

    render() {
      return <TargetComponent {...this.props} />;
    }
  }
}

export default immutableProps;
