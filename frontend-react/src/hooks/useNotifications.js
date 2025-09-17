import { useState, useEffect } from 'react';
import { fetchNotifications } from '../services/api';

export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetchNotifications(userId)
      .then(setNotifications)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  return { notifications, loading, error };
}
