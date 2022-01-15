import { render, screen } from '@testing-library/react';
import Settings from './Settings';

describe('Settings', () => {
  it('render Settings', () => {
    render(<Settings />);
    const settingsElement = screen.getByText('This is the Settings page');

    expect(settingsElement).toBeInTheDocument();
  });
});

