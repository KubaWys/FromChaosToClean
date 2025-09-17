import React from 'react';

const AnalyticsStats = ({ stats }) => (
  <div>
    <h3>User Analytics</h3>
    <div>User ID: {stats.user_id}</div>
    <div>Total Events: {stats.total_events}</div>
    <ul>
      {Object.entries(stats.events_by_type || {}).map(([type, count]) => (
        <li key={type}>{type}: {count}</li>
      ))}
    </ul>
  </div>
);

export default AnalyticsStats;
