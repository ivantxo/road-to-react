import React from 'react';

import { 
  render,
  screen,
  fireEvent,
  act,
} from '@testing-library/react';

import App, {
  storiesReducer,
  Item,
  List,
  SearchForm,
  InputWithLabel,
} from './App';
import { tsExternalModuleReference } from '@babel/types';

// Testing a function
const storyOne = {
  title: 'React',
  url: 'https://reactjs.org/',
  author: 'Jordan Walke',
  num_comments: 3,
  points: 4,
  objectID: 0,
};

const storyTwo = {
  title: 'Redux',
  url: 'https://reactjs.org/',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectID: 1,
};

const stories = [storyOne, storyTwo];

// describe('storiesReducer', () => {
//   test('removes a story from all stories', () => {
//     const action = { type: 'REMOVE_STORY', payload: storyOne };
//     const state = { data: stories, isLoading: false, isError: false };

//     const newState = storiesReducer(state, action);

//     const expectedState = {
//       data: [storyTwo],
//       isLoading: false,
//       isError: false,
//     };

//     expect(newState).toStrictEqual(expectedState);
//   });
// });

// describe('Item', () => {
//   test('renders all properties', () => {
//     render(<Item item={storyOne} />);
//     screen.debug();
//   });
// });

describe('something truthy and falsy', () => {
  it('true to be true', () => {
    expect(true).toBe(true);
  });
 
  it('false to be false', () => {
    expect(false).toBe(false);
  });
});