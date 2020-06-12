import React from 'react';
import './App.css';

const list = [
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

const App = () => (
  <div>
    <h1>My Hacker Stories</h1>

    <hr />
    <label htmlFor="search">Search: </label>
    <input id="search" type="text" />

    <List />
    <hr />
  </div>
)

const List = () =>
  list.map((item) => (
      <div key={ item.objectID }>
        <span>
          <a href={item.url}>{item.title}</a>&nbsp;-&nbsp;
        </span>
        <span>{ item.author }</span>,&nbsp;
        <span>{ item.num_comments }</span>,&nbsp;
        <span>{ item.points }</span>
      </div>
  ));

export default App;
