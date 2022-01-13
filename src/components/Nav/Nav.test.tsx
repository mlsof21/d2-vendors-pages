import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Nav from './Nav';

const TestComponent = (props: any) => (
  <MemoryRouter initialEntries={['/foo']} initialIndex={0}>
    <Nav />
  </MemoryRouter>
);

describe('Nav', () => {
  it('render nav', () => {
    render(<TestComponent />);

    const homeLink = screen.getByText('Home');
    const loginLink = screen.getByText('Login');

    expect(homeLink).toBeInTheDocument();
    expect(loginLink).toBeInTheDocument();
  });
});
