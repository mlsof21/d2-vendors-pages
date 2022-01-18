import { render, screen } from '@testing-library/react';
import ItemPopupStatBar from './ItemPopupStatBar';

describe('ItemPopupStatBar', () => {
  it('render ItemPopupStatBar', () => {
    render(<ItemPopupStatBar />);
    const itempopupstatbarElement = screen.getByText('This is the ItemPopupStatBar page');

    expect(itempopupstatbarElement).toBeInTheDocument();
  });
});

