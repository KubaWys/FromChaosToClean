import React, { createContext, useState } from 'react';

export const UserContext = createContext();


function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch {
    return null;
  }
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const payload = parseJwt(token);
      if (payload && payload.user_id && payload.username) {
        return { user_id: payload.user_id, username: payload.username, role: payload.role };
      }
    }
    return null;
  });
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
