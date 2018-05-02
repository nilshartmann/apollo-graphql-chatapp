import * as React from "react";

import { Row, Col } from "../layout";
import Button from "../components/Button";
import Editor from "../components/Editor";
interface SearchFormProps {
  onSearch(searchString: string): void;
}

interface SearchFormState {
  searchString: string;
}

export default class SearchForm extends React.Component<SearchFormProps, SearchFormState> {
  readonly state: SearchFormState = {
    searchString: ""
  };

  onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.charCode === 13 && this.validSearchString()) {
      e.preventDefault();
      this.doSearch();
    }
  };

  onSearchStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchString: e.currentTarget.value });
  };

  doSearch = () => {
    const { onSearch } = this.props;
    const { searchString } = this.state;

    onSearch(searchString);
  };

  validSearchString = () => {
    const { searchString } = this.state;

    return !!searchString;
  };

  render() {
    const { searchString } = this.state;

    const searchButtonDisabled = !this.validSearchString();

    return (
      <Row>
        <Col>
          <label htmlFor="searchInputField">Search</label>
          <input
            type="text"
            id="searchInputField"
            name="searchString"
            value={this.state.searchString}
            onChange={this.onSearchStringChange}
            onKeyPress={this.onKeyPress}
          />
          <Button disabled={searchButtonDisabled} onClick={this.doSearch}>
            Search
          </Button>
        </Col>
      </Row>
    );
  }
}
