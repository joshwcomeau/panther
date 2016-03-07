import React, { Component, PropTypes } from 'react';
import Autocomplete from 'react-autocomplete';
import classNames from 'classnames';
import isNumber from 'lodash/isNumber';


class SearchBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: null
    };
  }

  componentDidMount() {
    this._input.focus();
  }

  // Handle input changes, new search terms.
  changeHandler(ev) {
    const searchTerm = ev.target.value;
    this.props.actions.requestTypeaheadSuggestions(searchTerm)
  }

  // Handle typeahead controls (moving around, selecting an entry)
  controlsHandler(ev) {
    let selected = this.state.selectedIndex;

    switch (ev.which) {
      case keys.UP:
        if ( selected > 0 ) {
          this.setState({selectedIndex: selected - 1});
        }
        break;
      case keys.DOWN:
        if ( selected < 8 ) {
          this.setState({selectedIndex: isNumber(selected) ? selected + 1 : 0});
        }
        break;
      case keys.ENTER:
        this.selectHandler(selected);
        break;
    }
  }

  // Handle the confirmation of a selection, either from click or through the
  // controlsHandler.
  selectHandler(selectedIndex) {
    // If we've manually supplied a selected one (on click), override the one
    // in our state.
    this.setState({
      selectedIndex,
      confirmedIndex: selectedIndex
    });

    const suggestion = this.props.search.getIn(['suggestions', selectedIndex]);

    this.props.actions.selectArtist(suggestion)
  }

  renderSuggestions() {
    return this.props.search.get('suggestions').map( (suggestion, i) => {
      const classes = classNames([
        'suggestion',
        this.state.selectedIndex === i ? 'highlighted' : null,
        this.state.confirmedIndex === i ? 'confirmed' : null
      ]);

      return (
        <div
          className={classes}
          key={suggestion.get('id')}
          onClick={this.selectHandler.bind(this, i)}
        >
          { suggestion.get('name') }
        </div>
      )
    });
  }

  render() {
    return (
      <div id="search-box">
        <input
          className="typeahead"
          onKeyUp={::this.controlsHandler}
          onChange={::this.changeHandler}
          value={this.props.search.get('term')}
          ref={(i) => this._input = i}
        />
        <div className="suggestions">
          { this.props.search.get('suggestions') ? this.renderSuggestions() : null }
        </div>
      </div>
    );
  }
};

const keys = {
  UP: 38,
  DOWN: 40,
  ENTER: 13
};


export default SearchBox;
