import React from 'react';
import renderer from 'react-test-renderer';
import CustomButton from '../CustomButton';

it('renders correctly across screens', () => {
    const tree = renderer.create(<CustomButton />).toJSON();
    expect(tree).toMatchSnapshot();
  });