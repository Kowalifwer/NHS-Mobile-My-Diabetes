import React from 'react';
import renderer from 'react-test-renderer';
import Email from '../Email';

test('renders correctly', () => {
    const tree = renderer.create(<Email />).toJSON();
    expect(tree).toMatchSnapshot();
  });