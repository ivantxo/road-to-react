import React from 'react';
import axios from 'axios';
import { sortBy } from 'lodash';
import './App.css';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const useSemiPersistentState = (key, initialState) => {
  const isMounted = React.useRef(false);
    
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      localStorage.setItem(key, value);
    }
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

  const handleRemoveStory = React.useCallback(item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  }, []);

  // A) A callback gets introduced
  const handleSearchInput = event => {
    // C) "Calls back" to the place it was introduced
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = event => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };

  // console.log('B:App');

  return (
    <div className="container">
      <h1 className="headline-primary">My Hacker Stories</h1>

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
  <form onSubmit={ onSearchSubmit } className="search-form">
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
      className="button button_large"
    >
      Submit
    </button>
  </form>
);

const InputWithLabel = ({ id, value, type = 'text', onInputChange, children }) => (
  <>
    <label htmlFor={id} className="label">{ children }</label>
    &nbsp;
    <input
      id={ id }
      type={ type }
      value={ value }
      onChange={ onInputChange }
      className="input"
    />
  </>
);

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENT: list => sortBy(list, 'num_comments'),
  POINT: list => sortBy(list, 'points'),
};

const List = React.memo(
  ({ list, onRemoveItem }) => {
    const [sort, setSort] = React.useState({
      sortKey: 'NONE',
      isReverse: false,
    });

    const handleSort = sortKey => {
      const isReverse = sort.sortKey === sortKey && !sort.isReverse;
      setSort({ sortKey: sortKey, isReverse: isReverse });
    };

    const sortFunction = SORTS[sort.sortKey];
    const sortedList = sort.isReverse 
      ? sortFunction(list).reverse()
      : sortFunction(list);

    return (
      <div>
        <SortingControls onSort={handleSort} />
        {sortedList.map(item => (
          <Item 
            key={ item.objectID } 
            item={ item } 
            onRemoveItem={ onRemoveItem }
          />
        ))}
      </div>
    );
  }
);

const SortingControls = ({ onSort }) => (
  <div style={{ display: 'flex' }}>
    <span style={{ width: '40%' }}>
      <button 
        type="button" 
        className="button button_small"
        onClick={() => onSort('TITLE')}
      >
        Title&#8661;
      </button>
    </span>
    <span style={{ width: '30%' }}>
      <button 
        type="button" 
        className="button button_small"
        onClick={() => onSort('AUTHOR')}
      >
          Author&#8661;
        </button>
    </span>
    <span style={{ width: '10%' }}>
      <button 
        type="button" 
        className="button button_small"
        onClick={() => onSort('COMMENT')}
      >
        Comments&#8661;
      </button>
    </span>
    <span style={{ width: '10%' }}>
      <button 
        type="button" 
        className="button button_small"
        onClick={() => onSort('POINT')}
      >
        Points&#8661;
      </button>
    </span>
  </div>
);

const Item = ({ item, onRemoveItem }) => (
  <div style={{ display: 'flex' }}>
    <span style={{ width: '40%' }}>
      <a href={ item.url }>{ item.title }</a>
    </span>
    <span style={{ width: '30%' }}>{ item.author }</span>
    <span style={{ width: '10%' }}>{ item.num_comments }</span>
    <span style={{ width: '10%' }}>{ item.points }</span>
    <span style={{ width: '10%' }}>
      <button 
        type="button" 
        onClick={ () => onRemoveItem(item) }
        className="button button_small"
      >
        Dismiss
      </button>
    </span>
  </div>
);
export default App;
