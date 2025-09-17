import { render, screen } from '@testing-library/react';
import AnalyticsStats from '../components/AnalyticsStats';

test('renders analytics stats', () => {
  const stats = {
    user_id: 'u1',
    total_events: 2,
    events_by_type: { login: 1, logout: 1 }
  };
  render(<AnalyticsStats stats={stats} />);
  expect(screen.getByText(/User Analytics/)).toBeInTheDocument();
  expect(screen.getByText(/login: 1/)).toBeInTheDocument();
  expect(screen.getByText(/logout: 1/)).toBeInTheDocument();
});
