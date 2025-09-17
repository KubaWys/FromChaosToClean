import { render, screen } from '@testing-library/react';
import NotificationList from '../components/NotificationList';

test('renders notifications', () => {
  const notifications = [
    { id: '1', type: 'info', message: 'Test 1', read: false },
    { id: '2', type: 'alert', message: 'Test 2', read: true }
  ];
  render(<NotificationList notifications={notifications} />);
  expect(screen.getByText(/Test 1/)).toBeInTheDocument();
  expect(screen.getByText(/Test 2/)).toBeInTheDocument();
});
