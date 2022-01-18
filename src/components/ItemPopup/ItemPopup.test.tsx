import { render, screen } from '@testing-library/react';
import ItemPopup from './ItemPopup';

describe('ItemPopup', () => {
  it('render ItemPopup', () => {
    render(<ItemPopup />);
    const itemPopupElement = screen.getByText('This is the ItemPopup page');

    expect(itemPopupElement).toBeInTheDocument();
  });
});
