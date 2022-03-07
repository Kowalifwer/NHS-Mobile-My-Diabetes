import React from 'react';
import renderer from 'react-test-renderer';
import BPInputComponent from '../BPInputComponent';

it('renders correctly across screens', () => {
    const tree = renderer.create(<BPInputComponent />).toJSON();
    expect(tree).toMatchSnapshot();
  });