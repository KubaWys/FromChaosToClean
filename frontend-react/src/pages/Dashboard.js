import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNotifications } from '../hooks/useNotifications';
import NotificationList from '../components/NotificationList';
import AnalyticsStats from '../components/AnalyticsStats';
import { fetchAnalytics } from '../services/api';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const { notifications, loading, error } = useNotifications(user.user_id);
  const [stats, setStats] = React.useState(null);

  React.useEffect(() => {
    fetchAnalytics(user.user_id).then(setStats);
  }, [user.user_id]);

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
