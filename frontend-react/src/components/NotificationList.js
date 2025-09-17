import React from 'react';

const NotificationList = ({ notifications }) => (
  <ul>
    {notifications.map((n) => (
      <li key={n.id}>
        <strong>{n.type}</strong>: {n.message} {n.read ? '(read)' : ''}
      </li>
    ))}
  </ul>
);

export default NotificationList;
