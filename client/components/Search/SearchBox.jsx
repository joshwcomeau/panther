import React, { Component, PropTypes } from 'react';
import Autocomplete from 'react-autocomplete';
import classNames from 'classnames';

class SearchBox extends Component {
  changeHandler(ev) {
    const searchTerm = ev.target.value;
    this.props.actions.requestTypeaheadSuggestions(searchTerm)
  }

  selectHandler(suggestion) {
    this.props.actions.selectTypeaheadSuggestion()
  }

  renderSuggestions() {
    return this.props.search.get('suggestions').map( suggestion => {
      return (
        <div
          className="suggestion"
          key={suggestion.get('id')}
          onClick={this.selectHandler.bind(this, suggestion)}
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
          onChange={::this.changeHandler}
          value={this.props.search.get('term')}
        />
        <div className="suggestions">
          { this.props.search.get('suggestions') ? this.renderSuggestions() : null }
        </div>
      </div>
    );
  }
};

export default SearchBox;
