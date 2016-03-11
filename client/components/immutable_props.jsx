import React, { Component } from 'react';

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

      console.log("Checking propNames", propNames)

      return propNames.some( p => this.props[p] !== nextProps[p] );
    }

    render() {
      return <TargetComponent {...this.props} />;
    }
  }
}

// The decorator can be pre-invoked with props to check, or not. We may need to
// do some juggling to make sure our arguments are correct.
// TODO: Remove me
function prepArguments(arg1, arg2) {
  // Case 1: Default use-case
  if ( Array.isArray(arg1) && Object.getPrototypeOf(arg2) === Component ) {
    console.log("Returning Case 1",[ arg1, arg2 ]);
    return [ arg1, arg2 ];
  }

  // Case 2: Decorator not invoked
  // In this case, we did not invoke the decorator before giving it the
  // TargetComponent. Handily, though, our second argument is a list of
  // all props passed to the component, so we can just use that :)
  if ( Object.getPrototypeOf(arg1) === Component ) {
    return [ Object.keys(arg2), arg1 ];
  }

  // If any other combination has occured, throw an exception.
  // If arg2 is a function, we likely invoked the decorator with an invalid param
  if ( arg2.constructor ) {
    throw(`
      Oh no! The argument supplied to immutableProps are invalid.
      Check that you are either invoking @immutableProps with an array of strings,
      or not invoking it at all.
      Component in question: ${arg2.constructor.name}
    `);
  } else {
    throw(`
      Oh no! immutableProps can't make sense of things.
      Make sure you are placing the decorator right above an ES6 Class.
      Either invoke it with an array of strings, or don't invoke it at all.
    `);
  }
}




// Polyfill for Array#isArray
if ( !Array.isArray ) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

export default immutableProps;
