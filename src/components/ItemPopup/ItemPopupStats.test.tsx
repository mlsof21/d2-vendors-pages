import { render, screen } from '@testing-library/react';
import ItemPopupStats from './ItemPopupStats';

describe('ItemPopupStats', () => {
  it('render ItemPopupStats', () => {
    render(<ItemPopupStats />);
    const itempopupstatsElement = screen.getByText('This is the ItemPopupStats page');

    expect(itempopupstatsElement).toBeInTheDocument();
  });
});

