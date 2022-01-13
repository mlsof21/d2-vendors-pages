import { render, screen } from '@testing-library/react';
import Callback from './Callback';

describe('Callback', () => {
  it('render Callback', () => {
    render(<Callback />);
    const callbackElement = screen.getByText('This is the Callback page');

    expect(callbackElement).toBeInTheDocument();
  });
});
