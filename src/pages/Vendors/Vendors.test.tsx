import { render, screen } from '@testing-library/react';
import Vendors from './Vendors';

describe('Vendors', () => {
  it('render Vendors', () => {
    render(<Vendors />);
    const vendorsElement = screen.getByText('This is the Vendors page');

    expect(vendorsElement).toBeInTheDocument();
  });
});

