import { render, screen } from '@testing-library/react';
import Spinner from './Spinner';

// test('renders spinner', () => {
//   render(<Spinner />);
//   const spinner = screen.getByRole('circle');
//   expect(spinner).toBeInTheDocument();
// });

test('renders spinner with text', () => {
  render(<Spinner text="This is a test" />);
  const textElement = screen.getByText(/This is a test/i);
  expect(textElement).toBeInTheDocument();
});
