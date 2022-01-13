import { render, screen } from '@testing-library/react';
import Home from './Home';

describe('Home', () => {
  it('render Home', () => {
    render(<Home />);
    const homeElement = screen.getByText('This is the Home page');

    expect(homeElement).toBeInTheDocument();
  });
});
