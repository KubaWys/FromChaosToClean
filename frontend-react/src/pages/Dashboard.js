import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNotifications } from '../hooks/useNotifications';
import NotificationList from '../components/NotificationList';
import AnalyticsStats from '../components/AnalyticsStats';
import { fetchAnalytics } from '../services/api';

async function trackAnalytics(event_type, user_id, data = {}) {
  try {
    await fetch('http://localhost:5000/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ event_type, user_id, data })
    });
  } catch {}
}


const Dashboard = () => {
  const { user, setUser } = useContext(UserContext);
  const { notifications, loading, error } = useNotifications(user.user_id);
  const [stats, setStats] = React.useState(null);

  React.useEffect(() => {
    fetchAnalytics(user.user_id).then(setStats);
  }, [user.user_id]);

  const handleLogout = async () => {
    if (user && user.user_id) {
      await trackAnalytics('logout', user.user_id);
    }
    localStorage.removeItem('authToken');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {loading ? 'Loading...' : <NotificationList notifications={notifications} />}
      {stats && <AnalyticsStats stats={stats} />}
      {error && <div style={{color:'red'}}>{error.message}</div>}
    </div>
  );
};

export default Dashboard;
