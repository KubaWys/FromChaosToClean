import './App.css';
import { UserProvider } from './context/UserContext';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <UserProvider>
      <Dashboard />
    </UserProvider>
  );
}

export default App;