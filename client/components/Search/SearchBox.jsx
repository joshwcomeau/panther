import React, { Component, PropTypes } from 'react';
import Autocomplete from 'react-autocomplete';
import classNames from 'classnames';

class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      artists: [],
      loading: false
    };

    this.changeHandler.bind(this);
    this.selectHandler.bind(this);
    this.renderItem.bind(this);
  }

  changeHandler(event, value) {
    console.log(this)
    this.setState({loading: true, artists: [{name: 'hi!'}]});
    this.props.actions.retrieveTypeaheadSuggestions(value)
  }

  selectHandler(value, item) {
    console.log(this)
    // set the menu to only the selected item
    this.props.actions.selectTypeaheadSuggestion()
  }

  renderItem(item, isHighlighted) {
    const classes = classNames([
      'suggestion',
      isHighlighted ? 'highlighted' : ''
    ]);

    return (
      <div
        className={classes}
        key={item.abbr}
        id={item.abbr}
      >
        {item.name}
      </div>
    );
  }

  render() {
    return (
      <div id="search-box">
        <Autocomplete
          ref="autocomplete"
          items={this.state.artists}
          getItemValue={(item) => item.name}
          onSelect={this.selectHandler.bind(this)}
          onChange={this.changeHandler.bind(this)}
          renderItem={this.renderItem}
        />
      </div>
    );
  }
};

export default SearchBox;
