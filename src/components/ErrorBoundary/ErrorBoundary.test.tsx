import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

describe('ErrorBoundary', () => {
  it('render ErrorBoundary', () => {
    render(<ErrorBoundary />);
    const errorBoundaryElement = screen.getByText('This is the ErrorBoundary page');

    expect(errorBoundaryElement).toBeInTheDocument();
  });
});
