const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return token ? { "Authorization": `Bearer ${token}` } : {};
}

export async function fetchOrders() {
  const res = await fetch(`${API_BASE}/orders`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch orders");
  const data = await res.json();
  return data.orders || [];
}

export async function createOrder(productIds, quantities) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ productIds, quantities })
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
}
