import React from 'react';
import renderer from 'react-test-renderer';
import BarcodeScannerComponent from '../BarcodeScannerComponent';

it('renders correctly across screens', () => {
    const tree = renderer.create(<BarcodeScannerComponent />).toJSON();
    expect(tree).toMatchSnapshot();
  });