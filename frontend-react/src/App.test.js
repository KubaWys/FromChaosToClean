// Basic test for React App rendering
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome message', () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome to the Chaotic E-commerce Site/i);
  expect(linkElement).toBeInTheDocument();
});
