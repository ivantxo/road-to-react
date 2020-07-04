import React from 'react';
import axios from 'axios';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };

    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };

    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };

    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          story => action.payload.objectID !== story.objectID
        ),
      };

    default:
      throw new Error();
  }
};

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', '');

  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  );

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );

  // A
  const handleFetchStories = React.useCallback(async() => { // B
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    try {
      const result = await axios.get(url);

      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [url]);

  React.useEffect(() => {
    handleFetchStories(); // C
  }, [handleFetchStories]); // D

  const handleRemoveStory = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  // A) A callback gets introduced
  const handleSearchInput = event => {
    // C) "Calls back" to the place it was introduced
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = event => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <hr />
      <SearchForm
        searchTerm={ searchTerm }
        onSearchInput={ handleSearchInput }
        onSearchSubmit={ handleSearchSubmit }
      />

      { stories.isError && <p>Something went wrong...</p> }

      { stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List
          list={ stories.data }
          onRemoveItem={ handleRemoveStory }
        />
      ) }

      <hr />
    </div>
  )
}

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
}) => (
  <form onSubmit={ onSearchSubmit }>
    <InputWithLabel
      id="search"
      value={ searchTerm }
      onInputChange={ onSearchInput }
    >
      <strong>Search:</strong>
    </InputWithLabel>

    &nbsp;&nbsp;<button
      type="submit"
      disabled={ !searchTerm }
    >
      Submit
    </button>
  </form>
);

const InputWithLabel = ({ id, value, type = 'text', onInputChange, children }) => (
  <>
    <label htmlFor={id}>{ children }</label>
    &nbsp;
    <input
      id={ id }
      type={ type }
      value={ value }
      onChange={ onInputChange }
    />
  </>
);

const List = ({ list, onRemoveItem }) =>
  list.map(item => (
    <Item 
      key={ item.objectID } 
      item={ item } 
      onRemoveItem={ onRemoveItem }
    />
  ));

const Item = ({ item, onRemoveItem }) => (
  <div>
    <span>
      <a href={ item.url }>{ item.title }</a>&nbsp;-&nbsp; 
    </span>
    <span>{ item.author }&nbsp;-&nbsp; </span>
    <span>{ item.num_comments }&nbsp;-&nbsp;</span>
    <span>{ item.points } - &nbsp;&nbsp;</span>
    <span>
      <button type="button" onClick={ () => onRemoveItem(item) }>
        Dismiss
      </button>
    </span>
  </div>
);
export default App;
