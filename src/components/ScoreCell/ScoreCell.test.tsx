import { render, screen } from '@testing-library/react';
import ScoreCell from './ScoreCell';

describe('ScoreCell', () => {
  it('render ScoreCell', () => {
    render(<ScoreCell />);
    const scorecellElement = screen.getByText('This is the ScoreCell page');

    expect(scorecellElement).toBeInTheDocument();
  });
});

