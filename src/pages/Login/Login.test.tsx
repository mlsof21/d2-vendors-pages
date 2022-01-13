import { render, screen } from '@testing-library/react';
import Login from './Login';

test('renders Login with Bungie url', () => {
  render(<Login />);
  const loginElement = screen.getByText('Login with Bungie.net');
  expect(loginElement).toBeInTheDocument();
});
