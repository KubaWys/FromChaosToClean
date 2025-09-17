const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export async function fetchNotifications(userId) {
  const res = await fetch(`${API_BASE}/notifications/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

export async function fetchAnalytics(userId) {
  const res = await fetch(`${API_BASE}/analytics/stats/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

export async function markNotificationRead(notificationId) {
  const res = await fetch(`${API_BASE}/notifications/${notificationId}/read`, { method: 'PUT' });
  if (!res.ok) throw new Error('Failed to mark as read');
  return res.json();
}
