import React from 'react';
import './App.css';

const initialStories = [
  {
    title: 'React',
    url: 'https://reactjs.org',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
  {
    title: 'PHP',
    url: 'https://www.php.net',
    author: 'Rasmus Lerdorf',
    num_comments: 3,
    points: 4,
    objectID: 2,
  },
  {
    title: 'git',
    url: 'https://git-scm.com/',
    author: 'Linus Torvalds',
    num_comments: 2,
    points: 6,
    objectID: 3,
  },
];

const getAsyncStories = () =>
  new Promise(resolve =>
    setTimeout(
      () => resolve({ data: { stories: initialStories } }),
      2000
    )
  );

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', '');

  const [stories, setStories] = React.useState([]);

  React.useEffect(() => {
    getAsyncStories().then(result => {
      setStories(result.data.stories);
    });
  }, []);

  const handleRemoveStory = item => {
    const newStories = stories.filter(
      story => item.objectID !== story.objectID
    );
    setStories(newStories);
  };

  // A) A callback gets introduced
  const handleSearch = event => {
    // C) "Calls back" to the place it was introduced
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter(story => {
    return story.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <hr />
      <InputWithLabel
        id="search"
        value={ searchTerm }
        onInputChange={ handleSearch }
      >
        <strong>Search:</strong>
      </InputWithLabel>

      <List list={ searchedStories } onRemoveItem={ handleRemoveStory } />
      <hr />
    </div>
  )
}

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

// const List = ({ list }) =>
//   list.map(item => 
//     <Item 
//       key={ item.objectID }
//       title={ item.title }
//       url={ item.url }
//       author={ item.author }
//       num_comments={ item.num_comments }
//       points={ item.points }
//     />);

// Above can be replaced and simplified with JS spread operator
// const List = ({ list }) =>
//   list.map(item => <Item key={ item.objectID } { ...item } />);

// Another level of abstraction: rest operator to destructure the objectID from the rest of the item object
// const List = ({ list }) =>
//   list.map(({ objectID, ...item }) => <Item key={objectID} { ...item } />);

// const Item = ({ title, url, author, num_comments, points }) => (
//   <div>
//     <span>
//       <a href={ url }>{ title }</a>
//     </span>
//     <span>{ author }</span>
//     <span>{ num_comments }</span>
//     <span>{ points }</span>
//   </div>
// );

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
