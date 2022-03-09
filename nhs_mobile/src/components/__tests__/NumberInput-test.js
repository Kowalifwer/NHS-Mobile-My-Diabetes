import React from 'react';
import renderer from 'react-test-renderer';
import NumberInput from '../NumberInput';

it('renders correctly across screens', () => {
    const tree = renderer.create(<NumberInput />).toJSON();
    expect(tree).toMatchSnapshot();
  });